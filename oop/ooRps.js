function createPlater() {
  return {
    // possible state: player name
    // possiblle state: player's current move
    
    choose() {
      // not yet implemented
    },
  };

}

function createMove() {
  return {
    // possible state: type of move (rock, paper, scissors)
  };
}

function createRule() {
  return {
    // possible state? not clear whether Rules need state
  };
}

// Since we don't yet know where to put `compare`, let's define
// it as an ordinary function
let compare = function(move1, move2) {
  // not yet implemented
};

const RPSGame = {
  play() {
    
  }
}

RPSGame.play()