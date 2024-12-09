const mongoose = require('mongoose');

const sleepEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  quality: { type: Number, required: true, min: 1, max: 5 },
});

module.exports = mongoose.model('SleepEntry', sleepEntrySchema);

