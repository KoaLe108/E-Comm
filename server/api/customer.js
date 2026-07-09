const express = require('express');
const router = express.Router();
// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');
// daos
const CustomerDAO = require('../models/CustomerDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');

// customer signup
router.post('/signup', async function (req, res) {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const name = req.body.name;
      const phone = req.body.phone;
      const email = req.body.email;
  
      const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email, phone);
  
      if (dbCust) {
        return res.json({ success: false, message: 'Exists username, phone or email' });
      }
  
      const now = new Date().getTime();
      const token = CryptoUtil.md5(now.toString());
      const newCust = { username, password, name, phone, email, active: 0, token };
  
      const result = await CustomerDAO.insert(newCust);
  
      if (result) {
        let send = false;
  
        try {
          send = await EmailUtil.send(email, result._id, token);
        } catch (err) {
          console.error("EMAIL ERROR:", err);
        }
  
        res.json({ success: true, message: send ? 'Please check email' : 'Signup OK (email failed)' });
      } else {
        res.json({ success: false, message: 'Insert failure' });
      }
  
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      res.status(500).send(err.message);
    }
});

// customer active
router.post('/active', async function (req, res) {
    const _id = req.body.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 1);
    res.json(result);
});

// customer login
router.post('/login', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
        if (customer) {
            if (customer.active === 1) {
                const token = JwtUtil.genToken();
                res.json({ success: true, message: 'Authentication successful', token, customer });
            } else {
                res.json({ success: false, message: 'Account is deactive' });
            }
        } else {
            res.json({ success: false, message: 'Incorrect username or password' });
        }
    } else {
        res.json({ success: false, message: 'Please input username and password' });
    }
});

// customer token check
router.get('/token', JwtUtil.checkToken, function (req, res) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    res.json({ success: true, message: 'Token is valid', token });
});

// customer update profile
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const customer = { _id, username, password, name, phone, email };
    const result = await CustomerDAO.update(customer);
    res.json(result);
});

// category
router.get('/categories', async function (req, res) {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
});

// product
router.get('/products/new', async function (req, res) {
    const products = await ProductDAO.selectTopNew(3);
    res.json(products);
});
router.get('/products/hot', async function (req, res) {
    const products = await ProductDAO.selectTopHot(3);
    res.json(products);
});
router.get('/products/category/:cid', async function (req, res) {
    const _cid = req.params.cid;
    const products = await ProductDAO.selectByCatID(_cid);
    res.json(products);
});
router.get('/products/search/:keyword', async function (req, res) {
    const keyword = req.params.keyword;
    const products = await ProductDAO.selectByKeyword(keyword);
    res.json(products);
});
router.get('/products/:id', async function (req, res) {
    const _id = req.params.id;
    const product = await ProductDAO.selectByID(_id);
    res.json(product);
});

//mycart
router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
    try {
        const now = new Date().getTime();
        const total = req.body.total;
        const items = req.body.items;
        const customer = req.body.customer;

        // Verify stock for all items
        for (const item of items) {
            const prod = await ProductDAO.selectByID(item.product._id);
            if (!prod) {
                return res.status(400).json({ success: false, message: `Sản phẩm không tìm thấy: ${item.product.name}` });
            }
            const stock = prod.quantity !== undefined ? prod.quantity : 0;
            if (stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Sản phẩm "${prod.name}" không đủ số lượng trong kho (Còn lại: ${stock})` });
            }
        }

        // Deduct stock
        for (const item of items) {
            const prod = await ProductDAO.selectByID(item.product._id);
            const currentQty = prod.quantity !== undefined ? prod.quantity : 0;
            prod.quantity = currentQty - item.quantity;
            await ProductDAO.update(prod);
        }

        const order = { cdate: now, total: total, status: 'pending', customer: customer, items: items };
        const result = await OrderDAO.insert(order);
        res.json(result);
    } catch (err) {
        console.error("Checkout error:", err);
        res.status(500).json({ success: false, message: "Internal server error during checkout", error: err.message });
    }
});

// myorders
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
});

module.exports = router;