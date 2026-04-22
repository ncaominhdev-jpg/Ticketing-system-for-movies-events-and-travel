const e = require("express");
const Movie = require('../../models/movieModel');
const Concert = require('../../models/concertModel');
const Tour = require('../../models/tourModel');

class HomeController {
    static async getHomePage(req, res) {
        try {
            const movies = await Movie.findAll();
            const concerts = await Concert.findAll();
            const tours = await Tour.findAll();

            res.render('index', { title: 'Home', movies, concerts, tours });
        } catch (error) {
            console.error("Lỗi server:", error);
            res.status(500).send(`Lỗi server: ${error.message}`);
        }
    }
}

module.exports = HomeController;