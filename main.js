//-------------------- Constants -----------------------------------------------------------------
const $form = document.querySelector(".js-city-form");
const $container = document.querySelector(".js-city-weather");
const $searchInput = document.querySelector("[name=city]");
const $errorSection = document.querySelector(".error");
const $saveButton = document.querySelector(".js-save-city-b");
const $savedCitiesContainer = document.querySelector(".js-saved-cities-div");
const $locationName = document.querySelector(".js-location-name");
const $warningSection = document.querySelector(".js-warning");
const $forecastContainer = document.querySelector(".js-forecast-div");
const $forecastTodayContainer = document.querySelector(".js-today-div");
const $forecastTomorrowContainer = document.querySelector(".js-tomorrow-div");
const $forecastDayAfterTomorrowContainer = document.querySelector(".js-day-after-tomorrow-div");
const $threedaysForecastButton = document.querySelector(".js-three-days-forecast-button");
const $hoursForecastContainer = document.querySelector(".js-hourly-today-div");
const $twentyFourHoursForecastButtons = document.querySelectorAll(".js-twenty-four-hours-forecast-button");
const $nextHoursParagraph = document.querySelector(".js-next-hours-p");
const $hamburgerMenuButton = document.querySelector(".js-hamburger-menu-button");
const $navMenuList = document.querySelector(".js-nav-menu-list");
const $hamburgerIcon = document.querySelector(".bi-list");
const $paginationLinks = document.querySelectorAll(".pagination > p");

let savedCities = JSON.parse(localStorage.getItem("savedCities")); // retrieve the array from localStorage

//---------------- Hamburger Menu-----------------------------------------
function toggleHamburgerMenu() {
    // add or remove the class "invisible" to $navMenuList
    $navMenuList.classList.toggle("invisible");
    // if $navMenuList's classlist contains "invisible" toggles "bi-x" to $hamburgerIcon
    $navMenuList.classList.contains("invisible") ?
        $hamburgerIcon.classList.toggle("bi-x") :
        $hamburgerIcon.classList.toggle("bi-x");
}
//----------------------------- Get the current position of the user -----------------------------------
// extrats the coordinates from the geolocation datas and fetches with them
function fetchPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let location = `${latitude},${longitude}`;
    const currentLocation = `https://api.weatherapi.com/v1/forecast.json?key=14be385073aa4d85a9773012232610&q=${location}&aqi=no&lang=hu&days=5&alert=yes`;
    fetch(currentLocation)
        .then(response => response.json())
        .then(renderResponse);
}
// calls fetchPosition() with the datas of the user's position
function getUserPosition() {
    navigator.geolocation.getCurrentPosition(fetchPosition);
}


//-------------------------- Create a button of a saved city ------------------------------------- 
// If savedCities is not empty creates citybuttons
function makeSavedCityButtons(savedCities) {
    let html = '';
    if (savedCities.length > 0) {
        for (let city of savedCities) {
            html += `<button class="js-saved-city-button saved-city-button btn btn-primary">${city}</button>`;
        }
    }
    storeSavedCities(savedCities);
    return html;
}

//------------ Store savedCities in localStorage ---------------------------------
function storeSavedCities(savedCities) {
    const stringedSavedCities = JSON.stringify(savedCities);
    localStorage.setItem("savedCities", stringedSavedCities);
}

function loadLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function loadLocalSavedCities() {
    const isLocalStorageSavedCities = loadLocalStorage("savedCities") !== null;
    if (isLocalStorageSavedCities) { // Checks if localStorage.savedcities exists
        $savedCitiesContainer.innerHTML = makeSavedCityButtons(loadLocalStorage("savedCities"));
    } else {
        savedCities = []; // if localStorage.savedcities doesn't exist, savedCities wil be an empty array
    }
}
//------------------------------- Save the current city ----------------------------------------------------------
function saveCity(event) {
    const weatherElement = document.querySelector('.weather-div');
    // Checks if there is valid weather data
    if (weatherElement) {
        const cityName = $locationName.innerText;
        // check if savedCities doesn't contain the current city and check its length as well...
        if (!savedCities.includes(cityName) && savedCities.length < 3) { // if true then add the city to savedCities
            savedCities.push(cityName);
        } // if 
        else if (!savedCities.includes(cityName) && savedCities.length === 3) { // if true, the user decides which city to overwrite
            $warningSection.innerHTML = renderDecideOverwrite();
        } else {
            $warningSection.innerHTML = renderCityAlreadySaved(); // the city has been already saved            
        }
    }
    //calls the function to create citybuttons
    $savedCitiesContainer.innerHTML = makeSavedCityButtons(savedCities);
    storeSavedCities(savedCities);
    clearErrorSection();
}
// shows a warning message
function renderDecideOverwrite() {
    let html =
        `
    <div class="js-city-already-saved city-already-saved">
        <p>Már elmentettél három várost, klikkelj arra, amelyiket felül szeretnéd írni az újjal!</p>          
    </div>
    `;
    return html;
}
// shows a warning message
function renderCityAlreadySaved() {
    let html =
        `
    <div class="js-decide-overwrite decide-overwrite">
        <p>Ezt a várost már elmentetted!<i id="button-icon" class="bi bi-x"></i></p>                 
    </div>
    `;
    return html;
}
// -------------------------------- Render the current weather --------------------------------------------------
function renderWeather(weather) {
    let html =
        `
        <div class="current-weather-div">
            <div class="basic-weather-data">
                <h1 class="current-temp">${weather.current.temp_c}°C</h1>
                <img src="https:${weather.current.condition.icon}" alt="${weather.current.condition.text}"/>
            </div>
            <div class="weather-conditions-div">
                <div>            
                    <p>${weather.current.condition.text}</p>
                    <p>Hőérzet: ${weather.current.feelslike_c}°C</p>
                    <p>Szélsebesség: ${weather.current.wind_kph}km/h</p>        
                    <p>Széllökés: ${weather.current.gust_kph}km/h</p>        
                </div>    
                <div class="js-weather-details-div invisible">
                    <p>Csapadék: ${weather.current.precip_mm}mm</p>
                    <p>Légnyomás: ${weather.current.pressure_mb}hPa</p>        
                    <p>Páratartalom: ${weather.current.humidity}%</p>        
                    <p>Látótávolság: ${weather.current.vis_km}km</p>  
                </div>            
            </div>
        </div>
        <div class="weather-details-button-div">
        <button class="js-weather-details-button btn btn-primary">Részletes időjárás</button>      
        </div>    
    `;
    return html;
}
// ------------------------------ Forecast section ---------------------------------------------------
// the innerText depends on the visibility of the 3 days forecast
function changeForecastButtonName() {
    if ($forecastContainer.classList.contains("three-days")) {
        $threedaysForecastButton.innerText = 'Csak a mai előrejelzés';
    } else {
        $threedaysForecastButton.innerText = '3 napos előrejelzés';
    }
}
// changes the visibility of the 3 days forecast and 
function renderPlusTwoDaysForecast() {
    $forecastTomorrowContainer.classList.toggle("invisible");
    $forecastDayAfterTomorrowContainer.classList.toggle("invisible");
    $forecastContainer.classList.toggle("three-days");
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
// ----------------------------- Hourly forecast section ------------------------------------------------------------
// extracts the first two digits of the current hour from a string and converts them to an integer
function getCurrentHour(weather) {
    return parseInt(weather.location.localtime.slice(11, 13));
}
// returns the html of one hour forecast
function createHourlyForecastHtml(weather, day, hour, serialNumber) {
    let hourlyData = weather.forecast.forecastday[day].hour[hour];
    let html = `
        <section class="js-section-one-hour-forecast section-one-hour-forecast" data-serial-number="${serialNumber}">
            ${/*extracts the time from a string*/''}
            <p class="time-p">${hourlyData.time.slice(11)}</p>   
            <div class="section-one-hour-forecast-heading-div">
                <h2 class="section-one-hour-forecast-heading">${hourlyData.temp_c}°C</h2>
                <img src="https:${hourlyData.condition.icon}" alt="${hourlyData.condition.text}"/>
            </div>
            <div class"= hourly-forecast-div>
                <p>${hourlyData.condition.text}</p>
                <p>Hőérzet: ${hourlyData.feelslike_c}°C</p>
                <p>Szélseb.: ${hourlyData.wind_kph}km/h</p>        
                <p>Csapadék: ${hourlyData.precip_mm}mm</p>
                <p>Széllök.: ${hourlyData.gust_kph}km/h</p>        
                <p>Légny.: ${hourlyData.pressure_mb}hPa</p>        
                <p>Páratart.: ${hourlyData.humidity}%</p>        
                <p>Látótáv.: ${hourlyData.vis_km}km</p>  
                </div>
                </section>
                `;
    return html;
}

//TODO  pagination
function toggleActivePagination(event) {
    document.querySelector(".pagination > .active").classList.toggle("active");
    event.target.classList.toggle("active");
}

function handlePagination(event) {
    toggleActivePagination(event);
}

function renderTwentyFourHoursForecast(weather) {
    const currentHour = getCurrentHour(weather);
    let html = '';
    let j = 1;
    let k = 24 - currentHour;
    for (let i = currentHour + 1; i < 24; i++) {
        html += createHourlyForecastHtml(weather, 0, i, j);
        j++;
    }
    for (let i = 0; i < currentHour; i++) {
        html += createHourlyForecastHtml(weather, 1, i, k);
        k++;
    }
    return html;
}

// renders the forecast of the next three hours
// function renderfirstThreeHoursForecast(weather) {
//     let html = '';
//     const currentHour = getCurrentHour(weather);
//     for (let i = currentHour + 1; i < currentHour + 4; i++) {
//         // the "" are for prevent undefined classnames
//         html += createHourlyForecastHtml(weather, 0, i, "", "");
//     }
//     return html;
// }
// function renderRestHoursForecast(weather) {
//     let html = '';
//     let className1 = "js-rest-hours" // for the showRestHoursForecast()
//     let className2 = "invisible" // display: none;
//     const currentHour = getCurrentHour(weather);

//     for (let i = currentHour + 4; i < 24; i++) {
//         html += createHourlyForecastHtml(weather, 0, i, className1, className2);
//     } // parameters 0 and 1 are the index of the day. 0 = today 1 = tomorrow.
//     for (let i = 0; i < currentHour; i++) {
//         html += createHourlyForecastHtml(weather, 1, i, className1, className2);
//     }

//     return html;
// }
// --------------------------------- The main render function --------------------------------------
function renderResponse(weather) {
    let html = ``;
    // validation, on unsuccessful search "error" is the only key of the object
    if (!weather.error) {
        $locationName.innerText = weather.location.name;
        html += `<div class="weather-div">${renderWeather(weather)}</div>`;
        $forecastTodayContainer.innerHTML = `${renderForecastToday(weather)}`;
        $forecastTomorrowContainer.innerHTML = renderForecastTomorrow(weather);
        $forecastDayAfterTomorrowContainer.innerHTML = renderForecastDayAfterTomorrow(weather);
        $hoursForecastContainer.innerHTML = renderTwentyFourHoursForecast(weather);
        // $hoursForecastContainer.innerHTML = renderfirstThreeHoursForecast(weather);
        // $hoursForecastContainer.innerHTML += renderRestHoursForecast(weather);
    } else {
        $errorSection.innerHTML = `<p>Sajnálom, nem találtam ilyen nevű települést!<i id="button-icon" class="bi bi-x"></i></p>`;
        // load user's current position
        getUserPosition();
    }
    $container.innerHTML = html;
}
//------------------------------ Get the position of the city the user choosed -------------------------------------------
// fetches with the searched cityname
function fetchCity(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=14be385073aa4d85a9773012232610&q=${city}&aqi=no&lang=hu&days=5&alert=yes`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(renderResponse);
    clearErrorSection()
}
//------------------------------- Get the name of the searched city -----------------------------------------------
function formSubmitted(event) {
    // Prevent page reloading
    event.preventDefault();
    const city = $searchInput.value.trim();
    // clears the search box after the search
    $searchInput.value = '';
    // Its contents must be deleted every time you search!
    $container.innerHTML = '';
    // Validation
    if (city.length > 0) {
        // Its contents must be deleted every time you search!
        clearErrorSection();
        clearWarningSection();
        fetchCity(city)
    } else {
        $errorSection.innerHTML = `<p>Sikertelen keresés!<i id="button-icon" class="bi bi-x"></i></p>`;
        clearWarningSection();
        // load user's current position
        getUserPosition();
    }
}
//------------------------- Get the datas of a saved city -------------------------------------------------
function loadCity(event) {
    const isWarning = document.querySelector(".js-city-already-saved") === null;
    // when the user clicks on a savedcity button and the warning section doesn't have a warning about an already saved city then...
    if (event.target.classList.contains('saved-city-button') && isWarning) {
        fetchCity(event.target.innerText); // the innerText of a savedcity button
        clearWarningSection();
    } else {
        if (event.target.classList.contains('saved-city-button')) {
            overwriteSavedCity(event);
        }
    }
}
// TODO use dataset
function overwriteSavedCity(event) {
    // puts the new city in savedCities and delete the city choosen by the user
    savedCities.splice(savedCities.indexOf(event.target.innerText), 1, $locationName.innerHTML)
    // creates the new citybuttons
    $savedCitiesContainer.innerHTML = makeSavedCityButtons(savedCities);
    // clears the  warning message
    clearWarningSection();
}
// ------------------------ cleaning services :-) ---------------------------------------
// clears the  warning message
function clearWarningSection() {
    $warningSection.innerHTML = '';
}
// clears the  error message
function clearErrorSection() {
    $errorSection.innerHTML = '';
}
// -------------------------- Detailed weather visible/unvisible ---------------------
// the innerText depends on the visibility of the detailed weather
function changeDetailsButtonName() {
    if (document.querySelector(".js-weather-details-div").classList.contains("invisible")) {
        document.querySelector(".js-weather-details-button").innerText = 'Részletes időjárás';
    } else {
        document.querySelector(".js-weather-details-button").innerText = 'Kevesebb részlet';
    }
}
// changes the visibility of the detailed weather
function renderWeatherDetails(event) {
    if (event.target.classList.contains("js-weather-details-button")) {
        document.querySelector(".js-weather-details-div").classList.toggle("invisible");
        changeDetailsButtonName();
    }
}
// -------------------------- 24 hours forecast visible/unvisible -------------------
// the innerText depends on the visibility of the 24 hours forecast
function changeTwentyFourHoursForecastButtonName() {
    if (document.querySelector(".js-rest-hours").classList.contains("invisible")) {
        [...$twentyFourHoursForecastButtons].forEach(button => button.innerText = '24 órás előrejelzés');
    } else {
        [...$twentyFourHoursForecastButtons].forEach(button => button.innerText = '3 órás előrejelzés');
    }
}
// the innerText depends on the visibility of the 24 hours forecast
function changeNextHoursParagraphInnerText() {
    if (document.querySelector(".js-rest-hours").classList.contains("invisible")) {
        $nextHoursParagraph.innerText = 'Következő 3 óra';
    } else {
        $nextHoursParagraph.innerText = 'Következő 24 óra';
    }
}
// changes the visibility of the 24 hours forecast
function showRestHoursForecast() {
    [...document.querySelectorAll(".js-rest-hours")]
        .forEach(hour => hour.classList.toggle("invisible"));
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
[...$twentyFourHoursForecastButtons]
    .forEach(button => button.addEventListener("click", showRestHoursForecast));
$hamburgerMenuButton.addEventListener("click", toggleHamburgerMenu);
$navMenuList.addEventListener("click", toggleHamburgerMenu); // clicks work on the navMenuList as well
[...$paginationLinks].forEach(p => p.addEventListener("click", handlePagination));

getUserPosition();
loadLocalSavedCities();

