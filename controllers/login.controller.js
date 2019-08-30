const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require('../models/user.model');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    userModel.findOne({ email: body.email }, (err, userDb) => {
        if (err) return res.status(500).json({ ok: false, err });

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(usuario) o contraseña invalidos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario o (contraseña) invalidos'
                }
            });
        }

        //GENERAR EL TOKEN
        let Authorization = jwt.sign({
            user: userDb
        }, 'vapecl', { expiresIn: '48h' });

        //RESPUESTA DE LA PETICION
        res.json({
            ok: true,
            user: userDb,
            Authorization
        });
    });
});
module.exports = app;