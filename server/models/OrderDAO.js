require('../utils/MongooseUtil');
const models = require('./Models');

const OrderDAO = {
    async insert(order) {
        const mongoose = require('mongoose');
        order._id = new mongoose.Types.ObjectId();
        const result = await models.Order.create(order);
        return result;
    },

    async updateStatus(_id, status) {
        const query = { _id: _id };
        const update = { status: status };
        const order = await models.Order.findOneAndUpdate(query, update, { new: true }).exec();
        return order;
    },

    async selectByCustID(_cid) {
        const query = { 'customer._id': _cid };
        const orders = await models.Order.find(query).exec();
        return orders;
    },

    async selectCompleted() {
        const query = { status: 'completed' };
        const orders = await models.Order.find(query).exec();
        return orders;
    },

    async selectAll() {
        const query = {};
        const orders = await models.Order.find(query).exec();
        return orders;
     }
};
module.exports = OrderDAO;