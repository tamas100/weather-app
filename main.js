
const $form = document.querySelector(".js-city-form");
const $container = document.querySelector(".js-city-weather");
const $searchInput = document.querySelector("[name=city]");
const $errorSection = document.querySelector(".error");
const $saveButton = document.querySelector(".js-save-city-b");
const savedCities = [];
const $savedCitiesContainer = document.querySelector(".js-saved-cities-div");
const $locationName = document.querySelector(".js-location-name");
const $warningSection = document.querySelector(".js-warning");
const $forecastContainer = document.querySelector(".js-forecast-div");
const $forecastTodayContainer = document.querySelector(".js-today-div");
const $forecastTomorrowContainer = document.querySelector(".js-tomorrow-div");
const $forecastDayAfterTomorrowContainer = document.querySelector(".js-day-after-tomorrow-div");
const $threedaysForecastButton = document.querySelector(".js-three-days-forecast-button");

function getLocation(location) {
    return `https://api.weatherapi.com/v1/forecast.json?key=14be385073aa4d85a9773012232610&q=${location}&aqi=no&lang=hu&days=5&alert=yes`;
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
    <div class="js-city-already-saved city-already-saved">
        <p>Már elmentettél három várost, klikkelj arra, amelyiket felül szeretnéd írni az újjal!</p>          
    </div>
    `;
    return html;
}

function renderCityAlreadySaved() {
    let html = `
    <div class="js-decide-overwrite decide-overwrite">
        <p>Ezt a várost már elmentetted!<i id="button-icon" class="bi bi-x"></i></p>                 
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
            $warningSection.innerHTML = renderDecideOverwrite();
        } else {
            $warningSection.innerHTML = renderCityAlreadySaved();
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
        <p>${weather.current.condition.text}</p>
        <p>Hőérzet: ${weather.current.feelslike_c}°C</p>
        <p>Szélsebesség: ${weather.current.wind_kph}km/h</p>        
    `;
    return html;
}

function changeButtonName() {
    if ($forecastContainer.classList.contains("space-around")) {
        $threedaysForecastButton.innerText = '1 napos előrejelzés';
    } else {
        $threedaysForecastButton.innerText = '3 napos előrejelzés';
    }
}

function renderPlusTwoDaysForecast() {
    $forecastTomorrowContainer.classList.toggle("invisible");
    $forecastDayAfterTomorrowContainer.classList.toggle("invisible");
    $forecastContainer.classList.toggle("space-around");
    changeButtonName();
}

function renderForecastDayAfterTomorrow(weather) {
    let html = `
        <p>Holnapután</p>
        <h3 class="max-temp">${weather.forecast.forecastday[2].day.maxtemp_c}°C</h3>
        <h3 class="min-temp">${weather.forecast.forecastday[2].day.mintemp_c}°C</h3>
        <p><i class="bi bi-sunrise"></i> ${weather.forecast.forecastday[2].astro.sunrise}</p>
        <p><i class="bi bi-sunset"></i> ${weather.forecast.forecastday[2].astro.sunset}</p>
    `;
    return html;
}
function renderForecastTomorrow(weather) {
    let html = `
        <p>Holnap</p>
        <h3 class="max-temp">${weather.forecast.forecastday[1].day.maxtemp_c}°C</h3>
        <h3 class="min-temp">${weather.forecast.forecastday[1].day.mintemp_c}°C</h3>
        <p><i class="bi bi-sunrise"></i> ${weather.forecast.forecastday[1].astro.sunrise}</p>
        <p><i class="bi bi-sunset"></i> ${weather.forecast.forecastday[1].astro.sunset}</p>
    `;
    return html;
}

function renderForecastToday(weather) {
    let html = `
        <p>Ma</p>
        <h3 class="max-temp">${weather.forecast.forecastday[0].day.maxtemp_c}°C</h3>
        <h3 class="min-temp">${weather.forecast.forecastday[0].day.mintemp_c}°C</h3>
        <p><i class="bi bi-sunrise"></i> ${weather.forecast.forecastday[0].astro.sunrise}</p>
        <p><i class="bi bi-sunset"></i> ${weather.forecast.forecastday[0].astro.sunset}</p>
    `;
    return html;
}

function renderResponse(weather) {
    let html = ``;
    // validálás, sikertelen keresésnél "error" az objektum egyetlen kulcsa
    if (!weather.error) {
        $locationName.innerText = weather.location.name;
        html += `<div class="weather-div">${renderWeather(weather)}</div>`;
        $forecastTodayContainer.innerHTML = `${renderForecastToday(weather)}`;
        $forecastTomorrowContainer.innerHTML = renderForecastTomorrow(weather);
        $forecastDayAfterTomorrowContainer.innerHTML = renderForecastDayAfterTomorrow(weather);
    } else {
        $errorSection.innerHTML = `<p>Sajnálom, nem találtam ilyen nevű települést!<i id="button-icon" class="bi bi-x"></i></p>`;
    }
    $container.innerHTML = html;
}

function getApiUrl(city) {
    return `https://api.weatherapi.com/v1/forecast.json?key=14be385073aa4d85a9773012232610&q=${city}&aqi=no&lang=hu&days=5&alert=yes`;
}

function fetchCity(city) {
    fetch(getApiUrl(city))
        .then(response => response.json())
        .then(renderResponse);
    clearErrorSection()
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
        clearErrorSection();
        fetchCity(city)
    } else {
        $errorSection.innerHTML = `<p>Sikertelen keresés!<i id="button-icon" class="bi bi-x"></i></p>`;
    }
}

function loadCity(event) {
    if (event.target.classList.contains('saved-city-button') && document.querySelector(".js-city-already-saved") === null) {
        fetchCity(event.target.innerText);
    } else {
        overwriteSavedCity(event);
    }
}

function overwriteSavedCity(event) {
    savedCities.splice(savedCities.indexOf(event.target.innerText), 1, $locationName.innerHTML)
    $savedCitiesContainer.innerHTML = makeSavedCityButtons(savedCities);
    clearWarningSection()
}

function clearWarningSection() {
    $warningSection.innerHTML = '';
}

function clearErrorSection() {
    $errorSection.innerHTML = '';
}

$form.addEventListener("submit", formSubmitted);
$saveButton.addEventListener("click", saveCity);
$savedCitiesContainer.addEventListener("click", loadCity);
$warningSection.addEventListener("click", clearWarningSection);
$errorSection.addEventListener("click", clearErrorSection);
$threedaysForecastButton.addEventListener("click", renderPlusTwoDaysForecast);