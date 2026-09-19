const fs = require("node:fs/prmomises");

async function leerJson(ruta) 

{
const contenido = await fs.readFile(ruta, "utf8");
return JSON.parse(contenido);
    
}

module.exports = {leerJson};