const express = require("express");
const expressLayouts = requiere("express-ejs-layouts");
const path = require("node:path");
const { leerJson } = require("./archivos");
const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`App disponible en http://localhost:${PORT}`);
    
})