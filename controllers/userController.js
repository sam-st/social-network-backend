const User = require("../models/User");

const userController = {
  // GET all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find().populate("thoughts").populate("friends");
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  // GET a single user by its _id
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.userId)
        .populate("thoughts")
        .populate("friends");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  // POST a new user
  async createUser(req, res) {
    try {
      console.log(req.body);
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Invalid user data" });
    }
  },

  // PUT to update a user by its _id
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
        runValidators: true,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Invalid user data" });
    }
  },

  // DELETE to remove user by its _id
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndRemove(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Remove user from friends' friend lists
      await User.updateMany(
        { _id: { $in: user.friends } },
        { $pull: { friends: req.params.userId } }
      );
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  // POST to add a new friend to a user's friend list
  async addFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;
  
      // Fetch the user by their ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add the friend to the user's friends array
      user.friends.push(friendId);
  
      // Save the updated user
      await user.save();
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // DELETE to remove a friend from a user's friend list
  async removeFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;
  
      // Fetch the user by their ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove the friend from the user's friends array
      user.friends = user.friends.filter((friend) => friend.toString() !== friendId);
  
      // Save the updated user
      await user.save();
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },
};

module.exports = userController;
