const express = require('express');
const router = express.Router();
const upload = require('./multerConfig');
const AdminTourController = require("../../controllers/admin/tourController");

// Tours
router.get('/admin/tour/list', AdminTourController.getTourList);
router.get('/admin/tour/add', AdminTourController.getFormAddTour);
router.post('/admin/tour/add', upload.single("image_url"), AdminTourController.postAddTour);
router.get('/admin/tour/edit/:id', AdminTourController.getFormEditTour);
router.post('/admin/tour/edit/:id', upload.single("image_url"), AdminTourController.postEditTour);
router.get('/admin/tour/details/:id', AdminTourController.getTourDetails);
router.delete('/admin/tour/delete/:id', AdminTourController.deleteTour);

router.get('/admin/tour/add-travelItinerary/:id', AdminTourController.getFormAddTravelItinerary);
router.post('/admin/tour/add-travelItinerary/:id', AdminTourController.AddTravelItinerary);

router.get('/admin/tour/edit-travelItinerary/:id', AdminTourController.getFormEditTravelItinerary);
router.post('/admin/tour/edit-travelItinerary/:id', AdminTourController.postEditTravelItinerary);

router.delete('/admin/tour/delete-travelItinerary/:id', AdminTourController.deleteTravelItinerary);

module.exports= router;