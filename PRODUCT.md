# Product

<!-- impeccable:product-schema 1 -->

<!--
  Qué es Bumbay Store, para quién y qué la diferencia. Lo leen las skills de
  diseño antes de proponer o revisar cualquier pantalla. Los títulos van en
  inglés porque así los reconoce impeccable; el contenido, en español.
-->

## Platform

web

## Users

Dos públicos, con el mismo peso, que ven el mismo catálogo y el mismo precio:

- **Cliente final** en Colombia que compra para su casa o su trabajo, casi siempre desde el celular.
- **Negocios que revenden o compran por volumen**: ferreterías, talleres, contratistas y otras tiendas. Llegan con una cantidad en mente y quieren cotizar rápido.

Los dos buscan lo mismo: encontrar el producto, ver el precio real, armar el pedido y enviarlo sin llenar un proceso de pago largo.

## Product Purpose

Bumbay Store es un catálogo en línea de varios nichos. El cliente arma su pedido en la página y lo envía por WhatsApp; el pago y el envío se acuerdan en la conversación. El éxito es un pedido que llega al chat ya escrito: productos, cantidades, nombre y ciudad de destino.

Reemplaza a Bumbay Tools, que vendía un solo nicho. Llegan nichos nuevos con poco aviso, así que todo queda centralizado: una tienda, un carrito y un panel de administración.

## Positioning

- **Importador directo**: Bumbay trae la mercancía sin intermediarios.
- **Envío a todos los municipios de Colombia**.

Las dos promesas valen para todos los nichos, no solo para herramientas.

## Operating Context

- Los clientes navegan desde el celular y cierran la compra por WhatsApp. Hay un solo número de WhatsApp para toda la tienda.
- El pedido pide nombre y ciudad; la ciudad sale de la lista oficial de municipios del DANE, para agrupar los pedidos por zona al cotizar el envío.
- Los datos de los productos se preparan en Excel/CSV y las fotos llegan por rondas desde Drive; ambos se cargan con los scripts de `scripts/`.
- Un panel de administración permite editar precios, fotos, existencias y contenido de cada producto, y ver los pedidos iniciados y las búsquedas sin resultados.
- Los nichos y las decisiones de mercado las define el socio encargado de la parte económica.

## Capabilities and Constraints

- Estructura del catálogo: **nicho → categoría → producto**. Bumbay Tools (herramienta inalámbrica, plataforma de batería de 128V) es el primer nicho. Los demás nichos **están por definir**: cualquier nicho que aparezca antes es de ejemplo y debe poder reemplazarse fácilmente.
- Un solo precio por producto, igual para todos los clientes (no hay precio al por mayor).
- Un producto puede venir en varios colores; cada color tiene su SKU, su página y su foto.
- Agotado no es despublicado: el producto sigue visible e indexado, pero no se puede agregar al pedido.
- La visibilidad en buscadores importa: cada producto y categoría se genera en el servidor con datos estructurados.
- Las animaciones deben ser llamativas, pero el rendimiento manda: la página tiene que ir rápida en un celular de gama media.
- Tecnología: Next.js + Supabase en el plan gratuito de Vercel, sin backend aparte. Se evalúa la financiación con Sistecrédito como forma de pago adicional.

## Brand Commitments

- Nombre de la tienda: **Bumbay Store**.
- **Bumbay Tools sigue visible como submarca** del nicho de herramientas, con su propio acento, dentro de Bumbay Store.
- Material existente: el logotipo de Bumbay en `src/components/icons.tsx`.
- Tono: español de Colombia, directo y sencillo; le habla al cliente de "tú".

## Evidence on Hand

- Catálogo real del nicho de herramientas (fuera de git; datos de ejemplo en `src/data/products.seed.ts` y `datos/productos.ejemplo.csv`).
- No hay testimonios, cifras de clientes, reseñas ni menciones en prensa. No inventarlos.

## Product Principles

1. El pedido debe llegar completo a WhatsApp; nada en la página puede estorbar el envío.
2. Una tienda, muchos nichos: un nicho nuevo son datos, no un sitio nuevo.
3. Cada ficha de producto gana tráfico de buscadores por sí sola: texto real, precio real, disponibilidad real.
4. La velocidad en un celular de gama media está por encima de cualquier efecto.
