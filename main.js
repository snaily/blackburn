function init() {
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

  state = {
    lastMouse: {},
    lastPos: {x: screenElement.width/2, y: screenElement.height/2},
    //origin: {x: screenElement.width/2, y: screenElement.height/2},
    primaryPos: {x: screenElement.width/2, y: screenElement.height/2},
    primaryVel: {x: 0, y: 0},
    secondaryPos: {x: screenElement.width/2, y: screenElement.height/2},
    secondaryVel: {x: 0, y: 0},
    steps: 10
  };
  Object.assign(state.lastMouse, mouse);

  window.requestAnimationFrame(render.bind(render, state, mouse, screenElement.getContext("2d"), backElement.getContext("2d")));
}

function step(state, mouse, origin, dt) {
  if (mouse.down) {
    state.primaryVel.x += dt*0.25*(mouse.x - state.primaryPos.x)
    state.primaryVel.y += dt*0.25*(mouse.y - state.primaryPos.y);
    state.primaryVel.x -= dt*0.6 * state.primaryVel.x;
    state.primaryVel.y -= dt*0.6 * state.primaryVel.y;
  } else {
    state.primaryVel.x += dt*0.02*(origin.x - state.primaryPos.x)
    state.primaryVel.y += dt*0.02*(origin.y - state.primaryPos.y);
    state.primaryVel.x += dt*0.05*(state.secondaryPos.x - state.primaryPos.x)
    state.primaryVel.y += dt*0.05*(state.secondaryPos.y - state.primaryPos.y);
    state.primaryVel.x -= dt*0.0001 * state.primaryVel.x;
    state.primaryVel.y -= dt*0.0001 * state.primaryVel.y; 
  }

  state.secondaryVel.x += dt*0.05*(state.primaryPos.x - state.secondaryPos.x)
  state.secondaryVel.y += dt*0.05*(state.primaryPos.y - state.secondaryPos.y);
  state.secondaryVel.x -= dt*0.0001 * state.secondaryVel.x;
  state.secondaryVel.y -= dt*0.0001 * state.secondaryVel.y;


  state.primaryPos.x += dt*state.primaryVel.x;
  state.primaryPos.y += dt*state.primaryVel.y;
  state.secondaryPos.x += dt*state.secondaryVel.x;
  state.secondaryPos.y += dt*state.secondaryVel.y;

  if (mouse.down) {
    if (!state.lastMouse.down) {
      state.primaryVel = {x: 0, y: 0};
      state.secondaryVel = {x: 0, y: 0};
      state.primaryPos = {x: mouse.x, y: mouse.y};
      state.primaryPos = {x: mouse.x, y: mouse.y};
      state.secondaryPos = {x: mouse.x, y: mouse.y};
      state.secondaryPos = {x: mouse.x, y: mouse.y};
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

  for (var i = 0; i < state.steps; i++) {
    step(state, mouse, {x: screen.canvas.width/2, y: screen.canvas.height/2}, 0.1);

    if (!mouse.down) {
      back.lineCap = "round";
      back.lineWidth = 1;
      back.strokeStyle = "rgba(0, 0, 0, 0.2)"
      back.beginPath();
      back.moveTo(state.lastPos.x, state.lastPos.y);
      back.lineTo(state.primaryPos.x, state.primaryPos.y);
      //back.arc(mouse.x, mouse.y, 5, 0, 2*Math.PI);
      back.stroke();
    }

    Object.assign(state.lastPos, state.primaryPos)
  }

  /*back.globalAlpha = 0.1;
  back.globalCompositeOperation='destination-out';
  back.fillRect(0, 0, back.canvas.width, back.canvas.height)
  back.globalAlpha = 1.0;
  back.globalCompositeOperation='source-over';*/

  screen.clearRect(0, 0, screen.canvas.width, screen.canvas.height)

  if (mouse.down) {
    screen.fillStyle = "#000";
    screen.beginPath();
    screen.arc(mouse.x, mouse.y, 5, 0, 2*Math.PI);
    screen.fill();

    screen.fillStyle = "#f0f";
    screen.beginPath();
    screen.arc(state.secondaryPos.x, state.secondaryPos.y, 5, 0, 2*Math.PI);
    screen.fill();

    screen.fillStyle = "#0ff";
    screen.beginPath();
    screen.arc(state.primaryPos.x, state.primaryPos.y, 5, 0, 2*Math.PI);
    screen.fill();
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
  argumentsArray = Array.from(arguments);
  window.requestAnimationFrame(function () { render.apply(render, argumentsArray); });
}

document.addEventListener("DOMContentLoaded", init);