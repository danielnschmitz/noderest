const express = require('express');
const router  = express.Router();
const app = express();
const Project = require('../models/project');
const Task = require('../models/task');

router.post('/', async(req,res) => {
    try{
        const {title, description, tasks} = req.body;
        const project = await Project.create({title, description});

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({...task, project: project._id});

            await projectTask.save();
            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({project});
    }catch(err){
        return res.status(400).send({ error: 'Error creating new project!', message: err});
    }
});

router.post('/task/', async (req,res) => {
    try{
        const {title, project} = req.body;
        const task = await Task.create({title, project});

        await task.save();
        return res.send({task});
    }catch(err){
        return res.status(400).send({ error: 'Error creating new task!', message: err});
    }
});


router.get('/', async (req,res) => {
    try{
        const projects = await Project.find().populate(['tasks']);

        return res.send({projects});

    }catch(err){
        return res.status(400).send({ error: 'Error listing projects!'});
    }
});

router.get('/:projectId', async (req,res) => {
    try{
        const projects = await Project.findById(req.params.projectId).populate(['tasks']);

        return res.send({projects});

    }catch(err){
        return res.status(400).send({ error: 'Error listing project!'});
    }
});

router.put('/:projectId', async (req,res) => {
    try{
        const {title, description, tasks} = req.body;
        const project = await Project.findByIdAndUpdate(req.params.projectId, { 
            title, 
            description
        }, { new: true }); //por padrão o mongoose retorna o objeto antigo e não o atualizado, com esse param new, retorna atualizado

        project.tasks = [];
        await Task.deleteOne({project: project._id});

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();
            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({project});

    }catch(err){
        return res.status(400).send({ error: 'Error updating project!', message: err});
    }
});

router.put('/task/:taskID', async (req,res) => {
    try{
        const {title, project} = req.body;
        const task = await Task.findByIdAndUpdate(req.params.taskID, {
            title,
            project
        }, {new: true});

        await task.save();
        return res.send({task});
    }catch(err){
        return res.status(400).send({ error: 'Error updating task!', message: err});
    }
});

router.put('/task/completed/:taskID', async (req,res) => {
    try{
        const completed = true;
        const task = await Task.findByIdAndUpdate(req.params.taskID, {
            completed
        }, {new: true});

        await task.save();
        return res.send({task});
    }catch(err){
        return res.status(400).send({ error: 'Error updating task!', message: err});
    }
});

router.delete('/:projectId', async (req,res) => {
    try{
        await Task.deleteMany({project: req.params.projectId});
        await Project.findByIdAndRemove(req.params.projectId);
        

        return res.send();

    }catch(err){
        return res.status(400).send({ error: 'Error deleting projects!'});
    }
});

router.delete('/task/:taskID', async (req,res) => {
    try{
        const tasks = await Task.findByIdAndRemove(req.params.taskID);

        return res.send();

    }catch(err){
        return res.status(400).send({ error: 'Error deleting tasks!'});
    }
});

module.exports = app;
module.exports = router;