const mongoose = require('mongoose');

const logDataSchema = new mongoose.Schema({
  currentUser:  { type: String, required: true },
  tradedWith: { type: String, required: true },
  exchangeType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
    collection: "logdatas" 
  }

);

module.exports = mongoose.model('logdata', logDataSchema);
