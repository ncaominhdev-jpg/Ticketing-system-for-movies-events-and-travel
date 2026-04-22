const connection = require("../database");
const { DataTypes } = require("sequelize");
const Tour = require("./tourModel");

const TravelItinerary = connection.define(
  "TravelItinerary",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    travel_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    itinerary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tour_id: {
      // Thêm trường foreign key
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        // Tùy chọn: khai báo ràng buộc khóa ngoại
        model: "tours", // Tên bảng trong database
        key: "id",
      },
    },
  },
  {
    tableName: "travel_itinerary",
    timestamps: true,
  }
);

// // Quan hệ: Một lịch trình thuộc về một tour
// TravelItinerary.belongsTo(Tour, { foreignKey: 'tour_id' });
// Tour.hasMany(TravelItinerary, { foreignKey: 'tour_id' });

// Định nghĩa quan hệ trong hàm associate
TravelItinerary.associate = (models) => {
  TravelItinerary.belongsTo(models.Tour, {
    foreignKey: "tour_id",
    as: "tour",
  });
};

module.exports = TravelItinerary;
