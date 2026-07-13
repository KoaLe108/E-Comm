// CLI: npm install mongoose --save
const mongoose = require('mongoose');
const ImageUtil = require('../utils/ImageUtil');

// schemas
const AdminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String
}, { versionKey: false });

const CategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String
}, { versionKey: false });

const CustomerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    phone: String,
    email: String,
    active: Number,
    token: String,
}, { versionKey: false });

const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    image: {
        type: String,
        get: ImageUtil.getProductImageSrc
    },
    cdate: Number,
    category: CategorySchema,
    quantity: Number
}, { 
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true }
});

const ItemSchema = mongoose.Schema({
    product: ProductSchema,
    quantity: Number
}, { 
    versionKey: false, 
    _id: false,
    toJSON: { getters: true },
    toObject: { getters: true }
});

const OrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cdate: Number,
    total: Number,
    status: String,
    customer: CustomerSchema,
    items: [ItemSchema]
}, { 
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true }
});

const PromotionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 }
}, { versionKey: false });

// models
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const Promotion = mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);

module.exports = { Admin, Category, Customer, Product, Order, Promotion };