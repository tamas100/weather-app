const $form = document.querySelector(".js-city-form");
const $container = document.querySelector(".js-city-weather");
const $searchInput = document.querySelector("[name=city]");
const $errorSection = document.querySelector(".error");
// const apiUrl = `https://api.weatherapi.com/v1/current.json?key=14be385073aa4d85a9773012232610&q=${city}&aqi=no`;

function getLocation(location) {
    return `https://api.weatherapi.com/v1/forecast.json?key=14be385073aa4d85a9773012232610&q=${location}&aqi=no&lang=hu&days=5`;

}

// function showPosition(position) {
//     let latitude = position.coords.latitude;
//     let longitude = position.coords.longitude;
//     console.log(`
//     Latitude: ${latitude}
//     Longitude: ${longitude}
//     `);
//     let location = `${latitude},${longitude}`
//     getLocation(location);
//     return location;
// }

function fetchPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let location = `${latitude},${longitude}`;
    fetch(getLocation(location))
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(error => console.log(error.message));
}

const position = navigator.geolocation.getCurrentPosition(fetchPosition);

function renderResponse(weather) {
    console.log(weather);
    let html = ``;
    // validálás, sikertelen keresésnél error az objektum egyetlen kulcsa
    if (!weather.error) {
        // html += `<div class="weather-div">${renderWeather(weather)}</div>`;
        html += `<div class="weather-div">Sikerült!</div>`;
    } else {
        $errorSection.innerHTML = `<p>Sorry, we couldn't find the city!</p>`;
    }

    $container.innerHTML = html;
}

function getApiUrl(city) {
    return `https://api.weatherapi.com/v1/forecast.json?key=14be385073aa4d85a9773012232610&q=${city}&aqi=no&lang=hu&days=5`;
}

function fetchCity(city) {
    fetch(getApiUrl(city))
        .then(response => response.json())
        .then(renderResponse);
    // .then(response => console.log(response))
    // .catch(error => console.log(error.message));
}

// fetchCity("Sopnort");

function formSubmitted(event) {
    // Megakadályozzuk az oldal újratöltődését
    event.preventDefault();
    const city = $searchInput.value.trim();
    // törli a keresőmezőt a keresés után
    $searchInput.value = '';
    // Ennek a tartalmát minden kereséskor törölni kell!
    $container.innerHTML = '';
    // Validáció
    if (city.length > 0) {
        // Ennek a tartalmát minden kereséskor törölni kell!
        $errorSection.innerHTML = '';
        fetchCity(city)
    } else {
        $errorSection.innerHTML = 'Sikertelen keresés!'
    }
    console.log(city)
}



$form.addEventListener("submit", formSubmitted);


