
require('dotenv').config();

const express = require('express');
const cors = require('cors');



const { dbConnection } = require('./database/config')


// inicializa el servidor
const app = express();

// configurar CORS
app.use(cors());

// base de datos
dbConnection();



// rutas
app.get('/', (req,resp) => {
    resp.status(400).json({
        ok:true,
        msg:'hola mundo'
    })
});


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto '+ process.env.PORT);
});
