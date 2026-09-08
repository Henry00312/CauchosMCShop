import {URI} from '../config.js';

import mongoose from 'mongoose';

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
    //useCreateIndex: false
})
  .then(() => {
    //console.log('Conexión a la BD Exitosa');
  })
  .catch((err) => {
    console.error('Error de conexión a la base de datos:', err);
  });


const connection = mongoose.connection;

connection.once('open', () => {
    console.log('DB is connected');
});
