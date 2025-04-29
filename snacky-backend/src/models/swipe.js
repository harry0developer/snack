const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
  swiper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  swipee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  direction: { type: String, enum: ['left', 'right'], required: true },
}, {
  timestamps: true,
  indexes: [{ unique: true, fields: ['swiper', 'swipee'] }]
});

swipeSchema.index({ swiper: 1, swipee: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);
