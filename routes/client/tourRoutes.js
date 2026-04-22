const exprees = require('express');
const router = exprees.Router();
const TourController = require('../../controllers/client/tourController');

router.get('/tour/list', TourController.getTours);
router.get('/tour/details/:id', TourController.getTourDetail);
router.get('/tour/buy-tickets/:id', TourController.getBuyTickets);
router.get('/tour/pay-tickets/:id', TourController.getPayTickets);
router.post('/tour/pay-tickets/:id', TourController.postPayTickets);

module.exports = router;