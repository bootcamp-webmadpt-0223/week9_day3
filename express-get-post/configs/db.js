const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
.connect('mongodb://127.0.0.1/video')
.then(db => {
  console.log(`Connected to db ${db.connection.name}`);
})
.catch((error) => console.log(error));