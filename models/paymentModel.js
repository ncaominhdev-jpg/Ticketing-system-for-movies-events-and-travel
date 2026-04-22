const connection = require('../database');
const { DataTypes } = require('sequelize');
const Order = require('./orderModel');
const User = require('./userModel');

const Payment = connection.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'payments',
    timestamps: true,
});

// Quan hệ: Một thanh toán thuộc về một đơn hàng
Payment.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(Payment, { foreignKey: 'order_id' });

// Quan hệ: Một thanh toán được thực hiện bởi một người dùng
Payment.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Payment, { foreignKey: 'user_id' });

module.exports = Payment;