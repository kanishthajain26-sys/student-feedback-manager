const express = require("express");
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");

const router = express.Router();

router.post("/feedback", async (req, res) => {
  try {
    const { name, course, rating, comment } = req.body;

    if (!name || !course || !rating || !comment) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const feedback = await Feedback.create({
      name,
      course,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
});

router.get("/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({
      createdAt: -1,
    });

    res.status(200).json(feedbacks);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch feedbacks",
      error: error.message,
    });
  }
});


router.get("/feedback/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid feedback ID",
      });
    }

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    res.status(200).json(feedback);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
});

router.put("/feedback/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, course, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid feedback ID",
      });
    }

    if (!name || !course || !rating || !comment) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      {
        name,
        course,
        rating,
        comment,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      message: "Feedback updated successfully",
      feedback,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update feedback",
      error: error.message,
    });
  }
});


router.delete("/feedback/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid feedback ID",
      });
    }

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      message: "Feedback deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete feedback",
      error: error.message,
    });
  }
});


module.exports = router;