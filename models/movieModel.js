const connection = require("../database");
const { DataTypes } = require("sequelize");
const MovieDate = require("./movieDateModel");

const Movie = connection.define(
  "Movie",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    director: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    actors: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    release_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "movies",
    timestamps: true,
  }
);

Movie.associate = (models) => {
  Movie.hasMany(models.MovieDate, {
    foreignKey: "movie_id",
    as: "movie_dates",
  });
};

module.exports = Movie;
