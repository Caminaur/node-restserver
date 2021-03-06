const jwt = require('jsonwebtoken');

// =================
// Verificar Token
// =================
let verificaToken = ( req, res, next ) => {

  // Obtenemos el token de los headers
  let token = req.get('Authorization');

  jwt.verify( token, process.env.SEED, ( err, decoded) => {

    if ( err ) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Debes proveer un token",
          err
        }
      });
    }

    // payload
    req.usuario = decoded.usuario;
    next()

  });

};

// =================
// Verificar ADMIN_ROLE
// =================

let verificaAdmin_Role = (req, res, next) => {

  let usuario = req.usuario;

  if (usuario.role === "ADMIN_ROLE") {
    next();
  } else {

    return res.json({
      ok: false,
      err: {
        message: "El usuario no es administrador"
      }
    });

  }
};


module.exports = {
  verificaToken,
  verificaAdmin_Role
}
