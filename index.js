const { ObjectId } = require('mongodb');
const express = require('express');
const { connectToDb, getDb } = require('./db.js');
const { request, response } = require('express');
const db = require('./db.js');

//initialize app & middleware
const app = express();
app.use(express.json())

//db connection
connectToDb((err) => {
   if(!err) {
      app.listen(3000, () => {
         console.log("Listening on port 3000...");
      })
      db = getDb()
   }
});

app.get('/posts/', (request, response) => {
   let wall = []
   db.collection('posts')
      .find()
      .forEach(post => wall.push(post))
      .then(() => {
         response.status(200).json(wall)
      })
      .catch(() => response.status(500).json({error: 'Could not fetch posts'}));
})

//create a post
app.post('/posts', (request, response) => {
   const post = request.body
   db.collection('posts')
   .insertOne(post)
   .then(result => {
      response.status(201).json(result)
   })
   .catch( err => {
      response.status(500).json({error: "Could not write on wall"})
   })
})

//delete a post
app.delete('/posts/:id',(request, response) => {
   if(ObjectId.isValid(request.params.id)){
      db.collection('posts').deleteOne({_id: ObjectId(request.params.id)})
      .then(result => {
         response.status(200).json(result)
      }).catch(err => {
         response.status(500).json({error: "Could not delete post"})
      })
   } else {
      response.status(500).json({error: "Not valid post id"})
   }
});

//update a post
app.patch('/posts/:id', (request, response) =>{
   const updates = request.body
   if(ObjectId.isValid(request.params.id)){
      db.collection('posts')
      .updateOne({id: ObjectId(request.params.id)}, {$set: updates})
      .then(result => {
         response.status(200).json(result)
      })
   } else {
      response.status(500).json({error: "Not a valid post id"})
   }
})