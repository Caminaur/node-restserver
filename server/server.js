require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// middlewares

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// para poder usar las rutas del usuario
app.use ( require('./routes/usuario' ) )

// mongooose local
// mongoose.connect('mongodb://localhost:27017/cafe', {
//             useNewUrlParser: true,
//             useFindAndModify: false,
//             useCreateIndex: true,
//             useUnifiedTopology: true
//         }, (err) => {
//             if (err) {
//                 throw err;
//             }
//             console.log('Base de Datos online');
//         });


// mongooose compass
mongoose.connect(process.env.URLDB, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        }, (err) => {
            if (err) {
                throw err;
            }
            console.log('Base de Datos online');
        });

app.listen(process.env.PORT, () => {
  console.log('Escuchando puerto: ', process.env.PORT);
});
