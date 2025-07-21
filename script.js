// ===== Helper for Fetching Suggestions =====
async function fetchSuggestions(query, type, suggestionsDivId) {
  if (query.length < 2) {
    document.getElementById(suggestionsDivId).innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`/api/suggestions?keyword=${query}&type=${type}`);
    const data = await response.json();

    const suggestionsDiv = document.getElementById(suggestionsDivId);
    if (!data || data.length === 0) {
      suggestionsDiv.innerHTML = '';
      return;
    }

    suggestionsDiv.innerHTML = data
      .map(item => `<div class="suggestion-item" onclick="selectSuggestion('${item.code}', '${suggestionsDivId}')">${item.name} (${item.code})</div>`)
      .join('');
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}

function selectSuggestion(value, suggestionsDivId) {
  const inputId = suggestionsDivId.replace('Suggestions', '');
  document.getElementById(inputId).value = value;
  document.getElementById(suggestionsDivId).innerHTML = '';
}

// ===== Hotel Search =====
document.getElementById('hotelSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('hotelCity').value;
  const hotelResults = document.getElementById('hotelResults');
  hotelResults.innerHTML = "<p>Loading hotels...</p>";

  try {
    const response = await fetch(`/api/hotels?city=${city}`);
    const data = await response.json();
    hotelResults.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    hotelResults.innerHTML = "<p>Error fetching hotels.</p>";
  }
});

// ===== Flight Search =====
document.getElementById('flightSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const origin = document.getElementById('flightOrigin').value;
  const destination = document.getElementById('flightDestination').value;
  const date = document.getElementById('flightDate').value;
  const flightResults = document.getElementById('flightResults');
  flightResults.innerHTML = "<p>Loading flights...</p>";

  try {
    const response = await fetch(`/api/flights?origin=${origin}&destination=${destination}&date=${date}`);
    const data = await response.json();
    flightResults.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    flightResults.innerHTML = "<p>Error fetching flights.</p>";
  }
});

// ===== Holiday Search =====
document.getElementById('holidaySearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const holidayResults = document.getElementById('holidayResults');
  holidayResults.innerHTML = "<p>Loading holiday packages...</p>";

  try {
    const response = await fetch(`/api/holidays`);
    const data = await response.json();
    holidayResults.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    holidayResults.innerHTML = "<p>Error fetching holidays.</p>";
  }
});

// ===== Train Search =====
document.getElementById('trainSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const trainResults = document.getElementById('trainResults');
  trainResults.innerHTML = "<p>Loading trains...</p>";

  try {
    const response = await fetch(`/api/trains`);
    const data = await response.json();
    trainResults.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    trainResults.innerHTML = "<p>Error fetching trains.</p>";
  }
});

// ===== Cab Search =====
document.getElementById('cabSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const cabResults = document.getElementById('cabResults');
  cabResults.innerHTML = "<p>Loading cabs...</p>";

  try {
    const response = await fetch(`/api/cabs`);
    const data = await response.json();
    cabResults.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    cabResults.innerHTML = "<p>Error fetching cabs.</p>";
  }
});

// ===== Autocomplete Events =====
document.getElementById('hotelCity').addEventListener('input', (e) => {
  fetchSuggestions(e.target.value, 'CITY', 'hotelSuggestions');
});
document.getElementById('flightOrigin').addEventListener('input', (e) => {
  fetchSuggestions(e.target.value, 'AIRPORT', 'originSuggestions');
});
document.getElementById('flightDestination').addEventListener('input', (e) => {
  fetchSuggestions(e.target.value, 'AIRPORT', 'destinationSuggestions');
});
