const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 6661; // Puedes ajustar el número de puerto según tus necesidades

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

// Configurar Express.js para servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Middleware para procesar datos enviados en formularios
app.use(express.urlencoded({ extended: true }));

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'laboratorio15'
});

// Conexión a la base de datos
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a MySQL: ', error);
    return;
  }
  console.log('Conexión exitosa a MySQL');

  // Ruta principal
  app.get('/', (req, res) => {
    // Realizar consulta a la base de datos
    connection.query('SELECT * FROM alumnos', (error, resultados) => {
      if (error) {
        console.error('Error al obtener los datos: ', error);
        return;
      }
      // Renderizar la vista y pasar los resultados a través del objeto locals
      res.render('index', { datos: resultados });
    });
  });

  // Manejar la solicitud POST para agregar datos
  app.post('/', (req, res) => {
    const nuevoDato = req.body.nuevoDato;
    // Aquí puedes agregar el código para insertar el nuevo dato en la base de datos

    // Consulta SQL de inserción
    const consulta = 'INSERT INTO alumnos (nombre, edad, comentario) VALUES (?, ?, ?)';

    // Ejecutar la consulta de inserción
    connection.query(consulta, [nuevoDato, 0, ''], (error, results) => {
      if (error) {
        console.error('Error al insertar datos: ', error);
        return;
      }
      console.log('Dato insertado exitosamente');
      res.redirect('/');
    });
  });

  // Iniciar el servidor
  app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
  });
});

// Cerrar la conexión cuando sea necesario
// connection.end();
