/**
 * @file Implements Bursting Felines game rules.
 * Every possible player actions should be implemented as a pure function
 * taking the current game state as a paramater and returning the resulting game
 * state.
 */

/**
 * Represent the state of a game of Bursting Felines.
 * @typedef {Object} GameState
 * @property {string[]} deck
 */

/**
 * Types of card available in the game.
 * @see {@link https://github.com/3-Devs-1-Bug/bursting-felines/blob/main/README.md#card-list} for mor informations on the different cards.
 */
export const CardType = {
  Perish: "Perish",
  Resurect: "Resurect"
};

/**
 * Calculate the new state of the game when a player draws a card.
 *
 * @todo Add a `playerId` parameter and add the drawn card to the player's hand.
 *
 * @param {GameState} gameState Current state of the game
 * @returns {GameState} New state of the game.
 */
export function drawCard(gameState) {
  const newDeck = gameState.deck.slice(1);
  return {
    deck: newDeck
  };
}
