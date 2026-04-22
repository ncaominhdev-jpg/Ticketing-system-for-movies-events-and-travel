const { DataTypes } = require("sequelize");
const connection = require("../database");

const Concert = connection.define(
  "Concert",
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
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vip_price: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: false,
    },
    normal_price: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: false,
    }
  },

  {
    tableName: "concerts",
    timestamps: true,
  }
);

Concert.associate = (models) => {
  Concert.hasMany(models.ArtistImage, {
    foreignKey: "concert_id",
    as: "artists",
  });
};


module.exports = Concert;
