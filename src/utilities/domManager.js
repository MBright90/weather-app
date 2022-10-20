/* eslint-disable no-unused-vars */
const domManager = (() => {
  const imageLibrary = {
    clouds: 'assets/images/cloud.jpg',
    fog: 'assets/images/fog.jpeg',
    rain: 'assets/images/rain.jpeg',
    snow: 'assets/images/snow.jpg',
    sunny: 'assets/images/sunny.jpeg',
    storm: 'assets/images/storm.jpeg',
  }

  // Utility functions

  function createClassElement(element, ...classes) {
    const newElement = document.createElement(element)
    classes.forEach((className) => newElement.classList.add(className))
    return newElement
  }

  function createTextElement(element, text) {
    const newElement = document.createElement(element)
    newElement.textContent = text
    return newElement
  }

  HTMLElement.prototype.appendChildren = function appendChildren(...elementsToAppend) {
    elementsToAppend.forEach((element) => this.appendChild(element))
    return this
  }

  HTMLElement.prototype.setAttributes = function setAttributes(attributeObject) {
    Object.keys(attributeObject).forEach((key) => this.setAttribute(key, attributeObject[key]))
  }

  function retrieveWeatherImage(weatherID) {
    if (weatherID.match(/^800/)) return imageLibrary.sunny
    if (weatherID.match(/^8/)) return imageLibrary.clouds
    if (weatherID.match(/^(3|5)/)) return imageLibrary.rain
    if (weatherID.match(/^2/)) return imageLibrary.storm
    if (weatherID.match(/^6/)) return imageLibrary.snow
    return imageLibrary.fog
  }

  // Dom creation functions

  const layoutWrapper = createClassElement('div', 'layout-wrapper')
  document.body.appendChild(layoutWrapper)

  function createHeaderElement() {
    const header = document.createElement('header')
    const logo = createTextElement('h1', 'Whatever\'s the Weather')
    header.appendChild(logo)
    return header
  }

  function createSearchBar(inputName) {
    const locationInput = document.createElement('input')
    locationInput.setAttributes({
      'type': 'text',
      'name': inputName,
      'id': inputName,
      'placeholder': 'City, Town or Village',
      'minLength': 2,
      'maxLength': 100,
      'required': ''
    })
    return locationInput
  }

  function createButtonContainer() {
    const buttonContainer = createClassElement('div', 'button-container')
    const unitButton = createTextElement('button', 'Metric')
    unitButton.classList.add('unit-button')
    const searchButton = createTextElement('button', 'search')
    searchButton.classList.add('search-button')
    return buttonContainer.appendChildren(unitButton, searchButton)
  }

  function createSearchInput() {
    const label = document.createElement('label')
    label.setAttribute('for', 'nav-location-input')
    const locationInput = createSearchBar('nav-location-input')
    label.appendChild(locationInput)
    const buttonContainer = createButtonContainer()

    return [label, buttonContainer]
  }

  function createForecastInfo(location, weatherForecast, unit) {
    const forecastInfo = createClassElement('div', 'current-forecast-info')

    const paraLocation = createClassElement('p', 'para-location')
    const paraDate = createClassElement('p', 'para-date')
    const paraTemperature = createClassElement('p', 'para-temp')
    const paraWeather = createClassElement('p', 'para-weather')
    const paraFeelsLike = createClassElement('p', 'para-feels-like')
    const paraWindSpeed = createClassElement('p', 'para-wind-speed')
    
    paraLocation.textContent = location
    paraDate.textContent = `${weatherForecast.day} ${weatherForecast.date}`
    paraWeather.textContent = weatherForecast.weather.weatherType

    if (unit === 'metric') {
      paraTemperature.textContent = `${weatherForecast.temp}°C`
      paraFeelsLike.textContent = `Feels like: ${weatherForecast.feelsLike}°C`
      paraWindSpeed.textContent = `Wind speed: ${weatherForecast.windSpeed}m/s`
    } else {
      paraTemperature.textContent = `${weatherForecast.temp}°F`
      paraFeelsLike.textContent = `Feels like: ${weatherForecast.feelsLike}°F`
      paraWindSpeed.textContent = `Wind speed: ${weatherForecast.windSpeed}mph`
    }

    return forecastInfo.appendChildren(
      paraLocation,
      paraDate,
      paraTemperature,
      paraWeather,
      paraFeelsLike,
      paraWindSpeed
    )
  }

  // Update following function with suitable object access notation
  function createMainForecast(location, weatherForecast, unit) {
    const wrapperDiv = createClassElement('div', 'current-forecast-container')

    const forecastImage = createClassElement('div', 'current-forecast-image')
    forecastImage.style.backgroundImage = `url('${retrieveWeatherImage(weatherForecast.weather.weatherID.toString())}')`
    const forecastInfo = createForecastInfo(location, weatherForecast, unit)

    return wrapperDiv.appendChildren(
      forecastImage,
      forecastInfo)
  }

  // Update following function with suitable object access notation
  function createCardDeck(weather, units) {
    const createCardInfo = (day) => {
      const cardInfo = createClassElement('div', 'card-info')
      const paraDate = createClassElement('p', 'para-date')
      const paraWeather = createClassElement('p', 'para-weather')
      const paraTemperature = createClassElement('p', 'para-temperature')
      const paraFeelsLike = createClassElement('p', 'para-feels-like')
      const paraWindSpeed = createClassElement('p', 'paraWindSpeed')

      paraDate.textContent = `${day.day} ${day.date}`
      paraWeather.textContent = day.weather.weatherType

      if (units === 'metric') {
        paraTemperature.textContent = `${day.temp}°C`
        paraFeelsLike.textContent = `Feels like: ${day.feelsLike}°C`
        paraWindSpeed.textContent = `Wind speed: ${day.windSpeed}m/s`
      } else {
        paraTemperature.textContent = `${day.temp}°F`
        paraFeelsLike.textContent = `Feels like: ${day.feelsLike}°F`
        paraWindSpeed.textContent = `Wind speed: ${day.windSpeed}mph`
      }

      return cardInfo.appendChildren(
        paraDate,
        paraWeather,
        paraTemperature,
        paraFeelsLike,
        paraWindSpeed
      )
         
    }

    const createForecastCard = (weatherInfo, containerElement) => {
      weatherInfo.forEach((day) => {
        console.log(day)
        const card = createClassElement('div', 'forecast-card')
        const cardImage = createClassElement('div', 'card-image')
        cardImage.style.backgroundImage = `url('${retrieveWeatherImage(day.weather.weatherID.toString())}')`
        const cardInfo = createCardInfo(day)

        card.appendChildren(
          cardImage,
          cardInfo,
        )
        containerElement.appendChild(card)
      })
    }

    const cardStack = createClassElement('div', 'forecast-card-stack')
    console.log(weather)
    createForecastCard(weather, cardStack)
    return cardStack
  }

  function createMainElement() {
    return document.createElement('main')
  }

  function createNavElement() {
    const navElement = document.createElement('nav')
    const header = createHeaderElement()
    const locationSearch = createSearchInput()
    return navElement.appendChildren(header, locationSearch[0], locationSearch[1])
  }

  function createStartupPage() {
    const startupContainer = createClassElement('div', 'startup-container')
    const startupImage = document.createElement('div')
    const startupInput = createSearchBar('startup-location-input')
    const searchButton = createTextElement('button', 'Search')
    searchButton.classList.add('search-button')
    startupImage.appendChildren(startupInput, searchButton)
    startupContainer.appendChild(startupImage)
    return startupContainer
  }

  function createForecastContainer(weatherInfo, units) {
    const forecastContainer = createClassElement('div', 'forecast-container')
    return forecastContainer.appendChildren(
      createMainForecast(weatherInfo.name, weatherInfo.forecast[0], units),
      createCardDeck(weatherInfo.forecast.slice(1), units),
    )
  }

  function createLoadingContainer() {
    const loadingContainer = createClassElement('div', 'loading-container')
    const loadingIcon = createClassElement('div', 'loading-icon')
    loadingContainer.append(loadingIcon)
    return loadingContainer
  }

  function createErrorModal() {
    const modal = createClassElement('div', 'modal')
    const errorLineOne = createTextElement('p', 'We could not find a location with the information you have entered')
    const errorLineTwo = createTextElement('p', 'Please check your spelling or coordinates and try again')
    return modal.appendChildren(errorLineOne, errorLineTwo)
  }

  function showDashboard() {
    layoutWrapper.appendChild(createNavElement())
    layoutWrapper.appendChild(createMainElement())
  }

  function showStartupMain() {
    let main = document.querySelector('main')
    if (!main) {
      main = document.createElement('main')
      layoutWrapper.appendChild(main)
    }
    main.appendChild(createStartupPage())
  }

  // Return functions

  function initHome() {
    showDashboard()
    showStartupMain()
  }

  function showCurrentForecast(weatherInfo, unitInfo) {
    const units = unitInfo || 'metric'

    let main = document.querySelector('main')
    if (!main) {
      main = document.createElement('main')
      layoutWrapper.appendChild(main)
    }
    main.appendChild(createForecastContainer(weatherInfo, units))
  }

  function showLoading() {
    let main = document.querySelector('main')
    if (!main) {
      main = document.createElement('main')
      layoutWrapper.appendChild(main)
    }
    main.appendChild(createLoadingContainer())
  }

  function showErrorModal() {
    let main = document.querySelector('main')
    if (!main) {
      main = document.createElement('main')
      layoutWrapper.appendChild(main)
    }
    main.appendChild(createErrorModal())
  }

  function updateUnitText(newUnits) {
    const unitButtons = document.querySelectorAll('.unit-button')
    unitButtons.forEach(button => {
      button.textContent = newUnits
    })
  }

  function removeMain() {
    document.querySelector('main').remove()
  }

  return {
    initHome,
    showCurrentForecast,
    showLoading,
    showErrorModal,
    updateUnitText,
    removeMain,
  }

})()

export default domManager