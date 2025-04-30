// routes/swipe.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Swipe = require('../models/swipe');

// POST /swipe
router.post('/swipe', async (req, res) => {
    const { swiperId, swipeeId, direction } = req.body;

    if (!['left', 'right'].includes(direction)) {
        return res.status(400).json({ error: 'Invalid swipe direction' });
    }

    try {
        // Check if swipe already exists
        const existing = await Swipe.findOne({ swiper: swiperId, swipee: swipeeId });
        if (existing) {
            return res.status(400).json({ error: 'Swipe already exists' });
        }

        // Save the new swipe
        await Swipe.create({ swiper: swiperId, swipee: swipeeId, direction });

        // Check for mutual right swipe
        if (direction === 'right') {
            const reverse = await Swipe.findOne({
                swiper: swipeeId,
                swipee: swiperId,
                direction: 'right'
            });

            if (reverse) {
                // It's a match!
                await User.updateOne({ _id: swiperId }, { $addToSet: { matches: swipeeId } });
                await User.updateOne({ _id: swipeeId }, { $addToSet: { matches: swiperId } });
                const swiper = await User.findById(swiperId).select("-password");
                const swipee = await User.findById(swipeeId).select("-password");

                return res.status(200).json({ message: 'Matched!', match: true, swiper, swipee });
            }
        }

        res.status(200).json({ message: 'Swipe recorded' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/swipe/:_id', async (req, res) => {
    try {
        const swipe = await Swipe.findById(req.params._id);
        console.log("swipe ", swipe);
        
        res.send(swipe);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;
