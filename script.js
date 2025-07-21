// ===== HOTEL SEARCH =====
document.getElementById('hotelSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('hotelCity').value;
  document.getElementById('hotelResults').innerHTML = "<p>Loading hotels...</p>";

  try {
    const response = await fetch(`/api/hotels?city=${city}`);
    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      document.getElementById('hotelResults').innerHTML = "<p>No hotels found.</p>";
    } else {
      document.getElementById('hotelResults').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
  } catch (error) {
    document.getElementById('hotelResults').innerHTML = "<p>Error fetching hotels.</p>";
    console.error(error);
  }
});

// ===== FLIGHT SEARCH =====
document.getElementById('flightSearchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const origin = document.getElementById('flightOrigin').value;
  const destination = document.getElementById('flightDestination').value;
  const date = document.getElementById('flightDate').value;

  document.getElementById('flightResults').innerHTML = "<p>Loading flights...</p>";

  try {
    const response = await fetch(`/api/flights?origin=${origin}&destination=${destination}&date=${date}`);
    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      document.getElementById('flightResults').innerHTML = "<p>No flights found.</p>";
    } else {
      document.getElementById('flightResults').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
  } catch (error) {
    document.getElementById('flightResults').innerHTML = "<p>Error fetching flights.</p>";
    console.error(error);
  }
});

// ===== AUTOCOMPLETE SUGGESTIONS =====
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

    suggestionsDiv.innerHTML = data.map(item =>
      `<div class="suggestion-item" onclick="selectSuggestion('${item.code}', '${suggestionsDivId}')">
        ${item.name} (${item.code})
      </div>`
    ).join('');
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}

function selectSuggestion(value, suggestionsDivId) {
  const inputId = suggestionsDivId.replace('Suggestions', '');
  document.getElementById(inputId).value = value;
  document.getElementById(suggestionsDivId).innerHTML = '';
}

// Attach event listeners for hotel city input
document.getElementById('hotelCity').addEventListener('input', (e) => {
  fetchSuggestions(e.target.value, 'CITY', 'hotelSuggestions');
});

// Attach event listeners for flight origin & destination inputs
document.getElementById('flightOrigin').addEventListener('input', (e) => {
  fetchSuggestions(e.target.value, 'AIRPORT', 'originSuggestions');
});

document.getElementById('flightDestination').addEventListener('input', (e) => {
  fetchSuggestions(e.target.value, 'AIRPORT', 'destinationSuggestions');
});
