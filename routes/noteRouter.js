const express = require('express')
const noteRouter = express.Router()
const Note = require ('../models/note')

//get notes by userId <works>
noteRouter.get('/user', (req, res, next) => {
    Note.find({ user: req.auth._id}, (err, notes) => {
        if(err) {
            res.status(500)
            return next(err)
        }
        return res.status(200).send(notes)
    })
})

//add new note <works>
noteRouter.post('/', (req, res, next) => {
    //once user is setup use this
    req.body.user = req.auth._id
    req.body.username = req.auth.username
    console.log(req.body.user)
    
    const newNote = new Note(req.body)
    newNote.save((err, savedNote) => {
        if(err) {
            res.status(500)
            return next (err)
        }
        console.log(savedNote)
        res.status(201).send(savedNote)
    })
})

//delete note <works>
noteRouter.delete('/:noteId', (req, res, next) =>{
    Note.findOneAndDelete(
        {_id: req.params.noteId, user: req.auth._id},
        (err, deletedNote) => {
            if (err) {
                res.status(500)
                return next(err)
            }
            return res.status(200).send
            (`Successfully Deleted Note: ${deletedNote.title}`)
        }
    )
})

//edit note <works>
noteRouter.put('/:noteId', (req, res, next) => {
    Note.findOneAndUpdate(
        {_id: req.params.noteId, user: req.auth._id},
        req.body,
        {new: true},
        (err, updatedNote) => {
            if(err) {
                res.status(500)
                return next(err)
            }
            return res.status(201).send(updatedNote)
        }
    )
})

module.exports = noteRouter