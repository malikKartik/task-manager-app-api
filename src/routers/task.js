const express = require('express')
const router = new express.Router()
const Task = require('../models/task')


router.post('/tasks',async (req,res)=>{
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }

    // task.save().then((result)=>{
    //     res.status(201).send(result)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

router.get('/tasks',async (req,res)=>{
    
    try{
        const tasks = await Task.find()
        res.send(tasks)
    } catch(e){
        res.status(400).send('No data found')
    }
    
    // Task.find().then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send('bad requests')
    // })
})

router.get('/tasks/:id',async (req,res)=>{
    const _id = req.params.id
    // Task.findOne({
    //     _id
    // }).then((task)=>{
    //     if(!task){
    //         return res.status(404).send('Task not found')
    //     }
    //     res.send(task)
    // }).catch(()=>{
    //     res.status(500).send()
    // })
    try{
        const task = await Task.findOne({_id})
        if(!task){
            return res.status(404).send('Task not found')
        }
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
    
})

router.patch('/tasks/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }
    try{

        const task = await Task.findById(req.params.id)
        await updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        task.save()

        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(500).send("something is not right")
    }
})

router.delete('/tasks/:id', async (req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send({error:"Not found"})
        }
        res.send(task)
    }catch(e){
        res.status(400).send({error:"something is not as expected"})
    }
})

module.exports = router