const connection = require('../database');
const { DataTypes } = require('sequelize');
const User = require('./userModel');
const Movie = require('./movieModel');
const Tour = require('./tourModel');

const CustomerReview = connection.define('CustomerReview', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    comment: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'customer_reviews',
    timestamps: true,
});

// Quan hệ: Một đánh giá được viết bởi một người dùng
CustomerReview.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(CustomerReview, { foreignKey: 'user_id' });

// Quan hệ: Một đánh giá có thể liên kết với một phim
CustomerReview.belongsTo(Movie, { foreignKey: 'movie_id' });
Movie.hasMany(CustomerReview, { foreignKey: 'movie_id' });

// Quan hệ: Một đánh giá có thể liên kết với một tour
CustomerReview.belongsTo(Tour, { foreignKey: 'tour_id' });
Tour.hasMany(CustomerReview, { foreignKey: 'tour_id' });

module.exports = CustomerReview;