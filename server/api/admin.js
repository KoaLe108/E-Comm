const express = require('express');
const router = express.Router();
// utils
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil');
// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');
const PromotionDAO = require('../models/PromotionDAO');

// login
router.post('/login', async function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    console.log('Login attempt - Username:', username, 'Password:', password);
    if (username && password) {
      const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
      console.log('Admin found:', admin);
      if (admin) {
        const token = JwtUtil.genToken(admin.username, admin.password);
        res.json({ success: true, message: 'Authentication successful', token: token });
      } else {
        res.json({ success: false, message: 'Incorrect username or password' });
      }
    } else {
      res.json({ success: false, message: 'Please input username and password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  try {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    res.json({ success: true, message: 'Token is valid', token: token });
  } catch (error) {
    console.error('Token check error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// category
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// API tạo category (POST)
router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const category = { name: name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});

// API cập nhật category (PUT)
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
});

// THÊM MỚI: API xóa category (DELETE)
router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});

// product
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  // get data
  var products = await ProductDAO.selectAll();
  // pagination
  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page); // /products?page=xxx
  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);
  // return
  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const quantity = req.body.quantity;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = { name: name, price: price, image: image, cdate: now, category: category, quantity: quantity };
  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put('/products', JwtUtil.checkToken, async function (req, res) {
  const _id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const quantity = req.body.quantity;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = { _id: _id, name: name, price: price, image: image, cdate: now, category: category, quantity: quantity };
  const result = await ProductDAO.update(product);
  res.json(result);
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// customer
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const token = req.body.token;

    // Gọi hàm active từ CustomerDAO với tham số active = 0 (deactive)
    const result = await CustomerDAO.active(_id, token, 0);

    res.json(result);
  } catch (error) {
    console.error('Deactive customer error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});
router.put('/customers/active/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const token = req.body.token;

    // Gọi hàm active từ CustomerDAO với tham số active = 1 (activate)
    const result = await CustomerDAO.active(_id, token, 1);

    res.json(result);
  } catch (error) {
    console.error('Activate customer error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);
  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});

// order
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

router.put('/orders/:id/status', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const status = req.body.status;
  const result = await OrderDAO.updateStatus(_id, status);
  if (result) {
    res.json({ success: true, message: 'Order status updated', order: result });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

function getRevenuePeriod(order, period) {
  const d = new Date(order.cdate);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const quarter = Math.floor((month - 1) / 3) + 1;
  if (period === 'month') return `${year}-${String(month).padStart(2, '0')}`;
  if (period === 'quarter') return `${year}-Q${quarter}`;
  return `${year}`;
}

function aggregateRevenue(orders, period) {
  const accumulator = {};
  orders.forEach((order) => {
    const key = getRevenuePeriod(order, period);
    const total = Number(order.total || 0);
    accumulator[key] = (accumulator[key] || 0) + total;
  });
  return Object.entries(accumulator)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([periodKey, total]) => ({ period: periodKey, total }));
}

router.get('/dashboard/revenue', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectCompleted();
  const revenue = {
    month: aggregateRevenue(orders, 'month'),
    quarter: aggregateRevenue(orders, 'quarter'),
    year: aggregateRevenue(orders, 'year')
  };
  res.json(revenue);
});

router.get('/dashboard/products/newest', JwtUtil.checkToken, async function (req, res) {
  const limit = parseInt(req.query.limit) || 5;
  const products = await ProductDAO.selectTopNew(limit);
  res.json(products);
});

router.get('/dashboard/products/top', JwtUtil.checkToken, async function (req, res) {
  const limit = parseInt(req.query.limit) || 5;
  const products = await ProductDAO.selectTopHot(limit);
  res.json(products);
});

// test endpoint - get all admins
router.get('/all', async function (req, res) {
  try {
    const admins = await AdminDAO.selectAll();
    res.json({ success: true, data: admins });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// test endpoint - create admin
router.post('/create', async function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      const admin = await AdminDAO.insert(username, password);
      res.json({ success: true, message: 'Admin created', data: admin });
    } else {
      res.json({ success: false, message: 'Please provide username and password' });
    }
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// promotions
router.get('/promotions', JwtUtil.checkToken, async function (req, res) {
  const promotions = await PromotionDAO.selectAll();
  res.json(promotions);
});

router.post('/promotions', JwtUtil.checkToken, async function (req, res) {
  try {
    const code = req.body.code;
    const name = req.body.name;
    const discountPercentage = req.body.discountPercentage;
    const isActive = req.body.isActive !== undefined ? req.body.isActive : true;
    const quantity = req.body.quantity !== undefined ? req.body.quantity : 0;

    // Check if code already exists
    const existing = await PromotionDAO.selectByCode(code);
    if (existing) {
      return res.json({ success: false, message: 'Promotion code already exists' });
    }

    const promotion = { code, name, discountPercentage, isActive, quantity };
    const result = await PromotionDAO.insert(promotion);
    res.json({ success: true, message: 'Promotion created successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.put('/promotions/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const code = req.body.code;
    const name = req.body.name;
    const discountPercentage = req.body.discountPercentage;
    const isActive = req.body.isActive;
    const quantity = req.body.quantity;

    const promotion = { _id, code, name, discountPercentage, isActive, quantity };
    const result = await PromotionDAO.update(promotion);
    res.json({ success: true, message: 'Promotion updated successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.delete('/promotions/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const result = await PromotionDAO.delete(_id);
    res.json({ success: true, message: 'Promotion deleted successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;