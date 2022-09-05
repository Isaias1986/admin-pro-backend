
require('dotenv').config();

const express = require('express');
const cors = require('cors');



const { dbConnection } = require('./database/config')


// inicializa el servidor
const app = express();

// configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());


// base de datos
dbConnection();



// rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

// app.get('/api/usuarios', (req,resp) => {
//     resp.json({
//         ok:true,
//         usuarios:[{
//             id:123,
//             nombre: 'Isaias'
//         }]
//     })
// });


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto '+ process.env.PORT);
});
