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
    lastPos: {x: 0, y: 0},
    secondaryPos: {x: 0, y: 0},
    secondaryVel: {x: 0, y: 0}
  };
  Object.assign(state.lastMouse, mouse);

  window.requestAnimationFrame(render.bind(render, state, mouse, screenElement.getContext("2d"), backElement.getContext("2d")));
}

function render(state, mouse, screen, back) {

  state.secondaryVel.x += 0.05*(mouse.x - state.secondaryPos.x) - 0.01 * state.secondaryVel.x;
  state.secondaryVel.y += 0.05*(mouse.y - state.secondaryPos.y) - 0.01 * state.secondaryVel.y;
  state.secondaryPos.x += state.secondaryVel.x;
  state.secondaryPos.y += state.secondaryVel.y;

  //  screen.clearRect(0, 0, screen.width, screen.height);
  back.globalAlpha = 0.1;
  back.globalCompositeOperation='destination-out';
  back.fillRect(0, 0, back.canvas.width, back.canvas.height)

  back.globalAlpha = 1;
  back.globalCompositeOperation='source-over';
  back.lineCap = "round";
  back.lineWidth = 5;
  back.beginPath();
  back.moveTo(state.lastPos.x, state.lastPos.y);
  back.lineTo(state.secondaryPos.x, state.secondaryPos.y);
  //back.arc(mouse.x, mouse.y, 5, 0, 2*Math.PI);
  back.stroke();

  screen.fillStyle = "#fff";
  screen.fillRect(0, 0, screen.canvas.width, screen.canvas.height)
  screen.drawImage(back.canvas, 0, 0)

  screen.fillStyle = "#000";
  screen.beginPath();
  screen.arc(mouse.x, mouse.y, 5, 0, 2*Math.PI);
  screen.fill();

  screen.fillStyle = "#f0f";
  screen.beginPath();
  screen.arc(state.secondaryPos.x, state.secondaryPos.y, 5, 0, 2*Math.PI);
  screen.fill();

  // mouse just released
  /* if (state.lastMouse.down = true && !mouse.down) {
    state.pointer
    state.releasePoint = 
  } */


  //back.clearRect(0, 0, back.canvas.width, back.canvas.)

  Object.assign(state.lastMouse, mouse)
  Object.assign(state.lastPos, state.secondaryPos)
  argumentsArray = Array.from(arguments);
  window.requestAnimationFrame(function () { render.apply(render, argumentsArray); });
}

document.addEventListener("DOMContentLoaded", init);