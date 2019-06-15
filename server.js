// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

const PORT = process.env.PORT || 5000;
// app.set('port', 8081);

app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', function (req, res) {
  const body = req.body.Body
  res.set('Content-Type', 'text/plain')
  res.set('Cache-Control', 'private, max-age=86400') // one year
  res.send(`You sent: ${body} to Express`)
})

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
//   console.log('Starting server on port 8081');
// });
// New
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Add the WebSocket handlers
io.on('connection', function(socket) {
});

var game = {
  active: false,
  stage: 0,
  players: {},
  specPlayers: {},
  bugs: [],
  insectTrack: [
    [],
    [],
    [],
    []
  ],
  powerups: [
    {
      id: 0,
      name: 'Tough Guy',
      visible: false,
    },
    {
      id: 1,
      name: 'Muddy Water',
      visible: false,
    },
    {
      id: 2,
      name: 'Stinky Frog',
      visible: false,
    },
    {
      id: 3,
      name: 'Big Taddy',
      visible: false,
    },
    {
      id: 4,
      name: 'Sphere of Influence',
      visible: false,
    },
    {
      id: 4,
      name: 'Lickity',
      visible: false,
    },
    {
      id: 5,
      name: 'Health Potion',
      visible: false,
    }
  ]
}



// Fill bugs array on server start
// Bug X and Y locations
bugStart = [
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

gameTime = 0;
scoreboardTime = 0;

startGame();

function startGame() {
  setInterval(function(){ console.log("Hello"); }, 3000);
}

gameTimer();
function gameTimer() {

  setTimeout(function () {
    gameTime++
    console.log(gameTime);
    if ( gameTime >= 50 ) {
      console.log('Game over');
    } else {
      // Recall function
      gameTimer();
    }

  }, 1000);
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

console.log(game);

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

io.on('connection', function(socket) {

  socket.on('new player', function(data) {

    if (ObjectLength(players) == 0) {
      players[socket.id] = {
        active: false,
        x: 80,
        y: 80,
        xStart: 80,
        yStart: 80,
        r: 0,
        score: 3,
        color: "#b50000",
        id: socket.id,
        health: 100,
        nickname: data['nickname'],
        zone: "red",
        homeZone: "red",
        holding: 0,
        canHold: true,
        canMove: true,
        tongue: false
      };
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

    console.log(players);
    console.log('Player Connected! There are/is now ' + ObjectLength(players) + ' player/s online.');

    io.sockets.emit( 'newPlayer', ObjectLength(players), players );

    console.log('Player Count')
    console.log(ObjectLength(players));

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
      player.holding = -3;
      setInterval( function() { 
        player.holding = 0;
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
          if ( players[keyNames[i]].x > players[keyNames[j]].x && players[keyNames[i]].x < +players[keyNames[j]].x + 50 && players[keyNames[i]].y > players[keyNames[j]].y && players[keyNames[i]].y < +players[keyNames[j]].y + 50) {
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
              console.log('Collide but not in zone?');
              console.log(players[keyNames[i]].homeZone);
              console.log(players[keyNames[i]].zone);
              console.log(players[keyNames[j]].zone);
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

      if (player.x > game.bugs[i].x && player.x < +game.bugs[i].x + 50 && player.y > game.bugs[i].y && player.y < +game.bugs[i].y + 50 && (player.holding === i || player.holding === 0)) {
        // console.log('Player ' + player.id + ' is on bug ' + i);
        game.bugs[i].heldBy = player.homeZone;
        player.holding = i;
        game.bugs[i].x = player.x - 10;
        game.bugs[i].y = player.y - 10;
      } else {
        game.bugs[i].heldBy = 'No one';
      }

    }

    for (i=0; i < 3; i++) {
      if (game.insectTrack[i].length === 0) {
        console.log('Player ' + i + ' died');
        kill(players[keyNames[i]]);
      }
    }

  });

});

setInterval(function() {

  io.sockets.emit('state', players, game.bugs, game.insectTrack, game.powerups);

}, 1000 / 60);

io.on('connection', function(socket) {
  // other handlers ...
  socket.on('disconnect', function() {

    console.log('Player Disconnected! There are/is now ' + 'onlinePlayerCount' + ' player/s online.');
    io.sockets.emit('disconnect');

    if (game.active === true) {
      players[socket.id] = {
        color: "white",
        nickname: "Disconnected"
      };
    } else {
      delete players[socket.id];
    }

  });
});