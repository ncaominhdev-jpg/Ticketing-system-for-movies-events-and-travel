const express = require('express');
const router = express.Router();
const upload = require('./multerConfig');
const AdminConcertController = require("../../controllers/admin/concertController");

// Concerts
router.get('/admin/concert/list', AdminConcertController.getAllConcerts);
router.get('/admin/concert/add', AdminConcertController.getFormAddConcert);
router.post('/admin/concert/add', upload.single("image_url"), AdminConcertController.addConcert)
router.get('/admin/concert/edit/:id', AdminConcertController.getFormEditConcert);
router.post('/admin/concert/edit/:id', upload.single("poster"), AdminConcertController.updateConcert)
router.get('/admin/concert/details/:id',AdminConcertController.getConcertDetail);
router.get('/admin/concert/add-artist/:id', AdminConcertController.getFormAddArtistImage);
router.post('/admin/concert/add-artist/:id', upload.single("image_url"), AdminConcertController.addArtistImage)
router.get('/admin/concert/details/:id',AdminConcertController.getConcertDetail);
router.get('/admin/concert/edit-artist/:id', AdminConcertController.getFormEditArtist);
router.post('/admin/concert/edit-artist/:id', upload.single("image"), AdminConcertController.updateArtist)



module.exports= router;