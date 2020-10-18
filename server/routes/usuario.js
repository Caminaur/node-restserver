const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();
// peticiones
app.get('/usuario', function (req, res) {

  // aca le indicamos que si envian desde por request se lo guarda en una variable
  // en caso de que no, que esta sea igual a 0
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  /*
    - find() trae todos los usuarios, dentro le podemos pasar un objecto con condiciones o filtros
    - Como segundo parametro le podemos indicar que campos queremos que muestre ej
    find({condiciones}, "nombre email google")
  */

  Usuario.find({estado:true}, "nombre email role estado google img")
          .skip(desde) // salta los primeros 5
          .limit(limite) // cant que va a traer
          .exec( (err, usuarios) =>{

            if( err ) {
              // el return es para que en caso de que se haya un error termine la ejecucion
              return res.status(400).json({
                ok:false,
                err
              });
            }

            // cant de registros encontrados como primer parametro los filtros o condiciones de busqueda
            Usuario.count({ google:false, estado:true },(err, conteo) => {

              res.json({
                ok:true,
                usuarios,
                cuantos:conteo
              });

            });


          });

});

app.post('/usuario', function (req, res) {

  let body = req.body;

  // creamos un nuevo Usuario
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync( body.password, 10),
    role: body.role
  });

  // lo guardamos
  usuario.save( (err, usuarioDB) =>{

    if( err ) {
      // el return es para que en caso de que se haya un error termine la ejecucion
      return res.status(400).json({
        ok:false,
        err
      });
    }

    // si no hay error

    // ocultamos la password
    // usuarioDB.password = null;

    res.json({
      ok:true,
      usuario: usuarioDB
    });

  }); // save


}); // post

app.put('/usuario/:id', function (req, res) {

  let id = req.params.id;

  /*_underscore
    pick: recibe el objeto y como 2do parametro una lista de las propiedades que queremos mantener
    y realiza una copia de este objeto solamente con esas propiedades
  */
  let body = _.pick( req.body, ['nombre', 'email', 'img', 'role', 'estado'] );

  // borrar campos que no queremos que sean actualizados

  /* sin libreria */
  // delete body.password;
  // delete body.google;

  /* UPDATE */

  // 1ra forma
  // Usuario.findById( id, (err, usuarioDB) => {
  //   //
  // });

  // 2da forma
  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
    /*Notas*/
    /* Como 3er parametros ponemos un objeto con distintas propiedades
      new: true - Le estamos indicando que nos devuelva el objeto modificado
      runValidators: true - Ejecuta todas las validaciones indicadas en el modelo
    */
    if( err ) {
      // el return es para que en caso de que se haya un error termine la ejecucion
      return res.status(400).json({
        ok:false,
        err
      });
    }


    res.json({
        ok:true,
        usuario:usuarioDB
      });

  }); // findByIdAndUpdate


}); // PUT

app.delete('/usuario/:id', function (req, res) {

  let id = req.params.id;

  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

  let cambiaEstado = {
    estado: false
  }

  Usuario.findByIdAndUpdate(id, cambiaEstado, { new:true }, (err, usuarioBorrado) => {

    if( err ) {
      // el return es para que en caso de que se haya un error termine la ejecucion
      return res.status(400).json({
        ok:false,
        err
      });
    }

    if ( !usuarioBorrado ) {
      return res.status(400).json({
        ok:false,
        err: {
          'message': 'Usuario no encontrado'
        }
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado
    });

  });

});

// exportamos el archivo de app configurado
module.exports = app;
