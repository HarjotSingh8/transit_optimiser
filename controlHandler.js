async function keyPressed() {
  if (keyCode === UP_ARROW) {
    //mapMove.y += 1;
    mapOffset.y += 1;
    simulation.change_view({ mapOffset: { x: 0, y: 1 } });
  }
  if (keyCode === DOWN_ARROW) {
    //mapMove.y -= 1;
    mapOffset.y -= 1;
    simulation.change_view({ mapOffset: { x: 0, y: -1 } });
  }
  if (keyCode === LEFT_ARROW) {
    //mapMove.x = 1;
    mapOffset.x += 1;
    simulation.change_view({ mapOffset: { x: 1, y: 0 } });
  }
  if (keyCode === RIGHT_ARROW) {
    //mapMove.x = -1;
    mapOffset.x -= 1;
    simulation.change_view({ mapOffset: { x: -1, y: 0 } });
  }
  if (key === "a") {
    mapZoom *= 2;
    simulation.change_view({ multiplier: 2 });
  }
  if (key === "z") {
    mapZoom /= 2;
    simulation.change_view({ multiplier: 0.5 });
    //updateZoom();
  }
}
/*
var prev_mouseX;
var prev_mousey;
var clicked = true;
function mouseClicked() {
  prev_mouseX = mouseX;
  prev_mousey = mouseY;
  clicked = true;
}

function mouseDragged() {
  if (!clicked)
    simulation.change_view({
      mapOffset: { x: prev_mouseX - mouseX, y: prev_mousey - mouseY },
    });
  prev_mouseX = mouseX;
  prev_mousey = mouseY;
  clicked = false;
}
*/
