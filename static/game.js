function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
  }
  else
  {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
      end = dc.length;
      }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
} 

var myCookie = getCookie("nickname");

if (myCookie == null) {
    // Cookie does not exist stuff;
    document.cookie = "nickname" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.replace("../join.html");
    console.log("No Cookie :(");
}
else {
    // Cookie does exist stuff;
    console.log("Cookie exist, bringing player into game");

    $( "#nameChange" ).click(function() {
      window.location.replace("../join.html");
    });

    var socket = io();

    // socket.on('message', function(data) {
    //   console.log(data);
    // });



    socket.on('newPlayer', function(totalPlayerCount, players) {

      document.getElementById('playerCount').innerHTML = totalPlayerCount;
      totalPlayerCount >= 4 ? ($('#lobbyStatus').html('[Game In Progress]'), $('#lobbyStatus').css("color", "green") ) : ( $('#lobbyStatus').html('[Waiting on more players]'), $('#lobbyStatus').css("color", "red") );

      var keyNames = Object.keys(players);

      try {
        document.getElementById('lobby_1').innerHTML = players[ keyNames[0] ].nickname;
      }
      catch(err) {
        console.log('Red Player is still needed to start the game')
      }
      try {
        document.getElementById('lobby_2').innerHTML = players[ keyNames[1] ].nickname;
      }
      catch(err) {
        console.log('Blue Player is still needed to start the game')
      }
      try {
        document.getElementById('lobby_3').innerHTML = players[ keyNames[2] ].nickname;
      }
      catch(err) {
        console.log('Green Player is still needed to start the game')
      }
      try {
        document.getElementById('lobby_4').innerHTML = players[ keyNames[3] ].nickname;
      }
      catch(err) {
        console.log('Yellow Player is still needed to start the game')
      }

    });

    var movement = {
        up: false,
        down: false,
        left: false,
        right: false,
        tongue: false
      }
      document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
          case 65: // A
            movement.left = true;
            break;
          case 87: // W
            movement.up = true;
            break;
          case 68: // D
            movement.right = true;
            break;
          case 83: // S
            movement.down = true;
            break;
          case 37: // ArrowLeft
            movement.rotateLeft = true;
            break;
          case 39: // ArrowRight
            movement.rotateRight = true;
            break;
          case 38: // ArrowUp
            movement.score = true;
            break;
          case 32: // Tongue
            movement.tongue = !movement.tongue;
            break;
        }
      });
      document.addEventListener('keyup', function(event) {
        switch (event.keyCode) {
          case 65: // A
            movement.left = false;
            break;
          case 87: // W
            movement.up = false;
            break;
          case 68: // D
            movement.right = false;
            break;
          case 83: // S
            movement.down = false;
            break;
          case 37: // ArrowLeft
            movement.rotateLeft = false;
            break;
          case 39: // ArrowRight
            movement.rotateRight = false;
            break;
        }
      });

    socket.emit( 'new player', { nickname: getCookie("nickname") } );

    socket.on('bugs', function(data) {
      document.getElementById('bug-1-info').innerHTML = 'X:' + data[0].x + ' Y:' + data[0].y + ' Holder:' + data[0].heldBy;
      document.getElementById('bug-2-info').innerHTML = 'X:' + data[1].x + ' Y:' + data[1].y + ' Holder:' + data[1].heldBy;
      document.getElementById('bug-3-info').innerHTML = 'X:' + data[2].x + ' Y:' + data[2].y + ' Holder:' + data[2].heldBy;
      document.getElementById('bug-4-info').innerHTML = 'X:' + data[3].x + ' Y:' + data[3].y + ' Holder:' + data[3].heldBy;
      document.getElementById('bug-5-info').innerHTML = 'X:' + data[4].x + ' Y:' + data[4].y + ' Holder:' + data[4].heldBy;
      document.getElementById('bug-6-info').innerHTML = 'X:' + data[5].x + ' Y:' + data[5].y + ' Holder:' + data[5].heldBy;
      document.getElementById('bug-7-info').innerHTML = 'X:' + data[6].x + ' Y:' + data[6].y + ' Holder:' + data[6].heldBy;
      document.getElementById('bug-8-info').innerHTML = 'X:' + data[7].x + ' Y:' + data[7].y + ' Holder:' + data[7].heldBy;
      document.getElementById('bug-9-info').innerHTML = 'X:' + data[8].x + ' Y:' + data[8].y + ' Holder:' + data[8].heldBy;
      document.getElementById('bug-10-info').innerHTML = 'X:' + data[9].x + ' Y:' + data[9].y + ' Holder:' + data[9].heldBy;
      document.getElementById('bug-11-info').innerHTML = 'X:' + data[10].x + ' Y:' + data[10].y + ' Holder:' + data[10].heldBy;
      document.getElementById('bug-12-info').innerHTML = 'X:' + data[11].x + ' Y:' + data[11].y + ' Holder:' + data[11].heldBy;
    });

    setInterval(function() {
      socket.emit('movement', movement);
      movement.score = false;
    }, 1000 / 60);

    var stats_1 = document.getElementById('stats_1');
    stats_1.innerHTML= "No gameplay yet";

    var stats_2 = document.getElementById('stats_2');
    stats_2.innerHTML= "No gameplay yet";

    var stats_3 = document.getElementById('stats_3');
    stats_3.innerHTML= "No gameplay yet";

    var stats_4 = document.getElementById('stats_4');
    stats_4.innerHTML= "No gameplay yet";

    var canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 800;

    var context = canvas.getContext('2d');

    socket.on('playerID', function(data) {
      document.getElementById('playerOneId').innerHTML = data[0].id;
      document.getElementById('playerTwoId').innerHTML = data[1].id;
      document.getElementById('playerThreeId').innerHTML = data[2].id;
      document.getElementById('playerFourId').innerHTML = data[3].id;
    });

    function RandomBug() {
      return (
        Math.floor(Math.random() * 5)
      );
    }

    

    socket.on('state', function(players) {
      context.clearRect(0, 0, 800, 800);

      context.fillStyle='rgba(255,105,97,.5)'; 
      context.fillRect(0, 0, 400, 400);
      // context.fillStyle='#ff4747'; 
      // context.fillRect(0, 0, 200, 200);
  
      context.fillStyle='rgba(173,216,230,.5)'; 
      context.fillRect(400, 0, 400, 400);
      // context.fillStyle='#25b1dd'; 
      // context.fillRect(600, 0, 200, 200);
  
      context.fillStyle='rgba(144,238,144,.5)'; 
      context.fillRect(0, 400, 400, 400);
      // context.fillStyle='#28e228'; 
      // context.fillRect(0, 600, 200, 200);
  
      context.fillStyle='rgba(239,239,143,.5)'; 
      context.fillRect(400, 400, 400, 400);
      // context.fillStyle='#eded50'; 
      // context.fillRect(600, 600, 200, 200);

      drawRotated(0, 0, 320, "Red");
      drawRotated(800 - 160, 0, 30, "Blue");
      drawRotated(0, 800 - 160, 225, "Green");;
      drawRotated(800 - 160, 800 - 160, 145, "Yellow");

      var img = document.getElementById("padRed");
      // context.drawImage(img, 0, 0);
      var img = document.getElementById("padBlue");
      // context.drawImage(img, 800 - 160, 0);
      var img = document.getElementById("padYellow");
      // context.drawImage(img, 800 - 160, 800 - 160);
      var img = document.getElementById("padGreen");
      // context.drawImage(img, 0, 800 - 160);

      var img = document.getElementById("bug-1");
      context.drawImage(img, 10, 10, 50, 50);

      var img = document.getElementById("bug-2");
      context.drawImage(img, 10, 75, 50, 50);

      var img = document.getElementById("bug-3");
      context.drawImage(img, 75, 10, 50, 50);

      var img = document.getElementById("bug-4");
      context.drawImage(img, 800 - 60, 10, 50, 50);

      var img = document.getElementById("bug-5");
      context.drawImage(img, 800 - 135, 10, 50, 50);

      var img = document.getElementById("bug-6");
      context.drawImage(img, 800 - 60, 75, 50, 50);

      // var img = document.getElementById("bug-7");
      // context.drawImage(img, 75, 10, 50, 50);

      // var img = document.getElementById("bug-8");
      // context.drawImage(img, 425, 425, 50, 50);
      
      function drawRotated(x, y, degrees, color) {
        x = x + 80;
        y = y + 80;
        var image = document.getElementById("pad" + color);
    
        // save the unrotated context of the canvas so we can restore it later
        // the alternative is to untranslate & unrotate after drawing
        context.save();
    
        // move to the center of the canvas
        context.translate(x,y);
    
        // rotate the canvas to the specified degrees
        context.rotate(degrees*Math.PI/180);
    
        // draw the image
        // since the context is rotated, the image will be rotated also
        context.drawImage(image, -image.width/2, -image.width/2);
    
        // we’re done with the rotating so restore the unrotated context
        context.restore();
      };

      var keyNames = Object.keys(players);

      for (var id in players) {
        var player = players[id];

        var playerSize = 40;

        // Circle (Original)
        context.beginPath();
        context.fillStyle = player.color;
        context.fillRect(player.x, player.y, playerSize, playerSize);
        // context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
        context.fill();

        // Left Eye
        context.beginPath();
        context.fillStyle = "#000";
        context.fillRect(player.x + 2.5, player.y + 2.5, 10, 10);
        context.fill();

        // Right Eye
        context.beginPath();
        context.fillStyle = "#000";
        context.fillRect(player.x + 27.5, player.y + 2.5, 10, 10);
        context.fill();

        // Mouf
        context.beginPath();
        context.fillStyle = "#000";
        context.fillRect(player.x + 5, player.y + 20, 30, 10);
        context.fill();

        // Tongue
        context.beginPath();
        context.fillStyle = "#FFC0CB";

        if (player.tongue == false) {
          context.fillRect(player.x + 10, player.y + 28, 20, 5);
        } else {
          context.fillRect(player.x + 10, player.y + 28, 20, 20);
        }
        
        context.fill();

        context.font = "10px Arial";
        context.fillStyle = "#000";
        context.fillText(player.nickname, player.x, player.y + -5);

      }

      // console.log(players);

      try {
        // $("#redHealth").css("width", players[keyNames[0] ].health + "%" );
        // $("#blueHealth").css("width", players[keyNames[1] ].health + "%" );
        // $("#greenHealth").css("width", players[keyNames[2] ].health + "%" );
        // $("#yellowHealth").css("width", players[keyNames[3] ].health + "%" );

        if ( players[ keyNames[0] ].x < players[ keyNames[1] ].x + 40 &&
          players[ keyNames[0] ].x + 40 > players[ keyNames[1] ].x &&
          players[ keyNames[0] ].y < players[ keyNames[1] ].y + 40 &&
          players[ keyNames[0] ].y + 40 > players[ keyNames[1] ].y ) {
           // collision detected!
           console.log("Collision");

           // Blue tagged in Red Home
          //  if ( players[ keyNames[1] ].zone == players[ keyNames[0] ].homeZone ) {
          //   socket.emit('playerTagged', players[ keyNames[1] ].id);
          //   console.log("Blue tagged in Red Home");
          //  }

           // Red tagged in Blue Home
          //  if ( players[ keyNames[0] ].zone == players[ keyNames[1] ].homeZone ) {
          //   socket.emit('playerTagged', players[ keyNames[0] ].id);
          //   console.log("Red tagged in Blue Home");
          //  }

       } else {
        // No Collision
       }
      }
      catch(err) {
        // console.log("Error: " + err);
      }

      // document.getElementById('playerOneId').innerHTML = players[ keyNames[0] ].id || 'blank';
      // document.getElementById('playerTwoId').innerHTML = players[ keyNames[1] ].id || 'blank';
      // document.getElementById('playerThreeId').innerHTML = players[ keyNames[2] ].id || 'blank';
      // document.getElementById('playerFourId').innerHTML = players[ keyNames[3] ].id || 'blank';

      try {
        
        stats_1.innerHTML= 'X:' + players[ keyNames[0] ].x + ' Y: ' + players[ keyNames[0] ].y + ' R:' + players[ keyNames[0] ].r + ' Score:' + players[ keyNames[0] ].score + '<br>Zone:' + players[ keyNames[0] ].zone + ' Holding:' + players[ keyNames[0] ].holding + ' Tongue:' + players[ keyNames[0] ].tongue;
        stats_2.innerHTML= 'X:' + players[ keyNames[1] ].x + ' Y: ' + players[ keyNames[1] ].y + ' R:' + players[ keyNames[1] ].r + ' Score:' + players[ keyNames[1] ].score + '<br>Zone:' + players[ keyNames[1] ].zone + ' Holding:' + players[ keyNames[1] ].holding;
        stats_3.innerHTML= 'X:' + players[ keyNames[2] ].x + ' Y: ' + players[ keyNames[2] ].y + ' R:' + players[ keyNames[2] ].r + ' Score:' + players[ keyNames[2] ].score + '<br>Zone:' + players[ keyNames[2] ].zone + ' Holding:' + players[ keyNames[2] ].holding;
        stats_4.innerHTML= 'X:' + players[ keyNames[3] ].x + ' Y: ' + players[ keyNames[3] ].y + ' R:' + players[ keyNames[3] ].r + ' Score:' + players[ keyNames[3] ].score + '<br>Zone:' + players[ keyNames[3] ].zone + ' Holding:' + players[ keyNames[3] ].holding;
      }
      catch(err) {
        // console.log("Lobby not full yet");
      }

    });
}; //End Else if for cookie check