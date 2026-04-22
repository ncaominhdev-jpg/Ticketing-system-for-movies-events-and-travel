const express = require('express');
const router = express.Router();
const MovieController = require('../../controllers/client/movieController');

// Route hiển thị danh sách sản phẩm
router.get('/movie/list', MovieController.getAllMovies);
router.get('/movie/details/:id', MovieController.getMovieDetail);
router.get('/movie/buy-tickets/:id', MovieController.getBuyTickets);
router.get('/movie/pay-tickets/:id', MovieController.getPayTickets);
router.post('/movie/pay-tickets/:id', MovieController.postPayTickets);

module.exports = router;
