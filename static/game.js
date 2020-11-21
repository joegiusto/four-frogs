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



    socket.on('newPlayer', function(totalPlayerCount, players, displayBugs) {

      document.getElementById('playerCount').innerHTML = totalPlayerCount;
      totalPlayerCount >= 4 ? ($('#lobbyStatus').html('[Game In Progress]'), $('#lobbyStatus').css("color", "green") ) : ( $('#lobbyStatus').html('[Waiting on more players]'), $('#lobbyStatus').css("color", "red") );

      var keyNames = Object.keys(players);

      try {
        document.getElementById('lobby_1').innerHTML = players[ keyNames[0] ].nickname;
        document.getElementById('playerOneId').innerHTML = players[ keyNames[0] ].id;
      }
      catch(err) {
        console.log('Red Player is still needed to start the game')
      }
      try {
        document.getElementById('lobby_2').innerHTML = players[ keyNames[1] ].nickname;
        document.getElementById('playerTwoId').innerHTML = players[ keyNames[1] ].id;
      }
      catch(err) {
        console.log('Blue Player is still needed to start the game')
      }
      try {
        document.getElementById('lobby_3').innerHTML = players[ keyNames[2] ].nickname;
        document.getElementById('playerThreeId').innerHTML = players[ keyNames[2] ].id;
      }
      catch(err) {
        console.log('Green Player is still needed to start the game')
      }
      try {
        document.getElementById('lobby_4').innerHTML = players[ keyNames[3] ].nickname;
        document.getElementById('playerFourId').innerHTML = players[ keyNames[3] ].id;
      }
      catch(err) {
        console.log('Yellow Player is still needed to start the game')
      }

      if (displayBugs) {
        console.log('Display bug info')
      } else {
        console.log('Don\'t display bug info')
        document.getElementById('debug-bug-info').classList.add('d-none')
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
            movement.tongue = true;
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
          case 32: // Tongue
            movement.tongue = false;
            break;
        }
      });

    socket.emit( 'new player', { nickname: getCookie("nickname") } );

    setInterval(function() {
      socket.emit('movement', movement);
      movement.score = false;
    }, 1000 / 60);


    var dots = window.setInterval( function() {
      var wait = document.getElementsByClassName("wait");

      for (i=0; i < 3; i++) {
        if ( wait[i].innerHTML.length > 2 ) 
          wait[i].innerHTML = "";
        else 
          wait[i].innerHTML += ".";
      }
      
    }, 600);


    var stats_1 = document.getElementById('stats_1');
    stats_1.innerHTML= "Waiting On Players<span class='wait'>.</span>";

    var stats_2 = document.getElementById('stats_2');
    stats_2.innerHTML= "Waiting On Player<span class='wait'>.</span>";

    var stats_3 = document.getElementById('stats_3');
    stats_3.innerHTML= "Waiting On Player<span class='wait'>.</span>";

    var stats_4 = document.getElementById('stats_4');
    stats_4.innerHTML= "Waiting On Player<span class='wait'>.</span>";

    var canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 800;

    var context = canvas.getContext('2d');

    function RandomBug() {
      return (
        Math.floor(Math.random() * 5)
      );
    }

    // x = 10000;

    // function gameTimer(duration, display) {
    //   var timer = duration, minutes, seconds;
    //     setInterval(function () {
    //         minutes = parseInt(timer / 60, 10)
    //         seconds = parseInt(timer % 60, 10);
    
    //         // Place a 0 back in quotes to float zeros.
    //         minutes = minutes < 10 ? "" + minutes : minutes;
    //         seconds = seconds < 10 ? "0" + seconds : seconds;
    
    //         display.textContent = minutes + ":" + seconds;
    
    //         if (--timer < 0) {
    //             timer = duration;
    //         }
    //     }, 1000);
    // }
      
    // window.onload = function () {
    //   var minutesInSeconds = 60 * 5,
    //       display = document.querySelector('#time_left');
    //   gameTimer(minutesInSeconds, display);
    // };

    // function scoreboardTimer(duration, display) {
    //   var timer = duration, minutes, seconds;
    //     setInterval(function () {
    //         minutes = parseInt(timer / 60, 10)
    //         seconds = parseInt(timer % 60, 10);
    
    //         // Place a 0 back in quotes to float zeros.
    //         minutes = minutes < 10 ? "" + minutes : minutes;
    //         seconds = seconds < 10 ? "0" + seconds : seconds;
    
    //         display.textContent = minutes + ":" + seconds;
    
    //         if (--timer < 0) {
    //             timer = duration;
    //         }
    //     }, 1000);
    // }

  //   window.onload = function () {
  //     var minutesInSeconds = 60 * 1,
  //         display = document.querySelector('#scoreboard-timer');
  //     scoreboardTimer(minutesInSeconds, display);
  // };

    socket.on('time-left', function(time) {
      console.log(time);
      document.getElementById('scoreboard-timer').innerHTML = time;

      if (time === 0) {
        // window.location.replace("/join.html");
        console.log("Time was 0")
        window.location.replace("../join.html");
      } 

    });

    socket.on('state', function(players, bugs, insectTrack, powerups, timer, powerups_schedule) {
      console.log(bugs);

      var keyNames = Object.keys(players);

      context.clearRect(0, 0, 800, 800);

      // Red Zone
      context.fillStyle='rgba(255,105,97,.5)'; 
      context.fillRect(0, 0, 400, 400);
  
      // IDK
      context.fillStyle='rgba(173,216,230,.5)';
      context.fillRect(400, 0, 400, 400);
  
      // IDK
      context.fillStyle='rgba(144,238,144,.5)'; 
      context.fillRect(0, 400, 400, 400);
  
      // IDK
      context.fillStyle='rgba(239,239,143,.5)'; 
      context.fillRect(400, 400, 400, 400);

      // Random Powerup Zone
      context.fillStyle='rgba(0, 0, 0, .5)'; 
      context.fillRect(200, 200, 400, 400);

      // if (powerups.active.id === 4 ) {

      //   try {
      //     if (players[keyNames[0]].powerup === 4) {
      //       context.fillStyle='rgba(255,105,97,.5)'; 
      //       context.fillRect(0, 0, 450, 450);
      //     } else if (players[keyNames[1]].powerup === 4) {
      //       context.fillStyle='rgba(173,216,230,.5)';
      //       context.fillRect(400, 0, 350, 450);
      //     } else if (players[keyNames[2]].powerup === 4) {
      //       context.fillStyle='rgba(144,238,144,.5)'; 
      //       context.fillRect(0, 400, 450, 350);
      //     } else if (players[keyNames[3]].powerup === 4) {
      //       context.fillStyle='rgba(239,239,143,.5)'; 
      //       context.fillRect(400, 400, 350, 350);
      //     }
      //   }
      //   catch(err) {
          
      //   }
        
      // }

      drawRotated(0, 0, 320, "Red");
      drawRotated(800 - 160, 0, 30, "Blue");
      drawRotated(0, 800 - 160, 225, "Green");
      drawRotated(800 - 160, 800 - 160, 145, "Yellow");

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

      for (var id in players) {
        var player = players[id];

        var playerSize = 40;
        var draw = 'square';

        switch(player.powerup) {
          case 'Tough Guy':
            var playerSize = 60;
            context.font = "10px Arial";
            context.fillStyle = "#000";
            context.textAlign = "center"; 
            context.fillText('Tough Guy', player.x + playerSize / 2, player.y + 70);
            break;
          case 'Muddy Water':
            context.font = "10px Arial";
            context.fillStyle = "#000";
            context.textAlign = "center"; 
            context.fillText('Muddy Water', player.x + playerSize / 2, player.y + 55);
            player.color = "#964"
            break;
          case 'Stinky Frog':
              context.font = "10px Arial";
              context.fillStyle = "#000";
              context.textAlign = "center"; 
              context.fillText('Stinky Frog', player.x + playerSize / 2, player.y + 55);

              player.color = "#bbb"

              var img = document.getElementById("stink");
              context.drawImage(img, player.x, player.y - playerSize, 40, 40);
              break;
          case 4: 
            var draw = 'circle';
            context.font = "10px Arial";
            context.fillStyle = "#000";
            context.textAlign = "center"; 
            context.fillText('Sphere', player.x + playerSize / 2, player.y + 55);
            break;
        }

        // Visual Perk Over rides
        // if (player.powerup === 0 ) {
        //   var playerSize = 60;
        //   context.font = "10px Arial";
        //   context.fillStyle = "#000";
        //   context.fillText('Tough Guy', player.x, player.y + 90);
        // }

        // if (player.powerup === 1) {
        //   console.log('Player detected with Muddy Water')
        //   context.font = "10px Arial";
        //   context.fillStyle = "#000";
        //   context.fillText('Muddy Water', player.x, player.y + 50);
        // }

        // if (player.powerup === 4) {
        //   var draw = 'circle';
        //   context.font = "10px Arial";
        //   context.fillStyle = "#000";
        //   context.fillText('Sphere', player.x, player.y + 50);
        // }

        // Circle (Original)
        context.beginPath();
        context.fillStyle = player.color;

        if ( draw === 'square' ) {
          context.fillRect(player.x, player.y, playerSize, playerSize);
        } else if ( draw === 'circle' ) {
          context.save();
          // Move to the center of the canvas
          context.translate(playerSize / 2,playerSize / 2);
          context.arc(player.x, player.y, 25, 0, 2 * Math.PI);
          context.fill();
          context.restore();
        }

        // Left Eye
        context.beginPath();
        context.fillStyle = "#000";
        context.fillRect(player.x + 2.5, player.y + 2.5, 10, 10);
        context.fill();

        // Right Eye
        context.beginPath();
        context.fillStyle = "#000";
        context.fillRect(player.x + playerSize - 12.5, player.y + 2.5, 10, 10);
        context.fill();

        // Mouth
        context.beginPath();
        context.fillStyle = "#000";
        context.fillRect(player.x + 5, player.y + 20, playerSize - 10, playerSize / 4);
        context.fill();

        // Tongue
        context.beginPath();
        context.fillStyle = "#FFC0CB";

        if (player.tongue == false) {
          context.fillRect(player.x + 10, player.y + (playerSize / 4 + 15), playerSize- 20 , playerSize / 6);
        } else {
          context.fillRect(player.x + 10, player.y + (playerSize / 4 + 15), playerSize- 20, playerSize / 2);
        }
        
        context.fill();

        context.font = "10px Arial";
        context.fillStyle = "#000";
        context.textAlign = "center"; 
        // var playerNickname = player.nickname;
        context.fillText(player.nickname, player.x + (playerSize /2), player.y - 5);

      }

      if (powerups.active.active === true && powerups.active.id === 5) {
        // Health is disabled for now...
        // var img = document.getElementById( "health" );
        // context.drawImage(img, powerups.active.x-20, 400-20, 40, 40);
      } else if (powerups.active.active === true && powerups.active.id != 5) {
        var img = document.getElementById( "powerup-1" );
        context.drawImage(img, powerups.active.x-20, powerups.active.y-20, 40, 40);
      };

      // if (powerups.active.active === true) {
      //   var img = document.getElementById( "powerup" );
      //   context.drawImage(img, 400-20, 400-20, 40, 40);
      // };

      // context.font = "10px Arial";
      // context.fillStyle = "#000";
      // context.fillText( "Tough Guy", 305, 275 - 5 );
      // var img = document.getElementById( "powerup-1" );
      // context.drawImage(img, 305, 275, 50, 50);

      for (i = 0; i < bugs.length; i++) {
        var img = document.getElementById( "bug-" + bugs[i].bugType );
        context.drawImage(img, bugs[i].x, bugs[i].y, 50, 50);
        // var player = i;
        // document.getElementById('bug-' + (i + 1) +'-info').innerHTML = 'X:' + bugs[i].x + ' Y:' + bugs[i].y + ' Holder:' + bugs[i].heldBy + ' Pad:' + bugs[i].pad;
      }

      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      // Place a 0 back in quotes to float zeros.
      minutes = minutes < 10 ? "" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      document.getElementById('time_left').innerHTML = minutes + ":" + seconds;

      document.getElementById('powerup_next').innerHTML = (`${timer - powerups.powerup_next}`);

      // If game time is 0 seconds then game is over and we can display the leaderboard now
      if (timer < 0) {
        $('.scoreboard-container').removeClass('d-none');
      }

      // Logging bugs info to debug info
      document.getElementById('bug-info').innerHTML = '';
      bugs.forEach( (bug, i) => {
        var bugDiv = document.getElementById("bug-info");
        bugDiv.appendChild(document.createTextNode(`Bug ${i + 1} | X: ${bug.x} Y: ${bug.y} | Holder: ${bug.heldBy} | Pad: ${bug.pad}`));
        bugDiv.appendChild(document.createElement("br"));
      });

      // Logging powerups info to debug info
      document.getElementById('powerup-info').innerHTML = '';
      powerups_schedule.forEach( (powerup, i) => {
        var powerupDiv = document.getElementById("powerup-info");
        powerupDiv.appendChild(document.createTextNode(`Powerup ${i + 1} | ${powerup.time}s | Perk: ${powerup.id}`));
        powerupDiv.appendChild(document.createElement("br"));
      });

      // var array = powerups_schedule;
      // console.log( findClosest(timer) );
      
      // Closset powerup time
      // function findClosest (value) {
      //   // By default that will be a big number
      //   var closestValue = Infinity;
      //   // We will store the index of the element
      //   var closestIndex = -1;
      //   for (var i = 0; i < array.length; ++i) {
      //     var diff = Math.abs(array[i].time - value);
      //     if (diff < closestValue) {
      //       closestValue = diff;
      //       closestIndex = i;
      //     }
      //   }
      //   return closestIndex;
      // }
      
      for (i=0; i < insectTrack.length; i++) {

        document.getElementById('list-1').innerHTML = '';
        for (j=0; j < insectTrack[0].length; j++) {
          if (j != undefined || null) {
            document.getElementById('list-1').innerHTML = document.getElementById('list-1').innerHTML.concat(' ' + insectTrack[0][j]);
            // document.getElementById('list-1').innerHTML = document.getElementById('list-1').innerHTML.concat(' ' + '<img src="assets/img/bug-' + insectTrack[0][j] + '.png" width="20">');
          }
        }

        document.getElementById('list-2').innerHTML = '';
        for (j=0; j < insectTrack[1].length; j++) {
          if (j != undefined || null) {
            document.getElementById('list-2').innerHTML = document.getElementById('list-2').innerHTML.concat(' ' + insectTrack[1][j]);
            // document.getElementById('list-2').innerHTML = document.getElementById('list-2').innerHTML.concat(' ' + '<img src="assets/img/bug-' + insectTrack[1][j] + '.png" width="20">');
          }
        }

        document.getElementById('list-3').innerHTML = '';
        for (j=0; j < insectTrack[2].length; j++) {
          if (j != undefined || null) {
            document.getElementById('list-3').innerHTML = document.getElementById('list-3').innerHTML.concat(' ' + insectTrack[2][j]);
            // document.getElementById('list-3').innerHTML = document.getElementById('list-3').innerHTML.concat(' ' + '<img src="assets/img/bug-' + insectTrack[2][j] + '.png" width="20">');
          }
        }

        document.getElementById('list-4').innerHTML = '';
        for (j=0; j < insectTrack[3].length; j++) {
          if (j != undefined || null) {
            document.getElementById('list-4').innerHTML = document.getElementById('list-4').innerHTML.concat(' ' + insectTrack[3][j]);
            // document.getElementById('list-4').innerHTML = document.getElementById('list-4').innerHTML.concat(' ' + '<img src="assets/img/bug-' + insectTrack[3][j] + '.png" width="20">');
          }
        }
        
      }

      // document.getElementById('list-1').innerHTML= '<img id="bug-1" src="assets/img/bug-1.png" width="20">';

      try {       
        stats_1.innerHTML= 'P: ' + players[ keyNames[0] ].powerup +' X:' + players[ keyNames[0] ].x + ' Y: ' + players[ keyNames[0] ].y + ' R:' + players[ keyNames[0] ].r + ' Score:' + players[ keyNames[0] ].score +  ' Hold:' + players[ keyNames[0] ].canHold + '<br>Zone:' + players[ keyNames[0] ].zone + ' Holding:' + players[ keyNames[0] ].holding + ' Tongue:' + players[ keyNames[0] ].tongue;
        document.getElementById('redHealth').innerHTML = players[ keyNames[0] ].health;
        stats_2.innerHTML= 'X:' + players[ keyNames[1] ].x + ' Y: ' + players[ keyNames[1] ].y + ' R:' + players[ keyNames[1] ].r + ' Score:' + players[ keyNames[1] ].score + '<br>Zone:' + players[ keyNames[1] ].zone + ' Holding:' + players[ keyNames[1] ].holding;
        document.getElementById('blueHealth').innerHTML = players[ keyNames[1] ].health;
        stats_3.innerHTML= 'X:' + players[ keyNames[2] ].x + ' Y: ' + players[ keyNames[2] ].y + ' R:' + players[ keyNames[2] ].r + ' Score:' + players[ keyNames[2] ].score + '<br>Zone:' + players[ keyNames[2] ].zone + ' Holding:' + players[ keyNames[2] ].holding;
        document.getElementById('greenHealth').innerHTML = players[ keyNames[2] ].health;
        stats_4.innerHTML= 'X:' + players[ keyNames[3] ].x + ' Y: ' + players[ keyNames[3] ].y + ' R:' + players[ keyNames[3] ].r + ' Score:' + players[ keyNames[3] ].score + '<br>Zone:' + players[ keyNames[3] ].zone + ' Holding:' + players[ keyNames[3] ].holding;
        document.getElementById('yellowHealth').innerHTML = players[ keyNames[3] ].health;
      }
      catch(err) {
        // console.log("Lobby not full yet");
      }

    });
};