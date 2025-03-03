const express = require('express');
const Chat = require('../models/chat');
const router = express.Router();

// router.post('/chats/:user1/:user2', async (req, res) => {
//   try {
//     const chat = new Chat(req.body);
//     await user.save();
//     res.send(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// })

router.get('/chats/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    // Find messages between the two users and sort by timestamp
    const chats = await Chat.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    })
      .sort({ timestamp: 1 })   
      .populate('sender receiver', 'username');  

    res.json(chats);  
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

module.exports = router;
