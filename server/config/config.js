
// =================
// =====Puerto======
// =================

// Si la variable existe la setea, sino pone 3000
process.env.PORT = process.env.PORT || 3000;


// =================
// =====Entorno=====
// =================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'



// =================
// =======DB========
// =================

let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = 'mongodb+srv://das_admin_user:mEWBKsc5HBykVnMJ@cluster0.noapj.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
