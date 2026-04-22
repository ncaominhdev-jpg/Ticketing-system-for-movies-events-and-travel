const express = require('express');
const router = express.Router();
const ConcertController = require("../../controllers/client/concertController");

// Concert
router.get('/concert/list',ConcertController.getConcerts);
router.get('/concert/details/:id',ConcertController.getConcertDetail);
router.get('/concert/buy-tickets/:id',ConcertController.getBuyTickets);
router.get('/concert/pay-tickets/:id', ConcertController.getPayTickets);
router.post('/concert/pay-tickets/:id', ConcertController.postPayTickets);

module.exports= router;