const express = require("express");

const {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();


router.post("/feedback", createFeedback);


router.get("/feedback", getFeedbacks);


router.get("/feedback/:id", getFeedbackById);


router.put("/feedback/:id", updateFeedback);


router.delete("/feedback/:id", deleteFeedback);

module.exports = router;