const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("node:path");
const { leerJson } = require("./archivos");
const expressEjsLayouts = require("express-ejs-layouts");
const PORT = 3000;

const rutaMascotas = path.join(__dirname, "..", "datos", "mascotas.json");

async function main() {
  const mascotas = await leerJson(rutaMascotas);
  const app = express();

  //vistas (view engine)
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));

  //layouts plantillas
  app.use(expressLayouts);
  app.set("layaout", "layouts/main");

  // archivos estáticos:Permite que cualquier archivo
  // dentro de la carpeta public sea accesible públicamente
  // a través del navegador (por ejemplo, http://localhost:3000/lucas.png).
  app.use(express.static(path.join(__dirname, "..", "public")));

  //procesamiento de datos de formularios (req.body)
  app.use(express.urlencoded({ extended: false }));

  //ruta para obtener mascotas
  app.get("/api/mascotas", (req, res) => {
    res.json(mascotas);
  });
  app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Mascoteros" });
  });

  //formulario render nueva mascota
  app.get("/mascotas/nueva", (req, res) => {
    res.render("mascotas/nueva", {
      titulo: "Nueva Mascota",
      error: null,
      valores: {},
    });
  });

  //render ruta de busqueda por id
  app.get("mascotas/:id", (req, res) => {
    const id = Number(req.params.id);
    const mascota = mascotas.find((elemento) => elemento.id === id);
    if (!mascota) {
      return res.status(404).render("no-encontrado", {
        titulo: "producto no encontrado",
        mensaje: "no existe una mascota con ese identificador",
      });
    }

    res.render("mascotas/detalle", {
      titulo: mascota.nombre,
      mascota,
    });
  });

app.post("/mascotas",(req,res)=>{
    

})


  app.listen(PORT, () => {
    console.log(`App disponible en http://localhost:${PORT}`);
  });
}

main().catch((error) => {
  console.error("no se puede iniciar la aplicacion", error);
  process.exitCode = 1;
});
