
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
const $firstThreeHoursForecastContainer = document.querySelector(".js-first-three-hours-div");
const $restHoursForecastContainer = document.querySelector(".js-rest-hours-div");
const $twentyFourHoursForecastButtons = document.querySelectorAll(".js-twenty-four-hours-forecast-button");
const $nextHoursParagraph = document.querySelector(".js-next-hours-p");

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
    let html =
        `
    <div class="js-city-already-saved city-already-saved">
        <p>Már elmentettél három várost, klikkelj arra, amelyiket felül szeretnéd írni az újjal!</p>          
    </div>
    `;
    return html;
}

function renderCityAlreadySaved() {
    let html =
        `
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
    let html =
        `        
        <div>
            <h1>${weather.current.temp_c}°C</h1>
            <img src="https:${weather.current.condition.icon}" alt="${weather.current.condition.text}"/>
        </div>
        <p>${weather.current.condition.text}</p>
        <p>Hőérzet: ${weather.current.feelslike_c}°C</p>
        <p>Szélsebesség: ${weather.current.wind_kph}km/h</p>        
        <p>Csapadék: ${weather.current.precip_mm}mm</p>
        <div class="js-weather-details-div invisible">
            <p>Széllökés: ${weather.current.gust_kph}km/h</p>        
            <p>Légnyomás: ${weather.current.pressure_mb}hPa</p>        
            <p>Páratartalom: ${weather.current.humidity}%</p>        
            <p>Látótávolság: ${weather.current.vis_km}km</p>  
        </div>
        <button class="js-weather-details-button btn btn-primary">Részletes időjárás</button>      
    `;
    return html;
}

function changeForecastButtonName() {
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
    changeForecastButtonName();
}

function renderForecastDayAfterTomorrow(weather) {
    let html =
        `
        <p>Holnapután</p>
        <div>
            <img src="https:${weather.forecast.forecastday[2].day.condition.icon}" alt="${weather.forecast.forecastday[2].day.condition.text}"/>
        </div>
        <p>${weather.forecast.forecastday[2].day.condition.text}</p>
        <h3 class="max-temp">${weather.forecast.forecastday[2].day.maxtemp_c}°C</h3>
        <h3 class="min-temp">${weather.forecast.forecastday[2].day.mintemp_c}°C</h3>
        <p><i class="bi bi-sunrise"></i> ${weather.forecast.forecastday[2].astro.sunrise}</p>
        <p><i class="bi bi-sunset"></i> ${weather.forecast.forecastday[2].astro.sunset}</p>
    `;
    return html;
}
function renderForecastTomorrow(weather) {
    let html =
        `
        <p>Holnap</p>
        <div>
            <img src="https:${weather.forecast.forecastday[1].day.condition.icon}" alt="${weather.forecast.forecastday[1].day.condition.text}"/>
        </div>
        <p>${weather.forecast.forecastday[1].day.condition.text}</p>
        <h3 class="max-temp">${weather.forecast.forecastday[1].day.maxtemp_c}°C</h3>
        <h3 class="min-temp">${weather.forecast.forecastday[1].day.mintemp_c}°C</h3>
        <p><i class="bi bi-sunrise"></i> ${weather.forecast.forecastday[1].astro.sunrise}</p>
        <p><i class="bi bi-sunset"></i> ${weather.forecast.forecastday[1].astro.sunset}</p>
    `;
    return html;
}

function renderForecastToday(weather) {
    let html =
        `
        <p>Ma</p>
        <div>
            <img src="https:${weather.forecast.forecastday[0].day.condition.icon}" alt="${weather.forecast.forecastday[0].day.condition.text}"/>
        </div>
        <p>${weather.forecast.forecastday[0].day.condition.text}</p>
        <h3 class="max-temp">${weather.forecast.forecastday[0].day.maxtemp_c}°C</h3>
        <h3 class="min-temp">${weather.forecast.forecastday[0].day.mintemp_c}°C</h3>
        <p><i class="bi bi-sunrise"></i> ${weather.forecast.forecastday[0].astro.sunrise}</p>
        <p><i class="bi bi-sunset"></i> ${weather.forecast.forecastday[0].astro.sunset}</p>
    `;
    return html;
}

function getCurrentHour(weather) {
    return parseInt(weather.location.localtime.slice(11, 13));
}

function createHourlyForecastHtml(weather, day, hour) {
    let hourlyData = weather.forecast.forecastday[day].hour[hour];
    let html = `
        <section class="js-section-one-hour-forecast section-one-hour-forecast">
            <p class="time-p">${hourlyData.time.slice(11)}</p>   
            <div>
                <h2>${hourlyData.temp_c}°C</h2>
                <img src="https:${hourlyData.condition.icon}" alt="${hourlyData.condition.text}"/>
            </div>
            <p>${hourlyData.condition.text}</p>
            <p>Hőérzet: ${hourlyData.feelslike_c}°C</p>
            <p>Szélsebesség: ${hourlyData.wind_kph}km/h</p>        
            <p>Csapadék: ${hourlyData.precip_mm}mm</p>
            <div>
                <p>Széllökés: ${hourlyData.gust_kph}km/h</p>        
                <p>Légnyomás: ${hourlyData.pressure_mb}hPa</p>        
                <p>Páratartalom: ${hourlyData.humidity}%</p>        
                <p>Látótávolság: ${hourlyData.vis_km}km</p>  
            </div>
        </section>
    `;
    return html;
}

function renderfirstThreeHoursForecast(weather) {
    let html = '';
    const currentHour = getCurrentHour(weather);
    for (let i = currentHour + 1; i < currentHour + 4; i++) {
        html += createHourlyForecastHtml(weather, 0, i);
    }
    return html;
}

function renderRestHoursForecast(weather) {
    let html = '';
    const currentHour = getCurrentHour(weather);

    for (let i = currentHour + 4; i < 24; i++) {
        html += createHourlyForecastHtml(weather, 0, i);
    }
    for (let i = 0; i < 24 - currentHour - 1; i++) {
        html += createHourlyForecastHtml(weather, 1, i);
    }

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
        $firstThreeHoursForecastContainer.innerHTML = renderfirstThreeHoursForecast(weather);
        $restHoursForecastContainer.innerHTML = renderRestHoursForecast(weather)
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

function changeDetailsButtonName() {
    if (document.querySelector(".js-weather-details-div").classList.contains("invisible")) {
        document.querySelector(".js-weather-details-button").innerText = 'Részletes időjárás';
    } else {
        document.querySelector(".js-weather-details-button").innerText = 'Kevesebb részlet';
    }
}

function renderWeatherDetails(event) {
    if (event.target.classList.contains("js-weather-details-button")) {
        document.querySelector(".js-weather-details-div").classList.toggle("invisible");
        changeDetailsButtonName();
    }
}

function changeTwentyFourHoursForecastButtonName() {
    if ($restHoursForecastContainer.classList.contains("invisible")) {
        [...$twentyFourHoursForecastButtons].forEach(button => button.innerText = '24 órás előrejelzés');
    } else {
        [...$twentyFourHoursForecastButtons].forEach(button => button.innerText = '3 órás előrejelzés');
    }
}

function changeNextHoursParagraphInnerText() {
    if ($restHoursForecastContainer.classList.contains("invisible")) {
        $nextHoursParagraph.innerText = 'Következő 3 óra';
    } else {
        $nextHoursParagraph.innerText = 'Következő 24 óra';
    }
}

function showRestHoursForecast() {
    $restHoursForecastContainer.classList.toggle("invisible");
    changeTwentyFourHoursForecastButtonName();
    changeNextHoursParagraphInnerText();
}

$form.addEventListener("submit", formSubmitted);
$saveButton.addEventListener("click", saveCity);
$savedCitiesContainer.addEventListener("click", loadCity);
$warningSection.addEventListener("click", clearWarningSection);
$errorSection.addEventListener("click", clearErrorSection);
$threedaysForecastButton.addEventListener("click", renderPlusTwoDaysForecast);
$container.addEventListener("click", renderWeatherDetails);
[...$twentyFourHoursForecastButtons].forEach(button => button.addEventListener("click", showRestHoursForecast));