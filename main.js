function init(pendulumCount) {
  screenElement = document.getElementById("screen");
  screenElement.width = document.body.clientWidth;
  screenElement.height = document.body.clientHeight;

  backElement = document.createElement("canvas");
  backElement.width = document.body.clientWidth;
  backElement.height = document.body.clientHeight;

  mouse = {x: 0, y: 0, down: false};
  document.addEventListener("mousemove", function(event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
  });
  document.addEventListener("mousedown", function(event) {
    mouse.down = true;
  });
  document.addEventListener("mouseup", function(event) {
    mouse.down = false;
  });

  pendulums = [];
  for (var i = 0; i < pendulumCount; i++) {
    pendulums.push({
      pos: {x: screenElement.width/2, y: screenElement.height/2},
      vel: {x: 0, y: 0}
    });
  }

  state = {
    lastMouse: {},
    lastPos: {x: screenElement.width/2, y: screenElement.height/2},
    //origin: {x: screenElement.width/2, y: screenElement.height/2},
    pendulums: pendulums,
    steps: 10
  };
  Object.assign(state.lastMouse, mouse);

  window.requestAnimationFrame(render.bind(render, state, mouse, screenElement.getContext("2d"), backElement.getContext("2d")));
}

function step(state, mouse, origin, dt) {
  for (var i = 0; i < state.pendulums.length; i++) {
    if (i == 0) {
      if (mouse.down) {
        state.pendulums[0].vel.x += dt*0.25*(mouse.x - state.pendulums[0].pos.x);
        state.pendulums[0].vel.y += dt*0.25*(mouse.y - state.pendulums[0].pos.y);
        state.pendulums[0].vel.x -= dt*0.6 * state.pendulums[0].vel.x;
        state.pendulums[0].vel.y -= dt*0.6 * state.pendulums[0].vel.y;
      } else {
        state.pendulums[0].vel.x += dt*0.01*(origin.x - state.pendulums[0].pos.x);
        state.pendulums[0].vel.y += dt*0.01*(origin.y - state.pendulums[0].pos.y);
      }
    } else {
      state.pendulums[i].vel.x += dt*0.05*(state.pendulums[i-1].pos.x - state.pendulums[i].pos.x)/i;
      state.pendulums[i].vel.y += dt*0.05*(state.pendulums[i-1].pos.y - state.pendulums[i].pos.y)/i;
    }
    if (i < state.pendulums.length - 1) {
      // If we're dragging with the mouse, don't pull it to the next in the chain
      if (i != 0 || !mouse.down) {
        state.pendulums[i].vel.x += dt*0.05*(state.pendulums[i+1].pos.x - state.pendulums[i].pos.x)/(i+1);
        state.pendulums[i].vel.y += dt*0.05*(state.pendulums[i+1].pos.y - state.pendulums[i].pos.y)/(i+1);
      }
    }
    // Damping
    if (i == 0 && mouse.down) {
      state.pendulums[i].vel.x -= dt*0.6 * state.pendulums[i].vel.x;
      state.pendulums[i].vel.y -= dt*0.6 * state.pendulums[i].vel.y;
    } else {
      state.pendulums[i].vel.x -= dt*0.0001 * state.pendulums[i].vel.x;
      state.pendulums[i].vel.y -= dt*0.0001 * state.pendulums[i].vel.y;
    }
  }


  for (var i = 0; i < state.pendulums.length; i++) {
    state.pendulums[i].pos.x += dt*state.pendulums[i].vel.x
    state.pendulums[i].pos.y += dt*state.pendulums[i].vel.y
  }

  if (mouse.down) {
    if (!state.lastMouse.down) {
      for (var i = 0; i < state.pendulums.length; i++) {
        state.pendulums[i].pos.x = mouse.x;
        state.pendulums[i].pos.y = mouse.y;
        state.pendulums[i].vel.x = 0;
        state.pendulums[i].vel.y = 0;
      }
    }
  }
}

function render(state, mouse, screen, back) {
  if (mouse.down) {
    if (!state.lastMouse.down) {
      back.clearRect(0, 0, back.canvas.width, back.canvas.height);
      state.steps = 10;
    }
  } else {
    if (state.steps < 1000) {
      state.steps *= 1.02;
    }
  }

 var origin = {x: screen.canvas.width/2, y: screen.canvas.height/2};

  for (var i = 0; i < state.steps; i++) {
    step(state, mouse, origin, 0.1);

    if (!mouse.down) {
      back.lineCap = "round";
      back.lineWidth = 1;
      back.strokeStyle = "rgba(0, 0, 0, 0.2)"
      back.beginPath();
      back.moveTo(state.lastPos.x, state.lastPos.y);
      back.lineTo(state.pendulums[state.pendulums.length-1].pos.x, state.pendulums[state.pendulums.length-1].pos.y);
      //back.arc(mouse.x, mouse.y, 5, 0, 2*Math.PI);
      back.stroke();
    }

    Object.assign(state.lastPos, state.pendulums[state.pendulums.length-1].pos)
  }

  /*back.globalAlpha = 0.1;
  back.globalCompositeOperation='destination-out';
  back.fillRect(0, 0, back.canvas.width, back.canvas.height)
  back.globalAlpha = 1.0;
  back.globalCompositeOperation='source-over';*/

  screen.clearRect(0, 0, screen.canvas.width, screen.canvas.height)

  if (mouse.down) {
    /*screen.fillStyle = "#000";
    screen.beginPath();
    screen.arc(mouse.x, mouse.y, 5, 0, 2*Math.PI);
    screen.fill();*/

    for (var i = 0; i < state.pendulums.length; i++) {
      screen.fillStyle = "#000";
      screen.beginPath();
      screen.arc(state.pendulums[i].pos.x, state.pendulums[i].pos.y, 5, 0, 2*Math.PI);
      screen.stroke();
    }
  } else {
    screen.drawImage(back.canvas, 0, 0)
  }


  // mouse just released
  /* if (state.lastMouse.down = true && !mouse.down) {
    state.pointer
    state.releasePoint = 
  } */


  //back.clearRect(0, 0, back.canvas.width, back.canvas.)

  Object.assign(state.lastMouse, mouse)
  var argumentsArray = Array.from(arguments);
  window.requestAnimationFrame(function () { render.apply(render, argumentsArray); });
}

document.addEventListener("DOMContentLoaded", function() { init(location.hash.slice(1) || 3); } );
window.addEventListener("hashchange", function() { location.reload(true); });