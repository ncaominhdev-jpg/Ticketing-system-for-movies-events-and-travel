const connection = require("../database");
const { DataTypes } = require("sequelize");
const User = require("./userModel");
const MovieShowtime = require("./movieShowtimeModel");
const Concert = require("./concertModel");
const Tour = require("./tourModel");

const Order = connection.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    selected_seats: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

// Quan hệ: Một đơn hàng thuộc về một người dùng
Order.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Order, { foreignKey: "user_id" });

// Quan hệ: Một đơn hàng có thể liên kết với một lịch chiếu phim
Order.belongsTo(MovieShowtime, {
  foreignKey: "movie_showtimes_id",
  as: "movie_showtimes",
});

// Quan hệ: Một đơn hàng có thể liên kết với một concert
Order.belongsTo(Concert, { foreignKey: "concert_id" });
Concert.hasMany(Order, { foreignKey: "concert_id" });

// Quan hệ: Một đơn hàng có thể liên kết với một tour
Order.belongsTo(Tour, { foreignKey: "tour_id" });
Tour.hasMany(Order, { foreignKey: "tour_id" });

module.exports = Order;
