const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(express.static(__dirname));

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// ===== Hotels API =====
app.get("/api/hotels", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City is required" });

    const response = await axios.get("https://booking-com.p.rapidapi.com/v1/hotels/locations", {
      params: { name: city, locale: "en-us" },
      headers: {
        "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
      },
    });

    if (!response.data || response.data.length === 0) {
      return res.json([]);
    }

    res.json(response.data);
  } catch (error) {
    console.error("Hotels API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

// ===== Flights API =====
app.get("/api/flights", async (req, res) => {
  try {
    const { departId = "JFK", arrivalId = "LAX" } = req.query;

    const response = await axios.get("https://booking-com18.p.rapidapi.com/flights/v2/min-price-oneway", {
      params: { departId, arrivalId },
      headers: {
        "X-RapidAPI-Host": "booking-com18.p.rapidapi.com",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Flights API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

// Suggestions API
app.get("/api/suggestions", async (req, res) => {
  try {
    const { keyword, type } = req.query;
    if (!keyword) return res.json([]);

    if (type === "HOTEL") {
      const response = await axios.get("https://booking-com.p.rapidapi.com/v1/hotels/locations", {
        params: { name: keyword, locale: "en-us" },
        headers: {
          "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
        },
      });
      return res.json(response.data.map(item => ({
        code: item.dest_id || item.label,
        name: item.label || item.name,
      })));
    }

    if (type === "AIRPORT") {
      const response = await axios.get("https://booking-com18.p.rapidapi.com/flights/auto-complete", {
        params: { text: keyword },
        headers: {
          "X-RapidAPI-Host": "booking-com18.p.rapidapi.com",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
        },
      });
      return res.json(response.data?.map(item => ({
        code: item.iata_code || item.label,
        name: item.label || item.name,
      })) || []);
    }

    res.json([]);
  } catch (error) {
    console.error("Suggestions API Error:", error.response?.data || error.message);
    res.status(500).json([]);
  }
});

// ===== Serve Frontend =====
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
