// Helper for Autocomplete
async function fetchSuggestions(query, type, suggestionsDivId) {
  if (query.length < 2) {
    document.getElementById(suggestionsDivId).innerHTML = '';
    return;
  }

  try {
    console.log(`Fetching suggestions for ${query} (${type})`);
    const response = await fetch(`/api/suggestions?keyword=${encodeURIComponent(query)}&type=${type}`);
    const data = await response.json();
    console.log("Suggestions:", data);

    document.getElementById(suggestionsDivId).innerHTML = data.length
      ? data.map(item => `<div class="suggestion-item" onclick="selectSuggestion('${item.name}', '${suggestionsDivId}')">${item.name} (${item.code})</div>`).join('')
      : "<div class='suggestion-item'>No suggestions</div>";
  } catch (error) {
    console.error("Suggestion Fetch Error:", error);
  }
}

function selectSuggestion(value, suggestionsDivId) {
  const inputId = suggestionsDivId.replace('Suggestions', '');
  document.getElementById(inputId).value = value;
  document.getElementById(suggestionsDivId).innerHTML = '';
}

// Hotel Search
document.getElementById('hotelSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('hotelCity').value;
  const hotelResults = document.getElementById('hotelResults');
  hotelResults.innerHTML = "<p>Loading hotels...</p>";

  try {
    const response = await fetch(`/api/hotels?city=${encodeURIComponent(city)}`);
    const data = await response.json();
    console.log("Hotel Data:", data);

    hotelResults.innerHTML = data.length
      ? data.map(hotel => `<div class="result-card"><h3>${hotel.label || hotel.name}</h3><p>${hotel.city_name || city}</p></div>`).join('')
      : "<p>No hotels found.</p>";
  } catch (error) {
    console.error("Hotel Fetch Error:", error);
    hotelResults.innerHTML = "<p>Error fetching hotels.</p>";
  }
});

// Flight Search
document.getElementById('flightSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const origin = document.getElementById('flightOrigin').value;
  const destination = document.getElementById('flightDestination').value;
  const flightResults = document.getElementById('flightResults');
  flightResults.innerHTML = "<p>Loading flights...</p>";

  try {
    const response = await fetch(`/api/flights?departId=${encodeURIComponent(origin)}&arrivalId=${encodeURIComponent(destination)}`);
    const data = await response.json();
    console.log("Flight Data:", data);

    flightResults.innerHTML = data?.data
      ? `<pre>${JSON.stringify(data.data, null, 2)}</pre>`
      : "<p>No flights found.</p>";
  } catch (error) {
    console.error("Flight Fetch Error:", error);
    flightResults.innerHTML = "<p>Error fetching flights.</p>";
  }
});

// Attach Event Listeners
document.getElementById('hotelCity').addEventListener('input', (e) => fetchSuggestions(e.target.value, 'HOTEL', 'hotelSuggestions'));
document.getElementById('flightOrigin').addEventListener('input', (e) => fetchSuggestions(e.target.value, 'AIRPORT', 'originSuggestions'));
document.getElementById('flightDestination').addEventListener('input', (e) => fetchSuggestions(e.target.value, 'AIRPORT', 'destinationSuggestions'));
