const connection = require("../database");
const { DataTypes } = require("sequelize");

const Movie = require("./movieModel");
const MovieShowtime = require("./movieShowtimeModel");

const MovieDate = connection.define(
  "MovieDate",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date_show: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Movie,
        key: "id",
      },
    },
  },
  {
    tableName: "movie_date",
    timestamps: true,
  }
);

MovieDate.associate = (models) => {
  MovieDate.belongsTo(models.Movie, { foreignKey: "movie_id", as: "movie" });
  MovieDate.hasMany(models.MovieShowtime, { foreignKey: "movie_date_id", as: "movie_showtimes" });
};

module.exports = MovieDate;
