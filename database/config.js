
const mongoose = require('mongoose');


const dbConnection = async() => {    
    try {
      await mongoose.connect(process.env.DB_CNN);
        console.info('Db on linea')    
    } catch (error) {
        console.error(error);
        throw new Error('Error a la hora de iniciar la DB ver logs')
    }
    
}


module.exports =  {
    dbConnection
}