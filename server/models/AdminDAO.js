require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const AdminDAO = {
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const admin = await Models.Admin.findOne(query);
    return admin;
  },
  async selectAll() {
    const admins = await Models.Admin.find({});
    return admins;
  },
  async insert(username, password) {
    const admin = new Models.Admin({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      password: password
    });
    await admin.save();
    return admin;
  }
};
module.exports = AdminDAO;