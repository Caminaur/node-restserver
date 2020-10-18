const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Enumeracion

let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario'],
  },
  email: {
    type: String,
    unique: [true, 'El correo electronico es invalido'],
    required: [true, 'El correo es necesario'],
  },
  password: {
    type: String,
    required: [true, 'La password es obligatoria'],
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  },
});

// modificamos lo que se va a hacer con el objeto cuando se imprima en json
usuarioSchema.methods.toJSON = function() {

  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' });


module.exports = mongoose.model( 'Usuario', usuarioSchema );
