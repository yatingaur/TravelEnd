// ===== Hotel Search =====
document.getElementById('hotelSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('hotelCity').value;
  const hotelResults = document.getElementById('hotelResults');
  hotelResults.innerHTML = "<p>Loading hotels...</p>";

  try {
    const response = await fetch(`/api/hotels?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (!data || data.length === 0) {
      hotelResults.innerHTML = "<p>No hotels found.</p>";
      return;
    }

    // Render hotel results
    hotelResults.innerHTML = data
      .map(hotel => `
        <div class="result-card">
          <h3>${hotel.label || hotel.name}</h3>
          <p>City: ${hotel.city_name || city}</p>
        </div>
      `)
      .join('');
  } catch (error) {
    console.error("Hotel Fetch Error:", error);
    hotelResults.innerHTML = "<p>Error fetching hotels.</p>";
  }
});

// ===== Flight Search =====
document.getElementById('flightSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const origin = document.getElementById('flightOrigin').value;
  const destination = document.getElementById('flightDestination').value;
  const flightResults = document.getElementById('flightResults');
  flightResults.innerHTML = "<p>Loading flights...</p>";

  try {
    const response = await fetch(`/api/flights?departId=${encodeURIComponent(origin)}&arrivalId=${encodeURIComponent(destination)}`);
    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      flightResults.innerHTML = "<p>No flights found.</p>";
      return;
    }

    // Render flight results
    flightResults.innerHTML = data.data
      .map(flight => `
        <div class="result-card">
          <h3>${flight.price?.amount || 'Price not available'} ${flight.price?.currency || ''}</h3>
          <p>From: ${origin} → To: ${destination}</p>
        </div>
      `)
      .join('');
  } catch (error) {
    console.error("Flight Fetch Error:", error);
    flightResults.innerHTML = "<p>Error fetching flights.</p>";
  }
});

// ===== Holiday Packages (Dummy Data) =====
document.getElementById('holidaySearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const holidayResults = document.getElementById('holidayResults');
  holidayResults.innerHTML = "<p>Loading holiday packages...</p>";

  try {
    const response = await fetch(`/api/holidays`);
    const data = await response.json();

    holidayResults.innerHTML = data
      .map(pkg => `
        <div class="result-card">
          <h3>${pkg.package}</h3>
          <p>Price: ₹${pkg.price}</p>
        </div>
      `)
      .join('');
  } catch (error) {
    console.error("Holiday Fetch Error:", error);
    holidayResults.innerHTML = "<p>Error fetching holiday packages.</p>";
  }
});

// ===== Train Search (Dummy Data) =====
document.getElementById('trainSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const trainResults = document.getElementById('trainResults');
  trainResults.innerHTML = "<p>Loading trains...</p>";

  try {
    const response = await fetch(`/api/trains`);
    const data = await response.json();

    trainResults.innerHTML = data
      .map(train => `
        <div class="result-card">
          <h3>${train.train}</h3>
          <p>${train.from} → ${train.to}</p>
          <p>Price: ₹${train.price}</p>
        </div>
      `)
      .join('');
  } catch (error) {
    console.error("Train Fetch Error:", error);
    trainResults.innerHTML = "<p>Error fetching trains.</p>";
  }
});

// ===== Cab Search (Dummy Data) =====
document.getElementById('cabSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const cabResults = document.getElementById('cabResults');
  cabResults.innerHTML = "<p>Loading cabs...</p>";

  try {
    const response = await fetch(`/api/cabs`);
    const data = await response.json();

    cabResults.innerHTML = data
      .map(cab => `
        <div class="result-card">
          <h3>${cab.cab}</h3>
          <p>Price: ₹${cab.price}</p>
        </div>
      `)
      .join('');
  } catch (error) {
    console.error("Cab Fetch Error:", error);
    cabResults.innerHTML = "<p>Error fetching cabs.</p>";
  }
});
