require('../utils/MongooseUtil');
const Models = require('./Models');

const PromotionDAO = {
  async selectAll() {
    const query = {};
    const promotions = await Models.Promotion.find(query).exec();
    return promotions;
  },
  async selectByID(_id) {
    const promotion = await Models.Promotion.findById(_id).exec();
    return promotion;
  },
  async selectByCode(code) {
    const query = { code: code };
    const promotion = await Models.Promotion.findOne(query).exec();
    return promotion;
  },
  async insert(promotion) {
    const mongoose = require('mongoose');
    promotion._id = new mongoose.Types.ObjectId();
    const result = await Models.Promotion.create(promotion);
    return result;
  },
  async update(promotion) {
    const newvalues = {
      code: promotion.code,
      name: promotion.name,
      discountPercentage: promotion.discountPercentage,
      isActive: promotion.isActive,
      quantity: promotion.quantity
    };
    const result = await Models.Promotion.findByIdAndUpdate(promotion._id, newvalues, { new: true });
    return result;
  },
  async delete(_id) {
    const result = await Models.Promotion.findByIdAndDelete(_id);
    return result;
  }
};

module.exports = PromotionDAO;
