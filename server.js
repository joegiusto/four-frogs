// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 8081);
app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', function (req, res) {
  const body = req.body.Body
  res.set('Content-Type', 'text/plain')
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
server.listen(8081, function() {
  console.log('Starting server on port 8081');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
});

// setInterval(function() {
//   io.sockets.emit('message', 'hi!');
// }, 1000);

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

// var onlinePlayerCount = 0;

var game = {
  active: false,
  players: {},
  specPlayers: {},
  bugs: []
}

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
    bugType: Math.floor((Math.random() * 8) + 1)
  })
}

setInterval(function() {
  io.sockets.emit('bugs', game.bugs);
}, 1000);

console.log(game);

var players = {};
// var playerID = [

// ];

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
      player.tongue = !player.tongue;
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
        
        // console.log( i + '-' + j);

        try {
          if ( players[keyNames[i]].x > players[keyNames[j]].x && players[keyNames[i]].x < +players[keyNames[j]].x + 50 && players[keyNames[i]].y > players[keyNames[j]].y && players[keyNames[i]].y < +players[keyNames[j]].y + 50) {
            console.log(i + '-' + j + ' Collided');
            if ( players[keyNames[i]].homeZone === players[keyNames[i]].zone && players[keyNames[i]].zone === players[keyNames[j]].zone) {
              console.log('Send player ' + j + ' back to home zone');
              players[keyNames[j]].x = players[keyNames[j]].xStart;
              players[keyNames[j]].y = players[keyNames[j]].yStart;
            }
          }
        }
        catch {
          console.log('Lobby not full')
        }

      }

    }

    // console.log('player ' + player.id + ' is moving');
    for ( i = 0; i < game.bugs.length; i++ ) {

      if (player.x > game.bugs[i].x && player.x < +game.bugs[i].x + 50 && player.y > game.bugs[i].y && player.y < +game.bugs[i].y + 50) {
        console.log('Player ' + player.id + ' is on bug ' + i);
        game.bugs[i].heldBy = player.homeZone;
        game.bugs[i].x = player.x - 10;
        game.bugs[i].y = player.y - 10;
      } else {
        game.bugs[i].heldBy = 'No one';
      }

    }

    // socket.on('playerTagged', function(id) {
    //   players[id].x = players[id].xStart;
    //   players[id].y = players[id].yStart;
    //   players[id].health = players[id].health - 33;
    //   console.log("Fired" + id);
    // });

  });

  // socket.on('getPlayerLocations', function(data) {
  //   console.log(playerID.player1);
  //   console.log(playerID.player2);
  //   console.log(playerID.player3);
  //   console.log(playerID.player4);
  // });

  socket.on('disconnect', function() {
    // players[socket.id] = {
    //   x: 0,
    //   y: 0,
    //   color: "white"
    // };
    // onlinePlayerCount--;
    console.log('Player Disconnected! There are/is now ' + 'onlinePlayerCount' + ' player/s online.');
    // io.sockets.emit('playerCount', onlinePlayerCount);
    io.sockets.emit('disconnect');
  });

});

setInterval(function() {

  io.sockets.emit('state', players, game.bugs);

}, 1000 / 60);

io.on('connection', function(socket) {
  // other handlers ...
  socket.on('disconnect', function() {

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