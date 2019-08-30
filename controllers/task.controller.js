const express = require('express');
const taskModel = require('../models/task.model');
const _ = require('underscore');

const  {checkToken} = require('../middlewares/authentication');

const app = express();



//========================
// SHOW ALL TASKS
//========================
app.get('/task', checkToken, (req, res) => {

    taskModel.find({ $or: [{ state: 'open' }, { state: 'in-progress' }, { state: 'completed' },{state: 'archived'} ] })
        .exec((err, allTask) => {
            if (err) return res.status(500).json({ ok: false, err });
            if (!allTask) return res.status(400).json({ ok: false, err });



            res.json({
                ok: true,
                task: allTask
            })


        });
});


//========================
// SHOW USER TASKS
//========================
app.get('/findtaskbyuser/:id', checkToken, (req, res) => {

    let id = req.params.id;
    taskModel.find({ user: { $in: [id] } }, { "name": 1, "description": 1, "state": 1 })
        .exec((err, allTask) => {
            if (err) return res.status(500).json({ ok: false, err });
            if (!allTask) return res.status(400).json({ ok: false, err });

            res.json({
                ok: true,
                task: allTask
            })
        });
});



//========================
// FIND TASK WITH USERS
//========================
app.get('/task/:id',checkToken, (req, res) => {
    let id = req.params.id;

    taskModel.findById(id)
        .populate('user', 'name email')
        .exec((err, task) => {
            if (err) return res.status(500).json({ ok: false, err });
            if (!task) return res.status(400).json({ ok: false, err });

            res.json({
                ok: true,
                task
            });
        });
});


//========================
// SHOW TASK BY STATE
//========================
app.get('/taskbystate/:id',checkToken, (req, res) => {

    let sta = req.params.id;

    taskModel.find({ state: sta })
        .exec((err, task) => {
            if (err) return res.status(500).json({ ok: false, err });
            if (!task) return res.status(400).json({ ok: false, err });

            res.json({
                ok: true,
                task
            });
        });
});


//========================
// CREATE A NEW TASK
//========================
app.post('/task',checkToken, (req, res) => {

    let body = req.body

    let task = new taskModel({
        name: body.name,
        description: body.description,
        state: body.state,
        user: body.user
    });

    task.save((err, storedTask) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!storedTask) return res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            task: storedTask
        });
    });
});


//========================
// EDIT TASK
//========================
app.put('/task/:id',checkToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'description']);

    taskModel.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, newTask) => {
        if (err) res.status(500).json({ ok: false, err });
        if (!newTask) res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            task: newTask
        });
    });

});


//========================
// EDIT STATE OF A TASK
//========================
app.put('/state-task/:id',checkToken, (req, res) => {
    let id = req.params.id;
    let state = req.body;

    taskModel.findByIdAndUpdate(id, state, { new: true, runValidators: true, context: 'query' }, (err, task) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!task) return res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            task
        });
    });
});


//========================
// ADD USER TO A TASK
//========================
app.put('/adduser/:id',checkToken, (req, res) => {
    let id = req.params.id;
    let iduser = req.body.user

    taskModel.findByIdAndUpdate(id, { $addToSet: { user: iduser } }, { new: true }, (err, task) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!task) return res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            task
        });
    });
});


//========================
// REMOVE USER FROM A TASK
//========================
app.put('/deleteuser/:id',checkToken, (req, res) => {

    let id = req.params.id;
    taskModel.findByIdAndUpdate(id, { $pull: { user: { $in: [req.body.user] } } }, { new: true }, (err, task) => {

        if (err) return res.status(500).json({ ok: false, err });

        if (!task) return res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            task
        });
    });
});


//========================
//DELETE USER
//========================
app.delete('/task/:id',checkToken, (req, res) => {
    let id = req.params.id;

    taskModel.findByIdAndRemove(id, (err, taskDeleted) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!taskDeleted) return res.status(400).json({ ok: false, err: { message: 'usuario no encontrado' } });

        res.json({
            ok: true,
            user: taskDeleted,
            message: 'tarea eliminada'
        });
    });
});

module.exports = app;