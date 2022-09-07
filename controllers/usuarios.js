const { async } = require('rxjs');
const { response } = require('express');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const bcrypt = require('bcryptjs');


const getUsuarios = async(req,resp) => {

    const desde = Number(req.query.desde) || 0;
    
    const [usuarios, total] = await Promise.all([
                                                Usuario
                                                        .find({},'nombre email role google img')
                                                        .skip(desde)
                                                        .limit(5),
                                                Usuario.countDocuments()        
    ]);

    resp.json({
        ok:true,
        usuarios,
        total
    })
}


const crearUsuario = async(req,resp = response) => {

    const {email, password} = req.body;
    
    try {

        const existeEmail = await Usuario.findOne(
            {email}
        );
        
        if(existeEmail){
            return resp.status(400).json({
                ok:false,
                msg:'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);

        //guardar contraseña
        await usuario.save();

        const token = await generarJWT(usuario.id);

        resp.json({
            ok:true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'    
        });
    }


    
}


const actualizarUsuario = async(req, res = response) => {
// TODO: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }

        // Actualizaciones
        const {password,google,email,...campos} = req.body;

        if(usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({ email});
            if(existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos, {new:true})


        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado!!!'
        })
    }
}


const eliminarUsuario = async(req, resp = response) => {
    const uid = req.params.id;

    try{
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return resp.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }

        await Usuario.findByIdAndDelete(uid);

        resp.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    }catch(error){
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}