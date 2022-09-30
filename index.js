
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');



const { dbConnection } = require('./database/config')


// inicializa el servidor
const app = express();

// configurar CORS
app.use(cors());

//Carpeta pública
app.use( express.static('public') );

//Lectura y parseo del body
app.use(express.json());


// base de datos
dbConnection();



// rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todos', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/login', require('./routes/auth'));

// Lo ultimo
app.get('*',(req, res) => {
    res.sendFile( path.resolve(__dirname, 'public/index.html'));
});


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto '+ process.env.PORT);
});
