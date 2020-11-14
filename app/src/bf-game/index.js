/**
 * @file Implements Bursting Felines game rules.
 * Every possible player actions should be implemented as a pure function
 * taking the current game state as a paramater and returning the resulting game
 * state.
 */

import { times, shuffle, deepClone } from "./utils";

/**
 * Represent the state of a game of Bursting Felines.
 * @typedef {Object} GameState
 * @property {string[]} deck
 * @property {string[]} discardPile
 * @property {string[]} players List of player IDs
 * @property {Object} hands Object associating each player with their hand.
 * @property {Object} statuses Object associating each player with their status (alive or dead).
 * @property {number} turnCount Player turn counter. Whenever a player finishes
 *   their turn. This should be incremented by 1. Note that a player taking two
 *   turns because of an attack still counts as 1 "turn" on this counter.
 * @property {string | null} specialPhase Used to represent special game situations that must be resolved.
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

export const PlayerStatus = {
  Alive: "Alive",
  Dead: "Dead"
};

export const GamePhase = {
  /**
   * When a player draws a Perish card, the game special phase is changed to
   * `ResolvingPerish` the situation is resolved and the player either die or use
   * a Resurect card to survive.
   */
  ResolvingPerish: "ResolvingPerish",
  /**
   * When a player plays a Resurect card, the game special phase is changed to
   * `InsertingPerishCard` the player needs to choose where to re-insert the Perish card
   * they just canceled.
   */
  InsertingPerishCard: "InsertingPerishCard"
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
  const playerHands = {};
  const statuses = {};
  playerIds.forEach(playerId => {
    playerHands[playerId] = [
      deck.pop(),
      deck.pop(),
      deck.pop(),
      deck.pop(),
      CardType.Resurect
    ];
    statuses[playerId] = PlayerStatus.Alive;
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
    discardPile: [],
    players: playerIds,
    hands: playerHands,
    statuses,
    turnCount: 0,
    specialPhase: null
  };
}

/**
 * Calculate the new state of the game when a player draws a card. The player doing
 * the action is determined by the `turnCount` property.
 *
 * @param {GameState} gameState Current state of the game
 * @returns {GameState} New state of the game.
 */
export function drawCard(gameState) {
  const newGameState = deepClone(gameState);

  const playerId = getCurrentPlayerId(newGameState);
  const playerHand = newGameState.hands[playerId];
  const [card, ...newDeck] = gameState.deck;

  newGameState.deck = newDeck;

  if (card === CardType.Perish) {
    // kill of player instantly he has no Resurect

    if (playerHand.indexOf(this.CardType.Resurect) === -1) {
      console.log("Player had no Resurect, terminate");
      return perish(gameState);
    } else {
      console.log("Player has a resurect to play");
      newGameState.specialPhase = GamePhase.ResolvingPerish;
    }
  } else {
    newGameState.turnCount++;
  }

  playerHand.push(card);

  return newGameState;
}

/**
 * Calculate the new state of the game when a player chooses a card to play.
 *
 * @param {GameState} gameState Current state of the game
 * @param {CardType} card The card the player chose to play
 * @returns {GameState} New state of the game.
 */
export function playCard(gameState, card) {
  const newGameState = deepClone(gameState);

  if (
    card === CardType.Resurect &&
    gameState.specialPhase === GamePhase.ResolvingPerish
  ) {
    newGameState.specialPhase = GamePhase.InsertingPerishCard;
  } else if (card === CardType.Skip) {
    // skip the drawing phase
    newGameState.turnCount++;
  } else if (card === CardType.Shuffle) {
    newGameState.deck = shuffle(gameState.deck);
  }

  const playerId = getCurrentPlayerId(gameState);
  const playerHand = newGameState.hands[playerId];
  const cardIndex = playerHand.indexOf(card);
  playerHand.splice(cardIndex, 1)[0];

  console.log("player " + playerId.substring(0, 8) + " played " + card);

  newGameState.discardPile.push(card);

  return newGameState;
}

export function getCurrentPlayerId(gameState) {
  return gameState.players[gameState.turnCount % gameState.players.length];
}

/**
 * Inserting the Perish card after a Resurect was played
 * @param {GameState} gameState
 * @param {Number} perishNewPosition
 * @returns {GameState}
 */
export function insertPerish(gameState, perishNewPosition) {
  if (gameState.specialPhase !== GamePhase.InsertingPerishCard) {
    throw new Error('Game must be in special phase "InsertingPerishCard"');
  }

  /** @type {GameState} */
  const newGameState = deepClone(gameState);
  const currentPlayerId = getCurrentPlayerId(newGameState);
  const playerHand = newGameState.hands[currentPlayerId];

  // Perish card is re-inserted into deck at an index chosen by the player
  const perishCardIndex = playerHand.indexOf(CardType.Perish);
  const perishCard = playerHand.splice(perishCardIndex, 1)[0];
  newGameState.deck.splice(perishNewPosition, 0, perishCard);

  newGameState.specialPhase = null;
  newGameState.turnCount++;

  return newGameState;
}

export function perish(gameState) {
  /** @type {GameState} */
  const newGameState = deepClone(gameState);
  const currentPlayerId = getCurrentPlayerId(newGameState);
  const playerHand = newGameState.hands[currentPlayerId];

  const playerCards = playerHand.splice(0, playerHand.length);
  newGameState.discardPile.push(...playerCards);
  newGameState.statuses[currentPlayerId] = PlayerStatus.Dead;

  newGameState.specialPhase = null;
  newGameState.turnCount++;

  return newGameState;
}
