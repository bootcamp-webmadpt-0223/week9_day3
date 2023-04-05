const { model, Schema } = require('mongoose');

const movieSchema = new Schema({
  title: String,
  year: String,
  director: String,
  duration: String,
  genre: [String],
  rate: String
})

const Movie = model('Movie', movieSchema);
module.exports = Movie;