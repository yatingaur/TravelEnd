const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(express.static(__dirname));

let amadeusToken = "";

// Function to fetch Amadeus token
async function getAmadeusToken() {
  const response = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "YOUR_CLIENT_ID",
      client_secret: "YOUR_CLIENT_SECRET",
    })
  );
  amadeusToken = response.data.access_token;
}

// Middleware to ensure token is available
app.use(async (req, res, next) => {
  if (!amadeusToken) {
    await getAmadeusToken();
  }
  next();
});

// Hotels Search API
app.get("/api/hotels", async (req, res) => {
  try {
    const { city } = req.query;
    const response = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${city}`,
      { headers: { Authorization: `Bearer ${amadeusToken}` } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel data" });
  }
});

// Flights Search API
app.get("/api/flights", async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    const response = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=1&max=5`,
      { headers: { Authorization: `Bearer ${amadeusToken}` } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
