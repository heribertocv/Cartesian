let w = 600;
let h = 400;
let diameter = 20;

let theCartesianRobot;
let thePrinter3D;

function setup() {

  createCanvas( w+100, h+100, WEBGL);
  angleMode(DEGREES)

  theCartesianRobot = new CartesianRobot( w, h, diameter);
  createControls();

  //thePrinter3D = new Printer3D(w,h,diameter,diameter);
  //setup_printer3D();

}

function draw() {

  setup_view();

  draw_grid(800,600,50);
  draw_reference_system();


  direct_cinematic();

  //test_references_system();

  //thePrinter3D.print_and_move();
  //thePrinter3D.show();



}

function direct_cinematic(){

  theCartesianRobot.set_params( sliderX.value(),
                                sliderY.value(),
                                sliderZ.value())
  theCartesianRobot.show();

  updateControls();
}

function setup_printer3D()
{
  square_base = [ {axis:0, d:250, p:true}, {axis:1, d:300, p:true},
             {axis:0, d:-250, p:true}, {axis:1, d:-300+diameter, p:true} ];

  to_next_level = [ {axis:2, d:-diameter, p:false}, {axis:1, d:-diameter, p:false} ];

  trajectory = square_base;
  trajectory = trajectory.concat( to_next_level );

  for( let ii=0; ii< 3; ii+=1){
    trajectory = trajectory.concat( square_base );
    trajectory = trajectory.concat( to_next_level );
  }

  thePrinter3D.set_trajectory( trajectory );
}


function test_references_system(){
  // current location for reference system
  stroke('red');
  fill('lime')
  box(20)

  // get effector location wrt cartesian robot's SR
  effector_wrt_local =  theCartesianRobot.pose_effector_wrt_robot();
  //print(`effector_wrt_local, ${effector_wrt_local.x}, ${effector_wrt_local.y}, ${effector_wrt_local.z}`);

  // plot the E_wrt_Local_SR_CR at Global SR
  push();
  stroke('red');
  fill('orange')
  translate( effector_wrt_local.x, effector_wrt_local.y, effector_wrt_local.z )
  box(20);
  pop();

  effector_wrt_global =  theCartesianRobot.pose_effector_wrt_global_world();
  stroke('silver');
  fill('yellow')
  translate( effector_wrt_global.x, effector_wrt_global.y, effector_wrt_global.z -10 )
  box(50,50,20);


}

function updateControls(){
  valueX.html('<strong>X: </strong> <em>' + sliderX.value() + '</em>');
  valueY.html('<strong>Y: </strong> <em>' + sliderY.value() + '</em>');
  valueZ.html('<strong>Z: </strong> <em>' + sliderZ.value() + '</em>');
}

function createControls(){

  theMechanism = thePrinter3D || theCartesianRobot;

  sliderX = createSlider( theMechanism.get_minX(),
                          theMechanism.get_maxX(),
                         0, 10);
  sliderX.position(70, h+100);
  sliderX.size(200);

  sliderY = createSlider( theMechanism.get_minY(),
                          theMechanism.get_maxY(),
                         0, 10);
  sliderY.position(70, h+120);
  sliderY.size(200);

  sliderZ = createSlider( theMechanism.get_minZ(),
                          theMechanism.get_maxZ(),
                         0, 10);
  sliderZ.position(70, h+140);
  sliderZ.size(200);

  valueX = createP('X: '); // Valor inicial
  valueX.position(20, h+85);

  valueY = createP('Y: '); // Valor inicial
  valueY.position(20, h+105);

  valueZ = createP('Z: '); // Valor inicial
  valueZ.position(20, h+125);

  label = createP('<strong>Cartesian Robot\'s Parameters <br> Direct Cinematic </strong>');
  label.position(50, h+150);

}
