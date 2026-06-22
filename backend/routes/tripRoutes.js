const express = require("express");
const router = express.Router();

const {
  generateNewTrip,
  getUserTrips,
} = require("../controllers/tripController");

const auth = require("../middleware/auth");

router.get("/getUserTrips", auth, getUserTrips);
router.post("/generateNewTrip", auth, generateNewTrip);

module.exports = router;
