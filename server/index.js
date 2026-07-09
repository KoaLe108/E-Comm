//CLI: npm install express body-parser--save
const path = require('path');
const fs = require('fs');
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// apis
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// apis
app.use("/api/admin", require("./api/admin.js"));
app.use("/api/customer", require("./api/customer.js"));
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// deployment
// '/admin' serve the files at client-admin/build/* as static files
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));
app.get('/admin/*splat', (req, res) => {
  const filePath = path.resolve(__dirname, '../client-admin/build', 'index.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('client-admin is not built yet (use npm start in development)');
  }
});

// '/' serve the files at client-customer/build/* as static files
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));
app.get('/active', (req, res) => {
  const filePath = path.resolve(__dirname, '../client-customer/build', 'index.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('client-customer is not built yet (use npm start in development)');
  }
});
app.get('*splat', (req, res) => {
  const filePath = path.resolve(__dirname, '../client-customer/build', 'index.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('client-customer is not built yet (use npm start in development)');
  }
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res
    .status(500)
    .json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
