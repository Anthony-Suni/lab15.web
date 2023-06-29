const express = require("express");
const app = express();
const port = 6661;
const mysql = require("mysql");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456",
  database: "laboratorio15",
});

connection.connect((error) => {
  if (error) {
    console.error("Error al conectar a MySQL: ", error);
    return;
  }
  console.log("Conexión exitosa a MySQL");

  app.get("/", (req, res) => {
    connection.query("SELECT * FROM alumnos", (error, resultados) => {
      if (error) {
        console.error("Error al obtener los datos: ", error);
        return;
      }
      res.render("index", { datos: resultados });
    });
  });

  app.get("/editar/:id", (req, res) => {
    const id = req.params.id;

    // Realizar consulta a la base de datos para obtener los datos del registro con el ID especificado
    connection.query(
      "SELECT * FROM alumnos WHERE id = ?",
      [id],
      (error, resultados) => {
        if (error) {
          console.error("Error al obtener los datos: ", error);
          return;
        }
        const alumno = resultados[0]; // Obtener el primer registro de los resultados
        res.render("editar", { alumno: alumno });
      }
    );
  });

  app.post("/actualizar/:id", (req, res) => {
    const id = req.params.id;
    const nuevoDato = req.body.editarDato;
    const nuevaEdad = req.body.editarEdad;
    const nuevoComentario = req.body.editarComentario;

    const consulta =
      "UPDATE alumnos SET nombre = ?, edad = ?, comentario = ? WHERE id = ?";
    connection.query(
      consulta,
      [nuevoDato, nuevaEdad, nuevoComentario, id],
      (error, results) => {
        if (error) {
          console.error("Error al actualizar datos: ", error);
          return;
        }
        console.log("Dato actualizado exitosamente");
        res.redirect("/");
      }
    );
  });

  app.post("/", (req, res) => {
    const nuevoDato = req.body.nuevoDato;
    const nuevaEdad = req.body.nuevaEdad;
    const nuevoComentario = req.body.nuevoComentario;
    const consulta =
      "INSERT INTO alumnos (nombre, edad, comentario) VALUES (?, ?, ?)";
    connection.query(
      consulta,
      [nuevoDato, nuevaEdad, nuevoComentario],
      (error, results) => {
        if (error) {
          console.error("Error al insertar datos: ", error);
          return;
        }
        console.log("Dato insertado exitosamente");
        res.redirect("/");
      }
    );
  });

  app.post("/eliminar/:id", (req, res) => {
    const id = req.params.id;
    const consulta = "DELETE FROM alumnos WHERE id = ?";
    connection.query(consulta, [id], (error, results) => {
      if (error) {
        console.error("Error al eliminar dato: ", error);
        return;
      }
      console.log("Dato eliminado exitosamente");
      res.redirect("/");
    });
  });
  
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
