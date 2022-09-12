const jwt = require('jsonwebtoken');


const validarJWT = (req, res, next) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'No hay token en la petición'
        });
    }

    try{
        const {uid,email} = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        req.email = email;
        next();
    }catch(error){
        return res.status(401).json({
            ok:false,
            msg: 'Token no valido'
        });
    }

    
}

module.exports = {
    validarJWT
}