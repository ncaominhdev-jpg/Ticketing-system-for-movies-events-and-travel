const connection = require("../database");
const { DataTypes } = require("sequelize");

const MovieDate = require("./movieDateModel");

const MovieShowtime = connection.define(
  "MovieShowtime",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    show_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    vip_price: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: false,
    },
    normal_price: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: false,
    },
    movie_date_id: {
      type: DataTypes.INTEGER,
      references: {
        model: MovieDate,
        key: "id",
      },
    },
  },
  {
    tableName: "movie_showtimes",
    timestamps: true,
  }
);

// Quan hệ: Một ngày chiếu có nhiều lịch chiếu
MovieShowtime.associate = (models) => {
  MovieShowtime.belongsTo(models.MovieDate, {
    foreignKey: "movie_date_id",
    as: "movie_date",
  });
};

module.exports = MovieShowtime;
