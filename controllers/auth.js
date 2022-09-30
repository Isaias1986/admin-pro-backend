const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVeryfy } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');



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
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
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
            token,
            menu: getMenuFrontEnd(usuario.role) 
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
      const usuario = await Usuario.findById(uid);

      res.json({
        ok:true,
        token,
        usuario,
        menu: getMenuFrontEnd(usuario.role)
    });
}

module.exports = {
    login,
    googleSingIn,
    renewToken
}