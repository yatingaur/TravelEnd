const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(express.static(__dirname)); // Serve static files like index.html, styles.css, script.js

let amadeusToken = "";

// ===== FETCH AMADEUS TOKEN =====
async function getAmadeusToken() {
  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,        // Use Render environment variable
        client_secret: process.env.CLIENT_SECRET // Use Render environment variable
      })
    );
    amadeusToken = response.data.access_token;
    console.log("Amadeus token fetched successfully!");
  } catch (error) {
    console.error("Error fetching Amadeus token:", error.response?.data || error.message);
  }
}

// Middleware to ensure token is available
app.use(async (req, res, next) => {
  if (!amadeusToken) {
    await getAmadeusToken();
  }
  next();
});

// ===== HOTEL SEARCH API =====
// Amadeus doesn't directly return hotel names by city in the free version, so we use location search as an example
app.get("/api/hotels", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City is required" });

    const response = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${city}`,
      { headers: { Authorization: `Bearer ${amadeusToken}` } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Hotel API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch hotel data" });
  }
});

// ===== FLIGHT SEARCH API =====
app.get("/api/flights", async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    if (!origin || !destination || !date) {
      return res.status(400).json({ error: "Origin, destination, and date are required" });
    }

    const response = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=1&max=5`,
      { headers: { Authorization: `Bearer ${amadeusToken}` } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Flight API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
});

// ===== SUGGESTIONS API =====
app.get("/api/suggestions", async (req, res) => {
  try {
    const { keyword, type } = req.query;
    if (!keyword) return res.json([]);

    const response = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=${type}&keyword=${keyword}&page%5Blimit%5D=5`,
      { headers: { Authorization: `Bearer ${amadeusToken}` } }
    );

    // Format response
    const suggestions = response.data.data.map(item => ({
      code: item.iataCode,
      name: item.name || item.detailedName
    }));

    res.json(suggestions);
  } catch (error) {
    console.error("Suggestions API Error:", error.response?.data || error.message);
    res.status(500).json([]);
  }
});

// ===== SERVE FRONTEND =====
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
