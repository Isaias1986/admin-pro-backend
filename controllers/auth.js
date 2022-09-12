const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVeryfy } = require('../helpers/google-verify');
const { async } = require('rxjs');

const login = async (req, res = response) => {

    const {email, password } = req.body;

    try{

        const usuarioDB = await Usuario.findOne({ email });

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg: 'Correo Invalido'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password);
        if( !validPassword ){
            return res.status(400).json({
                ok:false,
                msg: 'Contraseña no válida'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuarioDB.id,usuarioDB.email)



        res.json({
            ok:true,
            token
        })


    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con al administrador'
        });
    }
}


const googleSingIn = async (req, res = response) => {
    
    try {
        const { email, name, picture }  = await googleVeryfy(req.body.token);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if( !usuarioDB ){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }else{
            usuario = usuarioDB;
            usuario.google = true;
        }

        // guardar usuario
        await usuario.save();


         //Generar JWT
         const token = await generarJWT(usuario.id,usuario.email);
        res.json({
            ok:true,
            email, 
            name, 
            picture,
            token 
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Token de google no es correcto'
        })
    }

    

}


const renewToken = async(req, res = response) => {
        const uid = req.uid;
        const email = req.email;
      //Generar JWT
      const token = await generarJWT(uid,email);

      res.json({
        ok:true,
        token
    });
}

module.exports = {
    login,
    googleSingIn,
    renewToken
}