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

  //vistas (view engine): indica que vistas utilizaran el motor ejs
  app.set("view engine", "ejs");

  //indica donde se encuentra las vistas de la aplacacion
  app.set("views", path.join(__dirname, "..", "views"));

  //layouts plantillas
  app.use(expressLayouts);
  app.set("layout", "layouts/main");

  // archivos estáticos:Permite que cualquier archivo
  // dentro de la carpeta public sea accesible públicamente
  // a través del navegador (por ejemplo, http://localhost:3000/lucas.png).
  app.use(express.static(path.join(__dirname, "..", "public")));

  //permite recibir los datos enviados por el formulario html (req.body)
  app.use(express.urlencoded({ extended: false }));

  //ruta para obtener mascotas
  app.get("/api/mascotas", (req, res) => {
    res.json(mascotas);
  });
  app.get("/", (req, res) => {
    res.render("inicio", {
      titulo: "Mascoteros",
    });
  });

  app.get("/mascotas", (req, res) => {
    res.render("mascotas/lista", {
      titulo: "Listado de Mascotas",
      mascotas,
    });
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
  app.get("/mascotas/:id", (req, res) => {
    const id = Number(req.params.id);
    const mascota = mascotas.find((elemento) => elemento.id === id);
    if (!mascota) {
      return res.status(404).render("no-encontrado", {
        titulo: "Mascota no encontrada",
        mensaje: "No existe una mascota con ese identificador",
      });
    }

    res.render("mascotas/detalle", {
      titulo: mascota.nombre,
      mascota,
    });
  });

  app.post("/mascotas", (req, res) => {
    const { nombre, especie, edad, descripcion, estado } = req.body;

    const nombreLimpio = String(nombre ?? "").trim();
    const especieLimpia = String(especie ?? "").trim();
    const edadNumerica = Number(edad);
    const descripcionLimpia = String(descripcion ?? "").trim();
    const estadoLimpio = String(estado ?? "").trim();

    if (
      !nombreLimpio ||
      !especieLimpia ||
      !Number.isFinite(edadNumerica) ||
      !Number.isInteger(edadNumerica) ||
      edadNumerica < 0 ||
      edadNumerica > 30 || //limite de edad para el registro
      !descripcionLimpia ||
      !estadoLimpio
    ) {
      return res.status(404).render("mascotas/nueva", {
        titulo: "Nueva mascota",
        error: "Completa los campos con datos validos",
        valores: req.body,
      });
    }
    const ultimoId = mascotas.reduce(
      (mayorId, mascota) => Math.max(mayorId, mascota.id),
      0,
    );

    mascotas.push({
      id: ultimoId + 1,
      nombre: nombreLimpio,
      especie: especieLimpia,
      edad: edadNumerica,
      descripcion: descripcionLimpia,
      estado: estadoLimpio,
      imagen: "img/mascota.svg",
    });
    res.redirect("/mascotas");
  });

  app.listen(PORT, () => {
    console.log(`App disponible en http://localhost:${PORT}`);
  });
}

main().catch((error) => {
  console.error("no se puede iniciar la aplicacion", error);
  process.exitCode = 1;
});
