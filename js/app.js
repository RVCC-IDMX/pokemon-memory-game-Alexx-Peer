/* eslint-disable max-len */

/**
 * Main Application Logic - Simplified Version
 * This file contains the main functionality for the Pokemon Card Flip App
 */
import { PokemonService } from './pokemon.js';

// DOM Elements
const cardGrid = document.getElementById('card-grid');
const loadingSpinner = document.getElementById('loading-spinner');

// Constants
const CARD_COUNT = 12;
const TOTAL_PAIRS = 6;
// Application State
let cards = [];
let matchedPairs = 0;

// Debug flag - set to true to simulate slower loading
const DEBUG_SHOW_SPINNER = false;
const LOADING_DELAY = 2000; // 2 seconds delay

/**
 * Initialize the application
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function | MDN: async function}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event | MDN: DOMContentLoaded}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/classList | MDN: classList}
 */
async function initApp() {
  // Show loading spinner
  showLoading();

  // Hide the card grid initially
  cardGrid.classList.add('hidden');

  // Create card elements
  createCardElements();

  // Fetch initial Pokemon data
  await fetchAndAssignPokemon();

  // Set up event listeners
  setupEventListeners();

  // Hide loading spinner and show cards
  hideLoading();
  cardGrid.classList.remove('hidden');
}

/**
 * Create card elements in the grid
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement | MDN: createElement}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML | MDN: innerHTML}
 */
function createCardElements() {
  // Clear existing cards
  cardGrid.innerHTML = '';
  cards = [];

  // Create new cards
  for (let i = 0; i < CARD_COUNT; i++) {
    const card = createCardElement(i);
    cardGrid.appendChild(card);
    cards.push(card);
  }
}

/**
 * Create a single card element
 * @param {number} index - Card index
 * @returns {HTMLElement} Card element
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset | MDN: dataset}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild | MDN: appendChild}
 */
function createCardElement(index) {
  // Create card elements
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.index = index;

  const cardInner = document.createElement('div');
  cardInner.className = 'card-inner';

  const cardFront = document.createElement('div');
  cardFront.className = 'card-front';

  const cardBack = document.createElement('div');
  cardBack.className = 'card-back';

  // Add Pokeball image to front
  const pokeballImg = document.createElement('img');
  pokeballImg.src = '/assets/pokeball.png';
  pokeballImg.alt = 'red and white Pokéball';
  pokeballImg.className = 'pokeball-img';
  cardFront.appendChild(pokeballImg);

  // Assemble card
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);

  return card;
}

/**
 * Fetch and assign Pokemon to cards
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch | MDN: try...catch}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise | MDN: Promise}
 */
async function fetchAndAssignPokemon() {
  try {
    // Fetch multiple random Pokemon
    const pokemonList = await PokemonService.fetchMultipleRandomPokemon(6);

    // Create pairs by duplicating each Pokémon
    const pokemonPairs = pokemonList.flatMap(pokemon => [pokemon, { ...pokemon }]);

    // Shuffle the pairs
    const shuffledPairs = shuffleArray(pokemonPairs);

    // If debug flag is on, add artificial delay to show the spinner
    if (DEBUG_SHOW_SPINNER) {
      await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
    }

    // Assign Pokémon to cards with error checking
    for (let i = 0; i < Math.min(CARD_COUNT, shuffledPairs.length); i++) {
      if (cards[i] && shuffledPairs[i]) {
        assignPokemonToCard(cards[i], shuffledPairs[i]);
      }
    }
  } catch (error) {
    console.error('Error fetching and assigning Pokemon:', error);
    // error handling
    console.error('Failed to load Pokémon. Please try refreshing the page.');
  }
}

// Implement a shuffle function
function shuffleArray(array) {
  // deep copy of the array
  const arrayCopy = structuredClone(array);

  // Fisher-Yates shuffle algorithm
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
}


/**
 * Assign a Pokemon to a card
 * @param {HTMLElement} card - Card element
 * @param {Object} pokemon - Pokemon data
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify | MDN: JSON.stringify}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector | MDN: querySelector}
 */
function assignPokemonToCard(card, pokemon) {
  if (!card || !pokemon) {
    return;
  }

  // Store Pokemon data in card dataset
  card.dataset.pokemon = JSON.stringify(pokemon);

  // Get card back element
  const cardBack = card.querySelector('.card-back');

  // Clear existing content
  cardBack.innerHTML = '';

  // Create Pokemon elements
  const pokemonImg = document.createElement('img');
  pokemonImg.src = pokemon.sprite;
  pokemonImg.alt = pokemon.name;
  pokemonImg.className = 'pokemon-img';

  const pokemonName = document.createElement('h2');
  pokemonName.textContent = pokemon.name;
  pokemonName.className = 'pokemon-name';

  const pokemonTypes = document.createElement('div');
  pokemonTypes.className = 'pokemon-types';

  // Add type badges
  pokemon.types.forEach(type => {
    const typeBadge = document.createElement('span');
    typeBadge.textContent = type;
    typeBadge.className = `type-badge ${type}`;
    pokemonTypes.appendChild(typeBadge);
  });

  // Create stats section
  const pokemonStats = document.createElement('div');
  pokemonStats.className = 'pokemon-stats';

  // Add height stat
  const heightStat = document.createElement('div');
  heightStat.className = 'stat';
  heightStat.innerHTML = `<span>Height</span><span class="stat-value">${pokemon.height}m</span>`;

  // Add weight stat
  const weightStat = document.createElement('div');
  weightStat.className = 'stat';
  weightStat.innerHTML = `<span>Weight</span><span class="stat-value">${pokemon.weight}kg</span>`;

  // Add abilities count
  const abilitiesStat = document.createElement('div');
  abilitiesStat.className = 'stat';
  abilitiesStat.innerHTML = '<span>Abilities</span>' +
    `<span class="stat-value">${pokemon.abilities.length}</span>`;

  // Assemble stats
  pokemonStats.appendChild(heightStat);
  pokemonStats.appendChild(weightStat);
  pokemonStats.appendChild(abilitiesStat);

  // Assemble card back
  cardBack.appendChild(pokemonImg);
  cardBack.appendChild(pokemonName);
  cardBack.appendChild(pokemonTypes);
  cardBack.appendChild(pokemonStats);
}

/**
 * Handle card click
 * @param {Event} event - Click event
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event | MDN: Event}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList | MDN: classList}
 */

// State-tracking variables
let firstSelectedCard = null;
let secondSelectedCard = null;
// Flag to prevent interaction during card processing
let isProcessingPair = false;

function handleCardClick(event) {

  //find the clicked card
  const card = event.target.closest('.card');

  // return if it's not a valid card
  if (!card || isProcessingPair) {
    return;
  }

  // prevent selecting the card if it's already flipped or matched
  if (card.classList.contains('flipped') || card === firstSelectedCard || card === secondSelectedCard) {
    return;
  }

  // Flip the card
  card.classList.add('flipped');

  // Track selections
  if (!firstSelectedCard) {
    // First card selection
    firstSelectedCard = card;
  } else if (firstSelectedCard !== card) {
    // Second card selection
    secondSelectedCard = card;
    isProcessingPair = true;
    checkForMatch();
  }
}

// check if two selected cards match
function checkForMatch() {
  let firstPokemonData, secondPokemonData;

  try {
    firstPokemonData = JSON.parse(firstSelectedCard.dataset.pokemon);
    secondPokemonData = JSON.parse(secondSelectedCard.dataset.pokemon);
  } catch (error) {
    console.error('Error parsing Pokémon data:', error);
    resetSelection();
    return;
  }

  if (!firstPokemonData || !secondPokemonData) {
    console.error('Missing Pokémon data');
    resetSelection();
    return;
  }

  setTimeout(() => {
    if (firstPokemonData.id === secondPokemonData.id) {
      handleMatch();
    } else {
      handleNonMatch();
    }
  }, 250);   //delay before match-checking
}

// handle matching cards
function handleMatch() {
  // Keep cards flipped if they match
  firstSelectedCard.classList.add('match');
  secondSelectedCard.classList.add('match');

  // Increment matched pairs count
  matchedPairs++;

  // Check if the game is complete
  checkGameCompletion();

  resetSelection();
}

// handle non-matching cards
function handleNonMatch() {
  setTimeout(() => {
    firstSelectedCard.classList.remove('flipped');
    secondSelectedCard.classList.remove('flipped');
    resetSelection();
  }, 500); // delay if cards are not matched
}

// reset card selection
function resetSelection() {
  firstSelectedCard = null;
  secondSelectedCard = null;
  isProcessingPair = false;
}

// Function to check if all pairs have been matched
function checkGameCompletion() {
  if (matchedPairs === TOTAL_PAIRS) {
    showGameComplete();
  }
}

// Function to display game completion message
function showGameComplete() {

  // Create a container for the message
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('completion-message');

  // Add the message content
  messageContainer.innerHTML = `
    <h2>Congratulations!</h2>
    <p>You found all the Pokémon pairs!</p>
    <button id="play-again">Play Again</button>
  `;

  // Add to the page
  document.querySelector('.container').appendChild(messageContainer);

  // Set up the play again button
  document.getElementById('play-again').addEventListener('click', () => {
    messageContainer.remove();
    resetGame();
  });
}


/**
 * Set up event listeners
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener | MDN: addEventListener}
 */
function setupEventListeners() {
  // Card click event
  cardGrid.addEventListener('click', handleCardClick);
}

/**
 * Show loading spinner
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList | MDN: classList}
 */
function showLoading() {
  loadingSpinner.classList.remove('hidden');
}

/**
 * Hide loading spinner
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList | MDN: classList}
 */
function hideLoading() {
  loadingSpinner.classList.add('hidden');
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Function to reset the game
function resetGame() {
  matchedPairs = 0;
  initApp();
}