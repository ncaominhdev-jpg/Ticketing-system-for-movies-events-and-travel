const express = require('express');
const router = express.Router();
const upload = require('./multerConfig');
const AdminMovieController = require("../../controllers/admin/movieController");

// Movies
router.get('/admin/movie/list', AdminMovieController.getAllMovies);
router.get('/admin/movie/date/:id', AdminMovieController.getMovieDate);
router.get('/admin/movie/showtime/:id', AdminMovieController.getMovieShowtime);
router.get('/admin/movie/add', AdminMovieController.getFormAddMovie);
router.post('/admin/movie/add', upload.single("image_url"), AdminMovieController.addMovie)
router.get('/admin/movie/edit/:id', AdminMovieController.getFormEditMovie);
router.post('/admin/movie/edit/:id', upload.single("poster"), AdminMovieController.editMovie);
router.delete('/admin/movie/delete/:id', AdminMovieController.deleteMovie);

router.get('/admin/movie/add-date/:id', AdminMovieController.getFormMovieDate);
router.post('/admin/movie/add-date/:id', AdminMovieController.addMovieDate);

router.get('/admin/movie/add-showtime/:id', AdminMovieController.getFormShowTime);
router.post('/admin/movie/add-showtime/:id', AdminMovieController.addMovieShowtime);


module.exports= router;