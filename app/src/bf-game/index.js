/**
 * @file Implements Bursting Felines game rules.
 * Every possible player actions should be implemented as a pure function
 * taking the current game state as a paramater and returning the resulting game
 * state.
 */

import { shuffle, deepClone } from "./utils";
import { defaultDeck } from "./cards";
import { CardType } from "./types";
import { v4 as uuidv4 } from "uuid";
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
 * @property {string} looterId Stores the id of the player that used a loot card
 * @property {string} lootTargetId Stores the id of the player must give up a card to the looter
 * @property {number} attackCards Number of attack cards played
 */

/**
 * Card
 * @typedef {Object} Card
 * @property {string} type
 * @property {string} text
 */

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
  InsertingPerishCard: "InsertingPerishCard",
  /** Player has used a loot card and is picking a target */
  ChoosingLootTarget: "ChoosingLootTarget",
  /** Loot target is selecting a card to give away */
  ResolvingLoot: "ResolvingLoot",
  /** Player is peeking top 3 cards in deck */
  Peeking: "Peeking"
};

/**
 * Create a new game state object following the instructions
 * at {@link https://github.com/3-Devs-1-Bug/bursting-felines#setup}
 *
 * @param {string[]} playerIds Array of unique strings representing the players
 * @returns {GameState}
 */
export function createNewGame(playerIds) {
  let cards = [];
  for (let cardType in defaultDeck) {
    defaultDeck[cardType].map(card =>
      cards.push({
        id: uuidv4(),
        type: cardType,
        text: card.text
      })
    );
  }

  // Remove all the Perish and Resurrect cards from the deck
  const baseDeck = [].concat(
    cards.filter(
      card => card.type !== CardType.Perish && card.type !== CardType.Resurect
    )
  );

  let deck = shuffle(baseDeck);
  const playerHands = {};
  const statuses = {};
  // Deal 1 Resurrect card to each player so that everyone has a hand of 5 cards total
  let resurectCards = cards.filter(card => card.type === CardType.Resurect);
  playerIds.forEach(playerId => {
    playerHands[playerId] = [
      deck.pop(),
      deck.pop(),
      deck.pop(),
      deck.pop(),
      resurectCards.pop()
    ];
    statuses[playerId] = PlayerStatus.Alive;
  });

  // Insert Perish cards: one fewer than the number of people playing
  let perishCards = cards.filter(card => card.type === CardType.Perish);
  for (let i = 0; i < playerIds.length - 1; i++) {
    deck.push(perishCards.pop());
  }

  // Insert the extra Resurrect cards back in the deck
  deck.push(...resurectCards);

  deck = shuffle(deck);

  return {
    deck,
    discardPile: [],
    players: playerIds,
    hands: playerHands,
    statuses,
    turnCount: 0,
    specialPhase: null,
    attackCards: 0
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

  if (card.type === CardType.Perish) {
    const hasResurect =
      playerHand.map(card => card.type).indexOf(CardType.Resurect) > -1;
    if (hasResurect) {
      console.log("Player has a resurect to play");
      newGameState.specialPhase = GamePhase.ResolvingPerish;
    } else {
      console.log("Player had no Resurect, terminate");
      return perish(gameState);
    }
  } else {
    // if you were under attack, it's still your turn
    if (newGameState.attackCards > 0) {
      newGameState.attackCards--;
    } else {
      newGameState.turnCount++;
    }
  }

  playerHand.push(card);

  return newGameState;
}

/**
 * Removes the card from the players hand, and adds it to the discard pile.
 * The card is not yet processed, as a player could play a deny card on top,
 * cancelling it's effect.
 *
 * @param {GameState} gameState Current state of the game
 * @param {Card} card The card the player chose to submit
 * @returns {GameState} New state of the game.
 */
export function submitCard(gameState, userId, card) {
  const newGameState = deepClone(gameState);

  newGameState.submitTime = 3;
  // remove card from player's hand
  const playerHand = newGameState.hands[userId];
  const cardIndex = playerHand.map(card => card.id).indexOf(card.id);
  playerHand.splice(cardIndex, 1);

  console.log(userId + " submitted " + card.type);

  if (card.type === CardType.Resurect) {
    // you can't deny a resurrection
    newGameState.discardPile.unshift(card);
    return playCard(newGameState, userId, card);
  } else if (gameState.specialPhase === GamePhase.ResolvingLoot) {
    // don't add to discard pile, the card is going to another player
    return playCard(newGameState, userId, card);
  } else {
    newGameState.discardPile.unshift(card);
  }

  return newGameState;
}

/**
 * Calculate the new state of the game when a player chooses a card to play.
 *
 * @param {GameState} gameState Current state of the game
 * @param {Card} priorityCard A card that can skip submit phase (eg. Resurect)
 * @returns {GameState} New state of the game.
 */
export function playCard(gameState, userId, priorityCard) {
  const newGameState = deepClone(gameState);
  newGameState.submitTime = 0;

  // get submitted card
  const card = priorityCard || gameState.discardPile[0];

  console.log(userId + " played " + card.type);

  if (gameState.specialPhase === GamePhase.ResolvingLoot) {
    console.log(
      `[${newGameState.lootTargetId}] gave [${newGameState.looterId}] a ${card.type} card`
    );
    const looterHand = newGameState.hands[newGameState.looterId];
    looterHand.push(card);

    newGameState.specialPhase = null;
    newGameState.lootTargetId = null;
    newGameState.looterId = null;
  } else if (
    card.type === CardType.Resurect &&
    gameState.specialPhase === GamePhase.ResolvingPerish
  ) {
    newGameState.specialPhase = GamePhase.InsertingPerishCard;
  } else if (card.type === CardType.Skip) {
    if (newGameState.attackCards > 0) {
      newGameState.attackCards--;
    } else {
      // skip the drawing phase
      newGameState.turnCount++;
    }
  } else if (card.type === CardType.Shuffle) {
    newGameState.deck = shuffle(gameState.deck);
  } else if (card.type === CardType.Loot) {
    // set looter
    newGameState.looterId = userId;
    const opponentsAlive = getOpponentsAlive(gameState);

    console.log(userId + " is looter");

    newGameState.specialPhase = GamePhase.ChoosingLootTarget;

    if (opponentsAlive.length === 1) {
      console.log("Only 1 opponent alive, auto select loot victim");
      newGameState.specialPhase = GamePhase.ResolvingLoot;
      newGameState.lootTargetId = opponentsAlive[0];
    } else {
      newGameState.specialPhase = GamePhase.ChoosingLootTarget;
    }
  } else if (card.type === CardType.Attack) {
    newGameState.attackCards++;
    // skip the drawing phase
    newGameState.turnCount++;
  } else if (card.type === CardType.Peek) {
    newGameState.specialPhase = GamePhase.Peeking;
  }

  console.log("New phase " + newGameState.specialPhase);

  return newGameState;
}

export function getCurrentPlayerId(gameState) {
  return gameState.players[gameState.turnCount % gameState.players.length];
}

export function getOpponentsAlive(gameState) {
  const currentPlayerId = getCurrentPlayerId(gameState);
  return gameState.players.filter(
    playerId =>
      playerId !== currentPlayerId &&
      gameState.statuses[playerId] !== PlayerStatus.Dead
  );
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
  const perishCardIndex = playerHand
    .map(card => card.type)
    .indexOf(CardType.Perish);
  const perishCard = playerHand.splice(perishCardIndex, 1)[0];
  newGameState.deck.splice(perishNewPosition, 0, perishCard);

  newGameState.specialPhase = null;

  if (newGameState.attackCards > 0) {
    newGameState.attackCards--;
  } else {
    newGameState.turnCount++;
  }

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

export function setLootTarget(gameState, targetId) {
  console.log(targetId + " has become the loot target");
  const newGameState = deepClone(gameState);
  newGameState.lootTargetId = targetId;
  newGameState.specialPhase = GamePhase.ResolvingLoot;
  return newGameState;
}

export function resetPhase(gameState) {
  const newGameState = deepClone(gameState);
  newGameState.specialPhase = null;
  return newGameState;
}
