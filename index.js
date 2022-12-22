const express = require('express');
const { connectToDb, getDb } = require('./db.js');

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