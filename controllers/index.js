const express = require('express');
const app = express();

//=========================
//RUTAS
//=========================
app.use(require('./task.controller'));
app.use(require('./user.controller'));
app.use(require('./login.controller'));




module.exports = app;