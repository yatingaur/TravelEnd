require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Amadeus = require('amadeus');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

// Flight search
app.get('/api/flights', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: date,
      adults: '1'
    });
    res.json(response.data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Flight API error' });
  }
});

// Hotel search
app.get('/api/hotels', async (req, res) => {
  try {
    const { city, checkIn, checkOut } = req.query;
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode: city,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      roomQuantity: '1'
    });
    res.json(response.data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Hotel API error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
