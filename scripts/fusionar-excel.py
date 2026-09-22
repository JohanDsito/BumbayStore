"""
Fusiona el Excel de producto con el borrador de fotos y escribe datos/productos.csv

    python scripts/fusionar-excel.py "C:/ruta/INFORMACION_PARA_PUBLICAR.xlsx"

De dónde sale cada cosa:

  hoja "Proforma Invoice"  ->  SKU real, nombre, ficha técnica, especificaciones,
                               modo de uso, beneficios y preguntas frecuentes
  hoja "PRECIOS"           ->  precio de publicación y precio de promoción
  datos/productos.borrador.csv -> imágenes ya convertidas, color y grupo

Lee el .xlsx con zipfile y XML de la biblioteca estándar: un .xlsx es un zip con
XML dentro, así que no hace falta instalar nada.

El emparejamiento entre el Excel y las carpetas de fotos es manual (la tabla
EQUIVALENCIAS) porque los nombres no coinciden: el Excel dice "PULI-(A)" y la
carpeta dice "PULIDORAS/AMARILLA". Al añadir productos en próximas rondas hay
que ampliar esa tabla.
"""

import csv
import io
import json
import os
import re
import sys
import zipfile
from xml.etree import ElementTree as ET

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
BORRADOR = "datos/productos.borrador.csv"
SALIDA = "datos/productos.csv"

# SKU del Excel  ->  SKU provisional del borrador de fotos
EQUIVALENCIAS = {
    "CAJA-HERRAMIENTA": "BT-001",
    "TAL-BRUSH-40-(AZ)": "BT-014",
    "PULI-(A)": "BT-011-AM",
    "PULI-(AZ)": "BT-011-AZ",
    "PULI-(N-GRIS)": "BT-011-GR",
    "NIVEL-16L-(A)": "BT-008-AM",
    "NIVEL-16L-(AZ)": "BT-008-AZ",
    "LLAVE-350-(A)": "BT-006",
    "LLAVE-800-(A)": "BT-007",
    "LLAVE-1350-(A)": "BT-004-AM",
    "LLAVE-1350-(AZ)": "BT-004-AZ",
    "LLAVE-2100-(A)": "BT-005-AM",
    "LLAVE-2100-(AZ)": "BT-005-AZ",
    "COMBO-5-(A)": "BT-012-AM",
    "COMBO-5-(AZ)": "BT-012-AZ",
    "PISTOLA-PINT-(A)": "BT-010",
    "PISTOLA-CLAV-(AZ)": "BT-009",
    "ROSCADORA-(AZ)": "BT-013",
}

# Precio de venta por SKU, en MILES de pesos (200 -> $200.000).
#
# Bumbay maneja una sola tarifa, ya a nivel de distribuidor, igual para todos:
# no hay un segundo precio "al por mayor". Esta lista reemplaza a la hoja
# PRECIOS del Excel, que traía dos columnas y quedó obsoleta.
PRECIOS_MILES = {
    "PULI-(A)": 200,
    "PULI-(AZ)": 200,
    "PULI-(N-GRIS)": 200,
    "NIVEL-16L-(A)": 270,
    "NIVEL-16L-(AZ)": 270,
    "LLAVE-350-(A)": 215,
    "LLAVE-350-(AZ)": 215,
    "LLAVE-800-(A)": 300,
    "LLAVE-800-(AZ)": 300,
    "LLAVE-1350-(A)": 410,
    "LLAVE-1350-(AZ)": 410,
    "LLAVE-2100-(A)": 550,
    "LLAVE-2100-(AZ)": 550,
    "COMBO-5-(A)": 700,
    "COMBO-5-(AZ)": 700,
    "TAL-BRUSH-40-(A)": 185,
    "TAL-BRUSH-40-(AZ)": 185,
    "PISTOLA-PINT-(A)": 165,
    "PISTOLA-CLAV-(AZ)": 500,
    "CAJA-HERRAMIENTA": 330,
    "HIDRO-NEG/NAR": 200,
    "ROSCADORA-(AZ)": 600,
    # Sin fotos todavía: quedan listados para cuando lleguen.
    "ADAP-SIERRA": None,
    "COMBO-PULI-SIERRA": 250,
}

# SKU provisional del borrador de fotos -> SKU real, para los productos que no
# aparecen en la hoja Proforma del Excel.
SKU_SUELTOS = {
    "BT-003": "HIDRO-NEG/NAR",
}

# ---------------------------------------------------------------------------
# Lectura del .xlsx
# ---------------------------------------------------------------------------
def columna(ref):
    letras = re.match(r"([A-Z]+)", ref).group(1)
    n = 0
    for c in letras:
        n = n * 26 + (ord(c) - 64)
    return n - 1


def leer_xlsx(ruta):
    z = zipfile.ZipFile(ruta)
    compartidas = []
    if "xl/sharedStrings.xml" in z.namelist():
        raiz = ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in raiz.findall(f"{NS}si"):
            compartidas.append("".join(t.text or "" for t in si.iter(f"{NS}t")))

    hojas = {}
    libro = ET.fromstring(z.read("xl/workbook.xml"))
    for i, h in enumerate(libro.iter(f"{NS}sheet"), 1):
        interna = f"xl/worksheets/sheet{i}.xml"
        if interna not in z.namelist():
            continue
        raiz = ET.fromstring(z.read(interna))
        filas = []
        for fila in raiz.iter(f"{NS}row"):
            celdas = {}
            for c in fila.findall(f"{NS}c"):
                v = c.find(f"{NS}v")
                if v is None:
                    inline = c.find(f"{NS}is")
                    valor = (
                        "".join(x.text or "" for x in inline.iter(f"{NS}t"))
                        if inline is not None
                        else ""
                    )
                else:
                    valor = (
                        compartidas[int(v.text)] if c.get("t") == "s" else (v.text or "")
                    )
                if valor.strip():
                    celdas[columna(c.get("r"))] = valor.strip()
            if celdas:
                filas.append(celdas)
        hojas[h.get("name")] = filas
    return hojas


# ---------------------------------------------------------------------------
# Troceado de las celdas largas
# ---------------------------------------------------------------------------
def partir_secciones(texto):
    """Separa la celda que trae MODO DE USO, BENEFICIOS y PREGUNTAS FRECUENTES."""
    if not texto:
        return "", [], []

    marcas = {
        "modo": r"MODO DE USO\s*:?",
        "beneficios": r"BENEFICIOS\s*:?",
        "faq": r"PREGUNTAS FRECUENTES\s*:?",
    }
    posiciones = []
    for clave, patron in marcas.items():
        m = re.search(patron, texto, re.I)
        if m:
            posiciones.append((m.start(), m.end(), clave))
    posiciones.sort()

    bloques = {}
    for i, (_, fin, clave) in enumerate(posiciones):
        corte = posiciones[i + 1][0] if i + 1 < len(posiciones) else len(texto)
        bloques[clave] = texto[fin:corte].strip()

    def vinetas(bloque):
        return [
            re.sub(r"^[-•·*]\s*", "", l).strip()
            for l in (bloques.get(bloque, "") or "").splitlines()
            if l.strip() and not re.fullmatch(r"[-•·*\s]*", l)
        ]

    # El modo de uso son pasos; se unen en un párrafo que se lee mejor en la ficha.
    modo = " ".join(vinetas("modo"))
    beneficios = vinetas("beneficios")

    faq = []
    for linea in vinetas("faq"):
        m = re.match(r"^(¿[^?]*\?)\s*(.*)$", linea, re.S)
        if m and m.group(2).strip():
            faq.append((m.group(1).strip(), m.group(2).strip()))
    return modo, beneficios, faq


def partir_ficha(texto):
    """De la celda FICHA TECNICA saca pares etiqueta/valor y el contenido del kit."""
    if not texto:
        return [], []
    cuerpo = re.sub(r"^\s*FICHA\s+TECNICA\s*", "", texto, flags=re.I)
    especificaciones, incluye = [], []
    for linea in cuerpo.splitlines():
        linea = linea.strip()
        if not linea:
            continue
        # "2*Baterías (3.0Ah)" es contenido del kit, no una especificación.
        m_kit = re.match(r"^(\d+)\s*\*\s*(.+)$", linea)
        if m_kit:
            incluye.append(f"{m_kit.group(1)} x {m_kit.group(2).strip()}")
            continue
        if ":" in linea:
            etiqueta, valor = linea.split(":", 1)
            etiqueta, valor = etiqueta.strip(), valor.strip()
            if etiqueta and valor:
                especificaciones.append((etiqueta, valor))
    return especificaciones, incluye


def limpiar_lista_numerada(texto):
    """'ESPECIFICACIONES 1) Velocidad variable 2) 6 meses...' -> lista de puntos."""
    if not texto:
        return []
    cuerpo = re.sub(r"^\s*ESPECIFICACIONES\s*", "", texto, flags=re.I)
    partes = re.split(r"\s*\d+\)\s*", cuerpo)
    return [p.strip(" .;\n") for p in partes if p.strip(" .;\n")]


def a_entero(v):
    if not v:
        return None
    d = re.sub(r"[^\d]", "", str(v))
    return int(d) if d else None


# ---------------------------------------------------------------------------
# Proceso
# ---------------------------------------------------------------------------
def main():
    ruta_excel = sys.argv[1] if len(sys.argv) > 1 else None
    if not ruta_excel or not os.path.exists(ruta_excel):
        print(f"No encuentro el Excel: {ruta_excel}")
        sys.exit(1)
    if not os.path.exists(BORRADOR):
        print(f"Falta {BORRADOR}. Ejecuta antes scripts/preparar-ronda.mjs")
        sys.exit(1)

    hojas = leer_xlsx(ruta_excel)
    proforma = hojas.get("Proforma Invoice", [])

    # --- Contenido de producto ---
    contenido = {}
    for fila in proforma:
        sku_excel = fila.get(1, "")
        destino = EQUIVALENCIAS.get(sku_excel)
        if not destino:
            continue
        especificaciones, incluye = partir_ficha(fila.get(4, ""))
        modo, beneficios, faq = partir_secciones(fila.get(6, ""))
        extras = limpiar_lista_numerada(fila.get(5, ""))
        contenido[destino] = {
            "sku_real": sku_excel,
            "nombre": re.sub(r"\s+", " ", fila.get(2, "")).strip(),
            "especificaciones": especificaciones,
            "incluye": incluye,
            "modo": modo,
            "beneficios": beneficios + [f"Incluye: {i}" for i in incluye] + extras,
            "faq": faq,
        }

    # --- Fusión con el borrador ---
    with io.open(BORRADOR, encoding="utf-8-sig", newline="") as f:
        filas = list(csv.DictReader(f))

    sin_precio, sin_contenido = [], []
    for fila in filas:
        provisional = fila["sku"]
        c = contenido.get(provisional)

        # El SKU real manda sobre el provisional del borrador de fotos.
        real = c["sku_real"] if c else SKU_SUELTOS.get(provisional, provisional)
        fila["sku"] = real

        miles = PRECIOS_MILES.get(real)
        if miles:
            fila["precio_unitario"] = str(miles * 1000)
        else:
            sin_precio.append(f'{real}  {fila["nombre"]}')
        # Precio único: la columna se conserva vacía por compatibilidad.
        fila["precio_mayor"] = ""

        if c:
            if c["especificaciones"]:
                fila["especificaciones"] = " | ".join(
                    f"{e}: {v}" for e, v in c["especificaciones"]
                )
                # Párrafo de apertura armado con los datos de la propia ficha.
                clave = dict(c["especificaciones"])
                partes = [p for p in (
                    clave.get("Voltaje") or clave.get("Voltaje nominal"),
                    clave.get("Tamaño del motor") or clave.get("Motor"),
                ) if p]
                fila["ficha_tecnica"] = (
                    f'{fila["nombre"]}. '
                    + (f'{" · ".join(partes)}. ' if partes else "")
                    + (f'Incluye {", ".join(c["incluye"]).lower()}. ' if c["incluye"] else "")
                    + "Importado y distribuido directamente por Bumbay Tools."
                )
            fila["modo_uso"] = c["modo"]
            fila["beneficios"] = " | ".join(c["beneficios"])
            fila["faq"] = " | ".join(f"{q}:: {r}" for q, r in c["faq"])
        else:
            sin_contenido.append(f'{real}  {fila["nombre"]}')

    # El grupo de color usa el SKU real, que ahora puede haber cambiado.
    por_grupo = {}
    for fila in filas:
        if fila["color"]:
            raiz = re.sub(r"-?\(?(A|AZ|AM|N-GRIS|GR)\)?$", "", fila["sku"]).rstrip("-")
            por_grupo.setdefault(raiz, []).append(fila)
    for raiz, grupo in por_grupo.items():
        for fila in grupo:
            fila["grupo"] = raiz if len(grupo) > 1 else ""

    # Un producto sin precio no se puede publicar.
    publicables = [f for f in filas if f["precio_unitario"]]

    with io.open(SALIDA, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=filas[0].keys())
        w.writeheader()
        w.writerows(publicables)

    print(f"Escrito {SALIDA} con {len(publicables)} de {len(filas)} versiones\n")
    conFicha = sum(1 for f in publicables if f["ficha_tecnica"])
    print(f"  con ficha técnica:     {conFicha}")
    print(f"  con especificaciones:  {sum(1 for f in publicables if f['especificaciones'])}")
    print(f"  con modo de uso:       {sum(1 for f in publicables if f['modo_uso'])}")
    print(f"  con preguntas frec.:   {sum(1 for f in publicables if f['faq'])}")

    if sin_precio:
        print(f"\nSIN PRECIO — quedan fuera del catálogo ({len(sin_precio)}):")
        for x in sin_precio:
            print("  · " + x)
    if sin_contenido:
        print(f"\nSIN CONTENIDO del Excel ({len(sin_contenido)}):")
        for x in sin_contenido:
            print("  · " + x)


if __name__ == "__main__":
    main()
