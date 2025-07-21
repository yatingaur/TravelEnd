const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(express.static(__dirname)); // Serve frontend files like index.html, script.js, styles.css

// Read RapidAPI Key from environment
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// ===== Hotels API (Booking.com via RapidAPI) =====
app.get("/api/hotels", async (req, res) => {
  try {
    const { city = "New York" } = req.query;

    const response = await axios.get("https://booking-com.p.rapidapi.com/v1/hotels/locations", {
      params: { name: city, locale: "en-us" },
      headers: {
        "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Hotels API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

// ===== Flights API (Booking.com via RapidAPI) =====
app.get("/api/flights", async (req, res) => {
  try {
    const { departId = "JFK", arrivalId = "LOS" } = req.query;

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

// ===== Serve Frontend =====
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
