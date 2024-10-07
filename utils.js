
function draw_grid(gridSizeX, gridSizeY, squareSize)
{

  stroke(150);
  strokeWeight(1);

  // Dibuja la retícula
  for (let x = -gridSizeX / 2; x <= gridSizeX / 2; x += squareSize) {
    line(x, -gridSizeY / 2, 0,  x, gridSizeY / 2, 0); // Líneas verticales
  }

  for (let y = -gridSizeY / 2; y <= gridSizeY / 2; y += squareSize) {
    line(-gridSizeX / 2, y, 0, gridSizeX / 2, y, 0); // Líneas horizontales
  }

  // Ejes de coordenadas
  strokeWeight(2);
  stroke(255, 0, 0); // Eje X en rojo
  line(-gridSizeX / 2, 0, 0, gridSizeX / 2, 0, 0);

  stroke(0, 255, 0); // Eje Y en verde
  line(0, -gridSizeY / 2, 0, 0, gridSizeY / 2, 0);

  stroke(0, 0, 255); // Eje Z en azul
  line(0, 0, -100, 0, 0, 100);

}

function draw_reference_system(scale)
{
  // use "scale" if passed in, otherwise
  // default to 100
  scale = scale || 100;


  push();
  stroke(  255,40, 40);
  drawArrow(0, 0, 0, scale, 2, 0, 0, 90)
  stroke(  40, 255, 40);
  drawArrow(0, 0, 0, scale, 2, 180, 0, 0)
  stroke(  40, 40, 255);
  drawArrow(0, 0, 0, scale, 2, -90, 0, 0)
  pop();
}

function draw_left_reference_system(scale)
{
  // use "scale" if passed in, otherwise
  // default to 100
  scale = scale || 100;


  push();
  stroke(  255,40, 40);
  drawArrow(0, 0, 0, scale, 2, 0, 0, 90)
  stroke(  40, 255, 40);
  drawArrow(0, 0, 0, scale, 2, 180, 0, 0)
  stroke(  40, 40, 255);
  drawArrow(0, 0, 0, scale, 2, 90, 0, 0)
  pop();
}


function drawArrow(x, y, z, size, radio,  roll, pitch, yaw) {

  push();

  rotateX(roll);
  rotateY(pitch);
  rotateZ(yaw);

  translate(x, y-size/2, z);
  cylinder(radio, size);

  translate(0, -(size/2+ radio*3), 0);
  rotateZ(180);
  cone(radio*4, radio*8);

  pop();
}

function setup_view()
{
  translate(0,200,-1000);
  rotateX(45);
  rotateZ(45);

    // Enable orbiting with the mouse.
  orbitControl();

  background(230)

}
