const connection = require("../database");
const Movie = require("./movieModel");
const MovieDate = require("./movieDateModel");
const MovieShowtime = require("./movieShowtimeModel");

// Khởi tạo model trước
const models = {
  Movie,
  MovieDate,
  MovieShowtime,
};

// Gọi hàm associate
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
