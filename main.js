
const $form = document.querySelector(".js-city-form");
const $container = document.querySelector(".js-city-weather");
const $searchInput = document.querySelector("[name=city]");
const $errorSection = document.querySelector(".error");
const $saveButton = document.querySelector(".js-save-city-b");
const savedCities = [];
const $savedCitiesContainer = document.querySelector(".js-saved-cities");
const $locationName = document.querySelector(".js-location-name");
const $SaveButtonContainer = document.querySelector(".js-save-button-div");

function getLocation(location) {
    return `https://api.weatherapi.com/v1/forecast.json?key=14be385073aa4d85a9773012232610&q=${location}&aqi=no&lang=hu&days=5`;
}

function fetchPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let location = `${latitude},${longitude}`;
    fetch(getLocation(location))
        .then(response => response.json())
        .then(renderResponse);
}

const position = navigator.geolocation.getCurrentPosition(fetchPosition);

function makeSavedCityButtons(savedCities) {
    let html = '';
    if (savedCities.length > 0) {
        for (let city of savedCities) {
            html += `<button class="js-saved-city-button saved-city-button btn btn-primary">${city}</button>`;
        }
    }
    return html;
}

function renderDecideOverwrite() {
    let html = `
    <div class="js-decide-overwrite decide-overwrite">
        <p>Már elmentettél három várost, klikkelj arra, amelyiket felül szeretnéd írni az újjal!</p>          
    </div>
    `;
    return html;
}

function renderCityAlreadySaved() {
    let html = `
    <div class="js-decide-overwrite decide-overwrite">
        <p>Ezt a várost már elmentetted! <span>X</span></p>         
    </div>
    `;
    return html;
}

function saveCity(event) {
    // Ellenőrizd, hogy van-e érvényes időjárásadat az oldalon
    const weatherElement = document.querySelector('.weather-div');
    if (weatherElement) {
        const cityName = $locationName.innerText;
        if (!savedCities.includes(cityName) && savedCities.length < 3) {
            savedCities.push(cityName);
        }
        else if (!savedCities.includes(cityName) && savedCities.length === 3) {
            $errorSection.innerHTML = renderDecideOverwrite();
        } else {
            $errorSection.innerHTML = renderCityAlreadySaved();
        }
    }
    $savedCitiesContainer.innerHTML = makeSavedCityButtons(savedCities);
}


function renderWeather(weather) {
    let html = `        
        <div>
            <h1>${weather.current.temp_c}°C</h1>
            <img src="https:${weather.current.condition.icon}" alt="${weather.current.condition.text}"/>
        </div>
        <p>${weather.forecast.forecastday[0].day.mintemp_c}°C - ${weather.forecast.forecastday[0].day.maxtemp_c}°C</p>
        <p>${weather.current.condition.text}</p>
        <p>Hőérzet: ${weather.current.feelslike_c}°C</p>
        <p>Szélsebesség: ${weather.current.wind_kph}km/h</p>
    `;
    return html;
}

function renderResponse(weather) {
    let html = ``;
    // validálás, sikertelen keresésnél "error" az objektum egyetlen kulcsa
    if (!weather.error) {
        html += `<div class="weather-div">${renderWeather(weather)}</div>`;
        $locationName.innerText = weather.location.name;
    } else {
        $errorSection.innerHTML = `<p>Sajnálom, nem találok ilyen nevű települést!</p>`;
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
}

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
        clearErrorSection()
        fetchCity(city)
    } else {
        $errorSection.innerHTML = 'Sikertelen keresés!';
    }
}

function loadCity(event) {
    if (document.querySelector(".js-decide-overwrite") !== null) {
        overwriteSavedCity(event)
    }
    else if (event.target.classList.contains('saved-city-button')) {
        fetchCity(event.target.innerText);
    }
}

function overwriteSavedCity(event) {
    savedCities.splice(savedCities.indexOf(event.target.innerText), 1, $locationName.innerHTML)
    $savedCitiesContainer.innerHTML = makeSavedCityButtons(savedCities);
    clearErrorSection()
}

function clearErrorSection() {
    $errorSection.innerHTML = '';
}

$form.addEventListener("submit", formSubmitted);
$saveButton.addEventListener("click", saveCity);
$savedCitiesContainer.addEventListener("click", loadCity);
$errorSection.addEventListener("click", clearErrorSection);
