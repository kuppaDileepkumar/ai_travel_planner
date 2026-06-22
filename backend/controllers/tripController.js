const Trip = require("../models/Trip");

// Retry helper
async function fetchWithRetry(url, options, retries = 5) {
  let delay = 1000;

  for (let i = 0; i <= retries; i++) {
    const response = await fetch(url, options);

    if (response.ok) {
      return response.json();
    }

    if (
      (response.status === 429 || response.status === 503) &&
      i < retries
    ) {
      console.log(`Retry ${i + 1} after ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
      continue;
    }

    const error = await response.text();
    throw new Error(`Gemini API Error ${response.status}: ${error}`);
  }
}

exports.getUserTrips = async (req, res) => {
  try {
    console.log("===== GET TRIPS =====");
    console.log(req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const trips = await Trip.find({
      userId: req.user.id,
    });

    console.log("Trips found:", trips.length);

    res.json(trips);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};
exports.generateNewTrip = async (req, res) => {
  try {
    const { destination, durationDays, budgetTier, interests } = req.body;

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;

    const prompt = `
Generate a ${durationDays}-day travel itinerary for ${destination}.

Budget: ${budgetTier}

Interests:
${interests.join(", ")}

Return ONLY valid JSON.

{
  "itinerary":[
    {
      "dayNumber":1,
      "activities":[
        {
          "title":"Activity",
          "description":"Description",
          "estimatedCostUSD":20,
          "timeOfDay":"Morning"
        }
      ]
    }
  ],
  "hotels":[
    {
      "name":"Hotel",
      "tier":"Budget",
      "estimatedCostNightUSD":100,
      "rating":"4.5/5"
    }
  ],
  "estimatedBudget":{
    "transport":100,
    "accommodation":400,
    "food":200,
    "activities":150,
    "total":850
  },
  "packingList":[
    {
      "item":"Passport",
      "category":"Documents",
      "isPacked":false
    }
  ]
}
`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message: "Missing GEMINI_API_KEY",
      });
    }

    // Current Gemini endpoint
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    };

    const data = await fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Gemini Response:");
    console.log(JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({
        message: "Gemini returned an empty response.",
        response: data,
      });
    }

    // Remove markdown if Gemini returns it
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let result;

    try {
      result = JSON.parse(cleanedText);
    } catch (err) {
      console.error("Invalid JSON from Gemini:");
      console.log(cleanedText);

      return res.status(500).json({
        message: "Gemini returned invalid JSON.",
      });
    }

    const trip = await Trip.create({
      userId,
      destination,
      durationDays,
      budgetTier,
      interests,
      itinerary: result.itinerary || [],
      hotels: result.hotels || [],
      estimatedBudget: result.estimatedBudget || {},
      packingList: result.packingList || [],
    });

    return res.status(201).json({
      success: true,
      trip,
    });
  } catch (err) {
    console.error("Trip Generation Error");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
      stack:
        process.env.NODE_ENV === "development"
          ? err.stack
          : undefined,
    });
  }
};

