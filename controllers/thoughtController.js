const User = require("../models/User");
const Thought = require("../models/Thought");
const Reaction = require("../models/Reaction");

const thoughtController = {
  // GET all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate("reactions");
      res.json(thoughts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  // GET a single thought by its _id
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId).populate(
        "reactions"
      );
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  // POST to create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      // Push the created thought's _id to the associated user's thoughts array
      const user = await User.findByIdAndUpdate(
        req.body.userId,
        { $push: { thoughts: thought._id } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(201).json(thought);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Invalid thought data" });
    }
  },

  // PUT to update a thought by its _id
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Invalid thought data" });
    }
  },

  // DELETE to remove a thought by its _id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndRemove(req.params.thoughtId);
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      // Remove thought from user's thoughts array
      await User.findByIdAndUpdate(req.body.userId, {
        $pull: { thoughts: thought._id },
      });
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },

  async createReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const reaction = req.body;

      // Find the thought by its ID and push the new reaction to the reactions array.
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $push: { reactions: reaction } },
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      res.status(201).json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Invalid reaction data' });
    }
  },

  async deleteReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const reactionId = req.params.reactionId;

      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $pull: { reactions: { _id: reactionId } } },
        { new: true }
      );

      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = thoughtController;
