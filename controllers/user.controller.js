const express = require('express');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

const  {checkToken, verificaAdmin_Role} = require('../middlewares/authentication');

const app = express();


//========================
// SHOW ALL USERS
//========================
app.get('/user', [checkToken, verificaAdmin_Role], (req, res) => {

    userModel.find({ role: 'USER_ROLE' })
        .exec((err, users) => {
            if (err) return res.status(500).json({ ok: false, err });
            if (!users) return res.status(400).json({ ok: false, err });

            res.json({
                ok: true,
                user: users
            });
        });
});


//========================
// FIND ONE USER
//========================
app.get('/user/:id', checkToken, (req, res) => {
    let id = req.params.id;

    userModel.findById(id)
        .exec((err, user) => {
            if (err) return res.status(500).json({ ok: false, err });
            if (!user) return res.status(400).json({ ok: false, err });

            res.json({
                ok: true,
                user
            });
        });
});


//========================
// CREATE A NEW USER
//========================
app.post('/user', [checkToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let user = new userModel({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });

    user.save((err, userStored) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!userStored) return res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            user: userStored
        });
    });
});


//========================
// EDIT USER
//========================
app.put('/user/:id', [checkToken,verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'role', 'state']);

    userModel.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, newUser) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!newUser) return res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            user: newUser
        });
    });
});


//========================
//DELETE USER
//========================
app.delete('/user/:id',[checkToken,verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    // let changeState = {
    //     state: false
    // };

    userModel.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!userDeleted) return res.status(400).json({ ok: false, err: { message: 'usuario no encontrado' } });

        res.json({
            ok: true,
            user: userDeleted,
            message: 'tarea eliminado'
        });
    });
});

module.exports = app;