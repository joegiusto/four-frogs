// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
// var http = require('http');
var path = require('path');
// var socketIO = require('socket.io');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

// var server = http.Server(app);
// var io = socketIO(server);

const {execSync} = require('child_process');

// const PORT = process.env.PORT || 8081;
// app.set('port', PORT);

app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: false }));

// app.post('/', function (req, res) {
//   const body = req.body.Body
//   res.set('Content-Type', 'text/ plain')
//   res.set('Cache-Control', 'private, max-age=86400') // one year
//   res.send(`You sent: ${body} to Express`)
// })

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/join', function(request, response) {
  response.sendFile(path.join(__dirname, 'join.html'));
});

app.use(express.static(__dirname + '/'));

// Starts the server.
// Old
// server.listen(8081, function() {
  // console.log('Starting server on port 8081');
// });
// New
// app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

/// New New
http.listen(process.env.PORT || 8081, () => {
  console.log( '\x1b[32m%s\x1b[0m', '[Startup] HTTP Ready');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
});

var debug = {
  mode: true,
  
  // These can only be changed if debug.mode is true
  powerups: {
    // Turn off powerup spawning
    cycle: true,
    // Spawn specifc powerup (-1 for default)
    override: -1
  },

  // These can be changed regardless of debug.mode state
  display: {
    bugInfo: true
  },

  timeOverride: 600,
  playersToStart: 1
}

// Used to populate the game object and reset everything back to default once game is over

const gameTime = 60 * 2;

const initalGame = {
  active: false,
  stage: 0,
  timer: gameTime,
  scoreboard: {
    time_before_restart: 30
  },
  players: {},
  specPlayers: {},
  bugs: [],
  insectTrack: [
    [],
    [], 
    [],
    []
  ],
  powerups: {
    cycled: [
      {
        id: 'Tough Guy',
        name: 'Tough Guy',
      },
      {
        id:  'Muddy Water',
        name: 'Muddy Water',
      },
      {
        id: 'Stinky Frog',
        name: 'Stinky Frog',
      },
      // {
      //   id: (debug.mode === true ? debug.powerups.override : 4),
      //   name: 'Sphere of Influence',
      // },
      // {
      //   id: (debug.mode === true ? debug.powerup : 5),
      //   name: 'Lickity Split',
      // },
      // {
      //   id: (debug.mode === true ? debug.powerups.override : 3),
      //   name: 'Big Taddy',
      // },
    ],
    static: [
      {
        id: 100,
        name: 'Health Potion',
      }
    ],
    active: {
      active: false,
      id: null,
      powerups_experation: 15
    },
    powerup_next: null
  },
  // Time at which powerup will spawn
  powerups_times: [ /*(gameTime - (gameTime / 4) )*/ (110), (gameTime / 2), (gameTime / 4) ],
  // Populated on server start
  powerups_schedule: [],
  powerups_experation: 5
}

// var game = Object.assign({}, initalGame);
const clone = JSON.parse(JSON.stringify(initalGame));

var game = {
  ...clone, 
  bugs: clone.bugs,
  scoreboard: {...clone.scoreboard},
  players: {...clone.players}
};

for (i=0; i < game.powerups_times.length; i++) {
  
  // Random powerup calculator
  var randomPowerup = Math.floor(Math.random() * game.powerups.cycled.length);

  if (debug.mode === true && debug.powerups.override != -1) {
    game.powerups_schedule.push({
      time: game.powerups_times[i],
      type: game.powerups.cycled[debug.powerups.override].id
    });
  } else {

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    game.powerups_schedule.push({
      time: game.powerups_times[i],
      id: game.powerups.cycled[randomPowerup].id,
      active: false,
      x: getRandomArbitrary(200, 550),
      y: getRandomArbitrary(200, 550) 
    });
  }
}

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
  game.bugs = [];

  // Fill bugs array on server start
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

function closest(arr,val){
  return Math.max.apply(null, arr.filter(function(v){return v <= val}))
}

function gameTimer() {

    game.active = true;

    setTimeout(function () {
    
      game.timer--;
  
      if ( game.timer < 0 )  {
        game.active = false;
        clearInterval(gameTimer);
        console.log('Game over');
        scoreboard();
      } else {
        
        var futurePowerups = game.powerups_schedule.filter(obj => {
          return obj.time < game.timer
        })
        
        futurePowerups = futurePowerups.map(function (obj) {
          return obj.time;
        })
        
        // console.log(futurePowerups)
        game.powerups.powerup_next = closest(futurePowerups, game.timer);
  
        var futurePowerups = game.powerups_schedule.filter(obj => {
          return obj.time > game.timer
        })
  
        game.powerups_schedule.forEach(powerup => {
  
          if (powerup.time === game.timer) {
            console.log(`Making powerup "${powerup.id}" active!`)
            game.powerups.active.id = powerup.id;
            game.powerups.active.active = true;
            game.powerups.active.x = powerup.x;
            game.powerups.active.y = powerup.y;
          }
  
        })
  
        // Recall function
        gameTimer();
      }
  
    }, 1000);

};

function scoreboard() {
  var scoreboardTimer = setInterval( function() {

    game.scoreboard.time_before_restart--;
    io.sockets.emit('time-left', game.scoreboard.time_before_restart);

    if (game.scoreboard.time_before_restart === 0) {
      clearInterval(scoreboardTimer);
      resetGame();
    }

  }, 1000)
}

function startPowerupExpiration(id) {
  var timeLeft = game.powerups_experation;

  var powerupTimer = setInterval( function() {
    console.log(`Powerup has ${timeLeft}s left`);

    timeLeft--;

    if (timeLeft === 0) {
      clearInterval( powerupTimer );
      console.log("Powerup has expired");

      // players.forEach( player => {
      //   player.powerup = -1;
      // })

      Object.keys(players).forEach(function(key) {
        players[key].powerup = -1;
      });

    }

  }, 1000 )

}

function resetGame() {
  console.log("Reset game was called!");

  //  Tell client game is over ( Scoreboard does this automatically, this is for manual resetGame calls! )
  io.sockets.emit('time-left', 0);

  function getConnectedSockets() {
    return Object.values(io.of("/").connected);
  }
  
  getConnectedSockets().forEach(function(s) {
    s.disconnect(true);
  });

  game = {
    ...clone, 
    bugs: clone.bugs,
    scoreboard: {...clone.scoreboard},
    players: {},
    powerups: {...clone.powerups}
  };
  populateBugs();
}

// Called on the tagged player, freezes them then thaws them after period of time.
function playerTagged(player) {
  player.canMove = false;
  setTimeout(function () {
    player.canMove = true;
  }, 1500);
}

// Called on player that is out.
function kill(player) {
  player.canMove = false;
  player.color = "white";
  player.nickname = "Out";
}

// Finished game handleing.
function gameOver(reason) {
  player.canMove = false;
  player.color = "white";
  player.nickname = "Out";

  switch(reason) {
    case 'timeOut':
      console.log('Game time limit reached');
      break;
    case 'allOut':
      console.log('All other players were eliminated');
      break;
    default:
      console.log('Why was game over called?');
  }

}

var players = {};

function ObjectLength( object ) {
  var length = 0;
  for( var key in object ) {
      if( object.hasOwnProperty(key) ) {
          ++length;
      }
  }
  return length;
};

class Player {

  constructor(details) {
    this.active = false
    this.x = 80;
    this.y = 80;
    this.xStart = 80;
    this.yStart = 80;
    this.r = 0;
    this.score = 0;
    this.color = "#b50000";
    this.id = details.id;
    this.health = 100;
    this.nickname = details.nickname;
    this.zone = "red";
    this.homeZone = "red";
    this.holding = 0;
    this.powerup = -1;
    this.canHold = true;
    this.canMove = true;
    this.tongue = false;
  }

  static hello() {
    return "Hello!!";
  }
}

io.on('connection', function(socket) {

  socket.on('new player', function(data) {

    // console.log(game.bugs);
    console.log(game.powerups_schedule)

    if (ObjectLength(players) == 0) {

      players[socket.id] = new Player ({
        nickname: data['nickname'],
        id: socket.id
      });

      // players[socket.id] = {
      //   active: false,
      //   x: 80,
      //   y: 80,
      //   xStart: 80,
      //   yStart: 80,
      //   r: 0,
      //   score: 3,
      //   color: "#b50000",
      //   id: socket.id,
      //   health: 100,
      //   nickname: data['nickname'],
      //   zone: "red",
      //   homeZone: "red",
      //   holding: 0,
      //   powerup: -1,
      //   canHold: true,
      //   canMove: true,
      //   tongue: false
      // };

    } else if (ObjectLength(players) == 1) {
      players[socket.id] = {
        active: false,
        x: 720,
        y: 80,
        xStart: 720,
        yStart: 80,
        r: 0,
        score: 0,
        color: "Blue",
        id: socket.id,
        health: 100,
        nickname: data['nickname'],
        zone: "blue",
        homeZone: "blue",
        holding: 0,
        powerup: -1,
        canHold: true,
        canMove: true,
        tongue: false
      };
    } else if (ObjectLength(players) == 2) {
      players[socket.id] = {
        active: false,
        x: 80,
        y: 720,
        xStart: 80,
        yStart: 720,
        r: 0,
        score: 0,
        color: "Green",
        id: socket.id,
        health: 100,
        nickname: data['nickname'],
        zone: "green",
        homeZone: "green",
        holding: 0,
        powerup: -1,
        canHold: true,
        canMove: true,
        tongue: false
      };
    } else if (ObjectLength(players) == 3) {
      players[socket.id] = {
        active: false,
        x: 720,
        y: 720,
        xStart: 720,
        yStart: 720,
        r: 0,
        score: 0,
        color: "#e0c900",
        id: socket.id,
        health: 100,
        nickname: data['nickname'],
        zone: "yellow",
        homeZone: "yellow",
        holding: 0,
        powerup: -1,
        canHold: true,
        canMove: true,
        tongue: false
      };
    } else {
      players[socket.id] = {
        x: 0,
        y: 0,
        r: 0,
        score: 0,
        color: "#000",
        id: socket.id,
        health: 100,
        nickname: data['nickname']
      };
    };

    console.log('Player Connected! There is now ' + ObjectLength(players) + ' player online.');

    io.sockets.emit( 'newPlayer', ObjectLength(players), players, debug.display.bugInfo );

    // Set back to 4 
    if (ObjectLength(players) === (debug.mode === true ? debug.playersToStart : 4)) {

      if ( game.active === false ) {
        console.log("Game loop is not active, starting up!")
        console.log(game)
        console.log(clone)
        gameTimer();
      }

    };

  });

  var playerSpeed = 5;
  var playerSize = 40;
  var playerSizeCut = playerSize / 2;

  socket.on('movement', function(data) {

    var player = players[socket.id] || {};

    if ( player.canMove === true ) {
      if (data.left && player.x > 5) {
        player.x -= playerSpeed;
      }
  
      if (data.up && player.y > 5) {
        player.y -= playerSpeed;
      }
  
      if (data.right && player.x < 800 - playerSize -5 ) {
        player.x += playerSpeed;
      }
  
      if (data.down && player.y < 800 - playerSize -5 ) {
        player.y += playerSpeed;
      }
    }
    

    if (data.rotateLeft) {
      player.r -= 5;
      if (player.r <= 0) {
        player.r = 360;
      }
    }

    if (data.rotateRight) {
      player.r += 5;
      if (player.r >= 360) { 
        player.r = 0;
      }
    }

    if (data.score) {
      player.score ++;
    }

    if (data.tongue) {
      player.tongue = true;
      player.canHold = false;
      player.holding = 0;

      setInterval( function() { 
        player.holding = 0;
        player.canHold = false;
      }, 3000);

    } else {
      player.tongue = false;
    }

    if (player.x <= 400 - playerSizeCut && player.y <= 400 - playerSizeCut) {
      player.zone = "red";
    }

    if (player.x >= 400 - playerSizeCut && player.y <= 400 - playerSizeCut) {
      player.zone = "blue";
    }

    if (player.x <= 400 - playerSizeCut && player.y >= 400 - playerSizeCut) {
      player.zone = "green";
    }

    if (player.x >= 400 - playerSizeCut && player.y >= 400 - playerSizeCut) {
      player.zone = "yellow";
    }

    var keyNames = Object.keys(players);

    for ( i = 0; i < 4; i++ ) {
      
      for ( j = 0; j < 4; j++ ) {

        try {
          if ( players[keyNames[i]].x > players[keyNames[j]].x - 50 && players[keyNames[i]].x < +players[keyNames[j]].x + 50 && players[keyNames[i]].y > players[keyNames[j]].y - 50 && players[keyNames[i]].y < +players[keyNames[j]].y + 50) {
            if (i === j) { continue; }
            console.log(i + '-' + j + ' Collided');
            if ( players[keyNames[i]].homeZone === players[keyNames[i]].zone && players[keyNames[i]].zone === players[keyNames[j]].zone) {
              console.log('Send player ' + j + ' back to home zone');
              players[keyNames[j]].x = players[keyNames[j]].xStart;
              players[keyNames[j]].y = players[keyNames[j]].yStart;
              players[keyNames[j]].health = players[keyNames[j]].health - 33.5;
              if ( players[keyNames[j]].health <= 0 ) {
                kill(players[keyNames[j]]);
              } else {
                playerTagged(players[keyNames[j]]);
              }
            } else {
              // console.log('Collide but not in zone?');
              // console.log(players[keyNames[i]].homeZone);
              // console.log(players[keyNames[i]].zone);
              // console.log(players[keyNames[j]].zone);
            }
          }
        }
        catch {
          // console.log('Lobby not full')
        }

      }

    }

    game.insectTrack[0] = [];
    game.insectTrack[1] = [];
    game.insectTrack[2] = [];
    game.insectTrack[3] = [];

    for ( i = 0; i < game.bugs.length; i++ ) {

      if (game.bugs[i].x < 160 && game.bugs[i].y < 160) {
        game.bugs[i].pad = "red";
        // redList.push(game.bugs[i].bugType);
        game.insectTrack[0].push(game.bugs[i].bugType);

      } else if (game.bugs[i].x > 640 && game.bugs[i].y < 160) {
        game.bugs[i].pad = "blue";
        // blueList.push(game.bugs[i].bugType);
        game.insectTrack[1].push(game.bugs[i].bugType);

      } else if (game.bugs[i].x < 160 && game.bugs[i].y > 640) {
        game.bugs[i].pad = "green";
        // greenList.push(game.bugs[i].bugType);
        game.insectTrack[2].push(game.bugs[i].bugType);

      } else if(game.bugs[i].x > 640 && game.bugs[i].y > 640) {
        game.bugs[i].pad = "yellow";
        // yellowList.push(game.bugs[i].bugType);
        game.insectTrack[3].push(game.bugs[i].bugType);

      } else {
        game.bugs[i].pad = "Moving";
      }

      // Keep bug on top of player if player is holding bug
      if ( player.holding !== 0 && player.canHold ) {
        game.bugs[2].x = player.x - 10;
        game.bugs[2].y = player.y - 10;
      }

      // Bugs collision
      if ( 
        player.x > game.bugs[i].x - 50 
        && 
        player.x < +game.bugs[i].x + 50
        &&
        player.y > game.bugs[i].y - 50 
        &&
        player.y < +game.bugs[i].y + 50 
        && 
        // (player.holding === i || player.holding === 0)
        player.holding === 0
      ) {
        // console.log('Player ' + player.id + ' is on bug ' + i);
        game.bugs[i].heldBy = player.homeZone;
        player.holding = i;
        game.bugs[i].x = player.x - 10;
        game.bugs[i].y = player.y - 10;
      } else {
        game.bugs[i].heldBy = 'No one';
      }

    }

     // Powerup location collision
     if ( player.x > game.powerups.active.x - 40 && player.x < +game.powerups.active.x + 40 && player.y > game.powerups.active.y - 40 && player.y < +game.powerups.active.y + 40 && game.powerups.active.active === true) {

      console.log(player.homeZone + ' player was on powerup ' + game.powerups.active.id);

      switch(game.powerups.active.id) {
        case 5:
          player.health = player.health + 33;
          game.powerups.active.active = false;
          break;
        case 4:
          console.log(game.powerups.cycled[game.powerups.active.id].name + ' Picked Up');
          game.powerups.active.active = false;
          player.powerup = 4;
          break;
        case 3:
          console.log(game.powerups.cycled[game.powerups.active.id].name + ' Picked Up');
          game.powerups.active.active = false;
          player.powerup = 3;
          break;
        case 'Stinky Frog':
          // console.log(game.powerups.cycled[game.powerups.active.id].name + ' Picked Up');
          game.powerups.active.active = false;
          player.powerup = 'Stinky Frog';
          break;
        case 'Muddy Water':
          // console.log(game.powerups.cycled[game.powerups.active.id].name + ' Picked Up');
          game.powerups.active.active = false;
          player.powerup = 'Muddy Water';
          break;
        case 'Tough Guy':
          // console.log(game.powerups.cycled[game.powerups.active.id].name + ' Picked Up');
          game.powerups.active.active = false;
          player.powerup = 'Tough Guy';
          break;
        default:
          console.log('Unknown Powerup?');
      }

      startPowerupExpiration(game.powerups.active.id)

    }

    // No bugs left at pad check
    for (i=0; i < 3; i++) {
      if (game.insectTrack[i].length === 0) {
        console.log('Player ' + i + ' died');
        kill(players[keyNames[i]]);
      }
    }

  });

  socket.on('resetGame', function() {
    console.log("Reset Game Called");
    resetGame();
  })

});

setInterval(function() {
  io.sockets.emit('state', players, game.bugs, game.insectTrack, game.powerups, game.timer, game.powerups_schedule);
}, 1000 / 60);

io.on('connection', function(socket) {
  // other handlers ...
  socket.on('disconnect', function() {

    console.log('Player Disconnected! There are/is now ' + 'onlinePlayerCount' + ' player/s online.');
    io.sockets.emit('disconnect');

    if (game.active === true) {
      // players[socket.id] = {
      //   color: "white",
      //   nickname: "Disconnected"
      // };

      delete players[socket.id];

    } else {
      delete players[socket.id];
    }

  });

});