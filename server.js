const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(express.static(__dirname)); // Serve static files like index.html, styles.css, script.js

let amadeusToken = "";
let tokenExpiry = 0; // Track token expiry time

// ===== Function to Fetch Amadeus Token =====
async function getAmadeusToken() {
  try {
    console.log("Fetching Amadeus token...");
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      })
    );
    amadeusToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000; // Set expiry
    console.log("Amadeus token fetched successfully!");
  } catch (error) {
    console.error("Error fetching Amadeus token:", error.response?.data || error.message);
  }
}

// ===== Middleware to Refresh Token if Expired =====
app.use(async (req, res, next) => {
  if (!amadeusToken || Date.now() > tokenExpiry) {
    await getAmadeusToken();
  }
  next();
});

// ===== Hotel Search API =====
app.get("/api/hotels", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City is required" });

    console.log("Hotel search for city:", city);
    const response = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${city}`,
      { headers: { Authorization: `Bearer ${amadeusToken}` } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Hotel API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch hotel data", details: error.response?.data });
  }
});

// ===== Flight Search API =====
app.get("/api/flights", async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    if (!origin || !destination || !date) {
      return res.status(400).json({ error: "Origin, destination, and date are required" });
    }

    console.log(`Flight search: ${origin} -> ${destination} on ${date}`);
    const response = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=1&max=5`,
      { headers: { Authorization: `Bearer ${amadeusToken}` } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Flight API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch flight data", details: error.response?.data });
  }
});

// ===== Holiday Packages (Dummy Data) =====
app.get("/api/holidays", (req, res) => {
  res.json([
    { id: 1, package: "Goa 3N/4D Beach Package", price: 12000 },
    { id: 2, package: "Kerala Backwaters Tour", price: 18000 },
  ]);
});

// ===== Trains (Dummy Data) =====
app.get("/api/trains", (req, res) => {
  res.json([
    { train: "Rajdhani Express", from: "Delhi", to: "Mumbai", price: 2200 },
    { train: "Shatabdi Express", from: "Delhi", to: "Chandigarh", price: 800 },
  ]);
});

// ===== Cabs (Dummy Data) =====
app.get("/api/cabs", (req, res) => {
  res.json([
    { cab: "Sedan - Ola", price: 500 },
    { cab: "SUV - Uber", price: 900 },
  ]);
});

// ===== Suggestions API =====
app.get("/api/suggestions", async (req, res) => {
  try {
    const { keyword, type } = req.query;
    if (!keyword || !type) return res.json([]);

    console.log(`Fetching suggestions for ${keyword} [${type}]`);
    const response = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=${type}&keyword=${keyword}&page%5Blimit%5D=5`,
      { headers: { Authorization: `Bearer ${amadeusToken}` } }
    );

    const suggestions = response.data.data.map(item => ({
      code: item.iataCode,
      name: item.name || item.detailedName,
    }));

    res.json(suggestions);
  } catch (error) {
    console.error("Suggestions API Error:", error.response?.data || error.message);
    res.status(500).json([]);
  }
});

// ===== Debug Route =====
app.get("/api/check", (req, res) => {
  res.json({
    tokenStatus: amadeusToken ? "Token is set" : "Token not set",
    expiry: tokenExpiry ? new Date(tokenExpiry).toISOString() : "Unknown",
  });
});

// ===== Serve Frontend =====
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
