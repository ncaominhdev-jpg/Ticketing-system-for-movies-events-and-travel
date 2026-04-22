const connection = require('../database');
const { DataTypes } = require('sequelize');

const User = connection.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1: Hoạt động, 2: Khóa',
    },
    role: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 2,
        comment: '1: Admin, 2: Người dùng',
    },
}, {
    tableName: 'users',
    timestamps: true,
});

module.exports = User;