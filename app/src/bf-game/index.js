/**
 * @file Implements Bursting Felines game rules.
 * Every possible player actions should be implemented as a pure function
 * taking the current game state as a paramater and returning the resulting game
 * state.
 */

import { times, shuffle } from "./utils";

/**
 * Represent the state of a game of Bursting Felines.
 * @typedef {Object} GameState
 * @property {string[]} deck
 * @property {Object} players Object associating each player with their hand.
 */

/**
 * Types of card available in the game.
 * @see {@link https://github.com/3-Devs-1-Bug/bursting-felines/blob/main/README.md#card-list} for mor informations on the different cards.
 */
export const CardType = {
  Perish: "Perish",
  Resurect: "Resurect",
  Skip: "Skip",
  Attack: "Attack",
  Loot: "Loot",
  Deny: "Deny",
  Shuffle: "Shuffle",
  Peek: "Peek",
  Combo1: "Combo1",
  Combo2: "Combo2",
  Combo3: "Combo3",
  Combo4: "Combo4",
  Combo5: "Combo5"
};

/** Associate each card type with its number of copies in the deck. */
const DeckConfig = {
  [CardType.Perish]: 4,
  [CardType.Resurect]: 6,
  [CardType.Skip]: 4,
  [CardType.Attack]: 4,
  [CardType.Loot]: 4,
  [CardType.Deny]: 5,
  [CardType.Shuffle]: 4,
  [CardType.Peek]: 5,
  [CardType.Combo1]: 4,
  [CardType.Combo2]: 4,
  [CardType.Combo3]: 4,
  [CardType.Combo4]: 4,
  [CardType.Combo5]: 4
};

/**
 * Create a new game state object following the instructions
 * at {@link https://github.com/3-Devs-1-Bug/bursting-felines#setup}
 *
 * @param {string[]} playerIds Array of unique strings representing the players
 * @returns {GameState}
 */
export function createNewGame(playerIds) {
  // 1
  const baseDeck = [].concat(
    ...Object.keys(DeckConfig)
      .filter(type => type !== CardType.Perish && type !== CardType.Resurect)
      .map(type => times(DeckConfig[type], type))
  );

  // 2 & 3
  let deck = shuffle(baseDeck);
  const players = {};
  playerIds.forEach(playerId => {
    players[playerId] = [
      deck.pop(),
      deck.pop(),
      deck.pop(),
      deck.pop(),
      CardType.Resurect
    ];
  });

  // 4
  for (let i = 0; i < playerIds.length - 1; i++) {
    deck.push(CardType.Perish);
  }

  // 5
  for (let i = 0; i < DeckConfig[CardType.Resurect] - playerIds.length; i++) {
    deck.push(CardType.Resurect);
  }

  // 6
  deck = shuffle(deck);

  return {
    deck,
    players
  };
}

/**
 * Calculate the new state of the game when a player draws a card.
 *
 * @todo Add a `playerId` parameter and add the drawn card to the player's hand.
 *
 * @param {GameState} gameState Current state of the game
 * @param {string} playerId ID of the drawing player.
 * @returns {GameState} New state of the game.
 */
export function drawCard(gameState, playerId) {
  const [card, ...newDeck] = gameState.deck;
  return {
    ...gameState,
    players: {
      ...gameState.players,
      [playerId]: [...gameState.players[playerId], card]
    },
    deck: newDeck
  };
}
