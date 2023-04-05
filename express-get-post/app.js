const express = require("express");
const path = require("path");
const hbs = require("hbs");
const Movie = require("./models/Movie");
const bodyParser = require('body-parser');
require('./configs/db');

hbs.registerPartials(path.join(__dirname, "views", "partials"));

const app = express();

app.use(express.static("public"));
// ⚠️ IMPORTANTE: Middleware para poder utilizar req.body en los POST
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get("/", (request, response, next) => {
  Movie.find()
  .then(movies => {
    response.render('index', { movies })
  })
  .catch(error => console.error(error))
});

// Create a ranking page (10 movies order by rate)
app.get("/ranking", (req, res, next) => {
  Movie.find()
  .sort({ rate: -1 })
  .limit(10)
  .then(movies => {
    res.render('ranking-page', { movies })
  })
  .catch(error => console.error(error))
})

// Create random movie page
app.get("/random", (req, res, next) => {
  // Idea de José 😒
  // const rate = Math.floor(Math.random() * 10);
  // Movie.findOne({ rate: {$lte: rate } })
  // .then(movie => {
  //   // ...
  // })

  Movie.find({}, {title: 1, director: 1, rate: 1 })
  .then(movies => {
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    res.render('random-page', { movie: randomMovie })
  })
  .catch(error => console.error(error))
})

app.get("/movies/:id", (req, res, next) => {
  console.log('Params', req.params);
  // const id = req.params.id;
  const { id } = req.params;

  // Movie.findOne({ _id: id })
  Movie.findById(id)
  .then(movie => {
    res.render('details-page', { movie })
  })
  .catch(error => console.error(error))
})

app.get('/search-page', (req, res, next) => {
  res.render('search-page')
})

app.get('/search', (req, res, next) => {
  console.log(req.query)
  Movie.find({ $or:[{ title: {$regex: req.query.title, $options: 'i' } }, {director: {$regex: req.query.director, $options: 'i' } }] })
  .then((movies) => {
    res.render('search-page', { movies })
  })
  .catch(error => console.error(error))
})

app.get('/create', (req, res, next) => {
  res.render('create-page')
})

app.post('/create', (req, res, next) => {
  console.log('Body', req.body)
  Movie.create(req.body)
  .then(movie => {
    // res.redirect("/"); Redirige a la Home
    res.redirect(`/movies/${movie._id}`)
  })
  .catch(error => console.error(error))
})

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
