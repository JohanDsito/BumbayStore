import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth:{persistSession:false} });
const txt = readFileSync("datos/_prueba.csv","utf8").replace(/^\uFEFF/,"");
const lineas = txt.split("\n").filter(l=>l.trim());
const cab = lineas.shift().split(",");
const filas = lineas.map(l=>{
  const c=[]; let cur="", q=false;
  for (const ch of l){ if(q){ if(ch==='"') q=false; else cur+=ch; } else if(ch==='"') q=true; else if(ch===","){c.push(cur);cur="";} else if(ch!=="\r") cur+=ch; }
  c.push(cur); return Object.fromEntries(cab.map((h,i)=>[h.trim(),(c[i]??"").trim()]));
});
const cats=new Map();
for (const f of filas) if(!cats.has(f.categoria)) cats.set(f.categoria,{slug:f.categoria.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),nombre:f.categoria,orden:cats.size});
await sb.from("categorias").upsert([...cats.values()],{onConflict:"slug"});
const prods = filas.map(f=>({
  sku:f.sku, nombre:f.nombre,
  slug:(f.nombre+"-"+f.sku).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),
  categoria_slug:cats.get(f.categoria).slug, marca:f.marca||null,
  color:f.color||null, grupo:f.grupo||null,
  precio_unitario:Number(f.precio_unitario), precio_mayor:Number(f.precio_mayor),
  imagen:f.imagen||null, imagenes:(f.imagenes||"").split("|").map(x=>x.trim()).filter(Boolean),
  destacado:f.destacado==="si", activo:true,
}));
const { error } = await sb.from("productos").upsert(prods,{onConflict:"sku"});
console.log(error ? "ERROR: "+error.message : `${prods.length} productos de prueba cargados`);
