const express = require('express');
const server = express.Router();
const User = require('../models/user');

server.get('/users', async (req, res) => {
    try {
      const users = await User.find({});
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  
  // Create a new user
  server.post('/users', async (req, res) => {    
        try {
          const user = new User(req.body);
          await user.save();
          res.send(user);
        } catch (error) {
          console.error(error);
          res.status(500).send(error);
        }
  });
  
  
  // Get user by id
  server.get('/users/:_id', async (req, res) => {
      try {
        const user = await User.findById(req.params._id).select("-password");
        res.send(user);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    });
  
  // Update a user
  server.put('/users/:_id', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params._id, req.body, { new: true });
      res.send(req.params);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  
  // Delete a user
  server.delete('/users/:_id', async (req, res) => {
      console.log("DELETE ERROR ",req.params);
      
      try {
      const user = await User.findByIdAndDelete(req.params._id);
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });

  
module.exports = server;