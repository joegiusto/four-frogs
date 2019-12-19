// PART ONE
// Set inital game
const initalGame = { changed: false, bugs: [] };

// Set game by copying inital game
var game = Object.assign({}, initalGame);

// This is still false, good!
console.log(initalGame.changed)

// Setting game.changed!
game.changed = true;

// This is still false, good!
console.log(initalGame.changed);

// Everything works up to here, now here is the issue
// PART TWO - The problom part...
const bugStart = [
  '10,10',
  '10,75',
  '75,10', 
  '740,10',
  '665,10',
  '740,75',
  '10,745',
  '10,665',
  '75,745',
  '745,745',
  '745,665',
  '665,745',
];

populateBugs();

function populateBugs() {
  // This logs an empty array because initalGame.bugs has not been modified
  console.log(initalGame.bugs);

  // Populate game.bugs with the data from const bugStart
  for (i = 0; i < 12; i++) {
    game.bugs.push({
      held: false,
      heldBy: 'No One',
      x: bugStart[i].split(',')[0],
      y: bugStart[i].split(',')[1],
      bugType: Math.floor((Math.random() * 8) + 1),
      pad: 'none'
    })
  }
}

// This should also log an empty array because initalGame.bugs has not been modified yet it is from game.bugs being modified
console.log(initalGame.bugs);

// So Part One works but part two does not?