const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(express.static(__dirname));

let amadeusToken = "";

// Fetch Amadeus Token using environment variables
async function getAmadeusToken() {
  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,        // From Render environment variables
        client_secret: process.env.CLIENT_SECRET // From Render environment variables
      })
    );
    amadeusToken = response.data.access_token;
    console.log("Amadeus token fetched successfully!");
  } catch (error) {
    console.error("Error fetching Amadeus token:", error.response?.data || error.message);
  }
}

// Ensure token is available before handling requests
app.use(async (req, res, next) => {
  if (!amadeusToken) {
    await getAmadeusToken();
  }
  next();
});

// Hotel Search API (Amadeus Locations Search)
app.get("/api/hotels", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

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

// Flight Search API
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

// Serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
