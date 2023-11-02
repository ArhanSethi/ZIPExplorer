document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('searchButton').addEventListener('click', function() {
    const apiKeyNPS = 'iQCJObhqQagtZMi82XfcPUBqXdpOU28tZunS6U4P';

    let apiUrl;

    if (stateSelect.value) {
      apiUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${stateSelect.value}&api_key=${apiKeyNPS}`;
    } else if (parkName.trim() !== '') {
      apiUrl = `https://developer.nps.gov/api/v1/parks?q=${parkName}&api_key=${apiKeyNPS}`;
    } else if (zipcode.trim() !== '') {
      codeAddress(zipcode);
      return;
    } else {
      alert('Please select a state, enter a park name, or enter a zipcode.');
      return;
    }

    fetch(apiUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        if (data.data && data.data.length > 0) {
          const parks = data.data;
          const parkList = parks.map(park => park.fullName);
          if (parkList.length > 0) {
            const parkListHTML = parkList.map(park => `<li>${park}</li>`).join('');
            document.getElementById('searchResults').innerHTML = `<ul>${parkListHTML}</ul>`;
          } else {
            document.getElementById('searchResults').textContent = 'No parks found for the selected state, park name, or zipcode.';
          }
        } else {
          document.getElementById('searchResults').textContent = 'No parks found for the selected state, park name, or zipcode.';
        }
      })
      .catch(error => {
        document.getElementById('searchResults').textContent = `Error: ${error.message}`;
      });
  });
});


function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
const parkCode = getParameterByName('parkCode');
const parkInfo = document.getElementById('park-info');
const apiUrl = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=iQCJObhqQagtZMi82XfcPUBqXdpOU28tZunS6U4P`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    if (data.data.length > 0) {
      const parkData = data.data[0];
      const activities = parkData.activities;
      const topics = parkData.topics;
      const feesAndPasses = parkData.entranceFees;
      const parkDescription = parkData.description;
      const weatherInfo = parkData.weatherInfo;

      if (parkDescription) {
        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.textContent = `Description: ${parkDescription}`;
        parkInfo.appendChild(descriptionParagraph);
      } else {
        parkInfo.innerHTML += '<p>No description available for this park.</p>';
      }

      if (activities && activities.length > 0) {
        const activitiesParagraph = document.createElement('p');
        activitiesParagraph.textContent = `Activities: ${activities.map((activity) => activity.name).join(', ')}`;
        parkInfo.appendChild(activitiesParagraph);
      } else {
        parkInfo.innerHTML += '<p>No activities information available for this park.</p>';
      }

      if (topics && topics.length > 0) {
        const topicsParagraph = document.createElement('p');
        topicsParagraph.textContent = `Topics: ${topics.map((topic) => topic.name).join(', ')}`;
        parkInfo.appendChild(topicsParagraph);
      } else {
        parkInfo.innerHTML += '<p>No topics information available for this park.</p>';
      }

      if (feesAndPasses && feesAndPasses.length > 0) {
        const feesAndPassesParagraph = document.createElement('p');
        feesAndPassesParagraph.textContent = 'Fees and Passes:';
        feesAndPasses.forEach((fee) => {
          feesAndPassesParagraph.textContent += `\n- ${fee.title}: $${fee.cost}`;
        });
        parkInfo.appendChild(feesAndPassesParagraph);
      } else {
        parkInfo.innerHTML += '<p>No fees and passes information available for this park.</p>';
      }

      if (weatherInfo) {
        const weatherInfoParagraph = document.createElement('p');
        weatherInfoParagraph.textContent = `Weather Info: ${weatherInfo}`;
        parkInfo.appendChild(weatherInfoParagraph);
      } else {
        parkInfo.innerHTML += '<p>No weather information available for this park.</p>';
      }
    } else {
      parkInfo.innerHTML += '<p>Park not found</p>';
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    parkInfo.innerHTML += '<p>An error occurred while fetching park information.</p>';
  });