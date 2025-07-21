// ===== Autocomplete Suggestions =====
async function fetchSuggestions(query, type, suggestionsDivId) {
  if (query.length < 2) {
    document.getElementById(suggestionsDivId).innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`/api/suggestions?keyword=${encodeURIComponent(query)}&type=${type}`);
    const data = await response.json();

    const suggestionsDiv = document.getElementById(suggestionsDivId);
    suggestionsDiv.innerHTML = data
      .map(item => `<div class="suggestion-item" onclick="selectSuggestion('${item.name}', '${suggestionsDivId}')">${item.name} (${item.code})</div>`)
      .join('');
  } catch (error) {
    console.error("Suggestion Fetch Error:", error);
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
    const response = await fetch(`/api/hotels?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    hotelResults.innerHTML = data
      .map(hotel => `
        <div class="result-card">
          <h3>${hotel.label || hotel.name}</h3>
          <p>City: ${hotel.city_name || city}</p>
        </div>
      `)
      .join('');
  } catch (error) {
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

    flightResults.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    flightResults.innerHTML = "<p>Error fetching flights.</p>";
  }
});

// ===== Other Searches =====
document.getElementById('holidaySearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('/api/holidays');
  const data = await response.json();
  document.getElementById('holidayResults').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
});

document.getElementById('trainSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('/api/trains');
  const data = await response.json();
  document.getElementById('trainResults').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
});

document.getElementById('cabSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('/api/cabs');
  const data = await response.json();
  document.getElementById('cabResults').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
});

// Autocomplete Event Listeners
document.getElementById('hotelCity').addEventListener('input', (e) => {
  fetchSuggestions(e.target.value, 'HOTEL', 'hotelSuggestions');
});
document.getElementById('flightOrigin').addEventListener('input', (e) => {
  fetchSuggestions(e.target.value, 'AIRPORT', 'originSuggestions');
});
document.getElementById('flightDestination').addEventListener('input', (e) => {
  fetchSuggestions(e.target.value, 'AIRPORT', 'destinationSuggestions');
});
