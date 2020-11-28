import { CardType } from "./types";

export const defaultDeck = {
  [CardType.Perish]: [
    { text: "Fatal Error" },
    { text: "Fatal Error" },
    { text: "Yellow Screen Of Death" },
    { text: "An AI took your job" },
    { text: "You deployed a crypto miner by mistake" },
    { text: "You got a ransomware on the production server" }
  ],
  [CardType.Resurect]: [
    { text: "Dan Abramov saved you" },
    { text: "You mastered spaghetti oriented programming" },
    { text: "Resurect" },
    { text: "Resurect" },
    { text: "Resurect" },
    { text: "Resurect" }
  ],
  [CardType.Skip]: [
    { text: "Works on my machine" },
    { text: "Blame it on the junior dev" },
    { text: "Skip" },
    { text: "Skip" }
  ],
  [CardType.Attack]: [
    { text: "Deploy to production on a friday" },
    { text: "Attack" },
    { text: "Attack" },
    { text: "Attack" }
  ],
  [CardType.Loot]: [
    { text: "Git fetch" },
    { text: "Loot" },
    { text: "Loot" },
    { text: "Loot" }
  ],
  [CardType.Deny]: [
    { text: "You forgot to remove a breakpoint" },
    { text: "Blocked by a Windows update" },
    { text: "Git reset" },
    { text: "Deny" },
    { text: "Deny" }
  ],
  [CardType.Shuffle]: [
    { text: "Start from scratch" },
    { text: "Try turning it off and on again?" },
    { text: "Shuffle" },
    { text: "Shuffle" },
    { text: "Shuffle" }
  ],
  [CardType.Peek]: [
    { text: "Google search" },
    { text: "Decompile assembly" },
    { text: "Peek" },
    { text: "Peek" },
    { text: "Peek" }
  ]
};
