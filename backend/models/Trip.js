const mongoose = require("mongoose");

// Activity Schema
const ActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    estimatedCostUSD: {
      type: Number,
      default: 0,
      min: 0,
    },

    timeOfDay: {
      type: String,
      default: "Morning",
    },
  },
  { _id: true }
);

// Day Schema
const DaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },

    activities: [ActivitySchema],
  },
  { _id: false }
);

// Hotel Schema
const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    tier: {
      type: String,
      default: "",
    },

    estimatedCostNightUSD: {
      type: Number,
      default: 0,
    },

    rating: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    amenities: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);

// Packing List Schema
const PackingItemSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "Other",
    },

    climate: {
      type: String,
      default: "",
    },

    isPacked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

// Budget Schema
const BudgetSchema = new mongoose.Schema(
  {
    accommodation: {
      type: Number,
      default: 0,
    },

    food: {
      type: Number,
      default: 0,
    },

    activities: {
      type: Number,
      default: 0,
    },

    transport: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

// Main Trip Schema
const TripSchema = new mongoose.Schema(
  {
    // Trip Owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Destination
    destination: {
      type: String,
      required: true,
      trim: true,
    },

    // Number of Days
    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },

    // Budget
    budgetTier: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },

    // User Interests
    interests: [
      {
        type: String,
        trim: true,
      },
    ],

    // Day-by-Day Itinerary
    itinerary: [DaySchema],

    // Estimated Budget
    estimatedBudget: BudgetSchema,

    // Hotel Recommendations
    hotels: [HotelSchema],

    // AI Weather Packing Assistant
    packingList: [PackingItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", TripSchema);

