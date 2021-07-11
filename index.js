import throttle from 'lodash.throttle';
import countryCardTmp from './countriesCard.hbs';
import countryTmp from './input-list';
import API from './fetchCountries.js';
import './styles.css';
const { error } = require('@pnotify/core');
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
    input: document.querySelector('.js-input'),
    cardContainer: document.querySelector('.js-container')
}

refs.input.addEventListener('input', throttle(onInput, 500));
refs.input.addEventListener('click', onInputClickClearCountryCard)

function onInput(event) {
    event.preventDefault();
    
    const searchQuery = event.target.value.trim();

    API.fetchCountries(searchQuery).then(countries => {
        if (countries.length === 1) {
            renderCountryCard(countries[0]);
        } else if (countries.length > 1 && countries.length < 10) {
            countryMarkUp(countries);
        } return countries;
        }).then(countries => {
            if (countries.length >= 10) {
                showError('Too many matches found. Please enter a more specific query!')
            }
            return countries;
        }).then(countries => {
            if (countries.status === 404) {
                showError('No matches found')     
            } return;
        })
}

function renderCountryCard(countries) {
    refs.cardContainer.innerHTML = '';
    const markUp = countryCardTmp(countries);
    refs.cardContainer.innerHTML = markUp;
    console.log(markUp);
}

function countryMarkUp(countries) {
    refs.cardContainer.innerHTML = '';
    const markUp = countryTmp(countries);
    refs.cardContainer.innerHTML = markUp;
    console.log(markUp);
}

function onInputClickClearCountryCard() {
    refs.input.value = '';
    refs.cardContainer.innerHTML = '';
}

function showError(errorMessage) {
    return error({
    text: errorMessage,
    maxTextHeight: null,
    animateSpeed: 'fast',
    delay: 2000,
    sticker: false,
    closerHover: false,
  });
}