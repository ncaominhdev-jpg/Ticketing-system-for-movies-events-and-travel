const { DataTypes } = require("sequelize");
const connection = require("../database");
const Concert = require("./concertModel");

const ArtistImage = connection.define(
  "ArtistImage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    artist_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    concert_id: {
      // Thêm trường foreign key
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Concert,
        key: "id",
      }
    }
  },
  {
    tableName: "artist_images",
    timestamps: true,
  }
);

ArtistImage.associate = (models) => {
  ArtistImage.belongsTo(models.Concert, {
    foreignKey: "concert_id",
    as: "concert",
  });
};

module.exports = ArtistImage;
