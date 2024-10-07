
class CartesianRobot{
  constructor(w, h, diameter) {
    this.w = w;
    this.h = h;
    this.diameter = diameter;

    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  set_params( X, Y ,Z ){
    this.x = X;
    this.y = Y;
    this.z = Z;
  }

  pose_effector_wrt_robot( ){
    return {x:this.x, y:this.y, z: this.z };
  }

  pose_effector_wrt_global_world( ){
    // TODO: COMPUTE using Denavit-Hartenberg!!!
    //
    //     THAT´s YOUR HOMEWORK
    //     WITH MATRIZ ALGEBRA
    //

    let x_global = this.x-this.w/2+this.diameter*2;
    let y_global = this.y-this.w/2+this.diameter*3.5;
    let z_global = -this.z+this.h-this.diameter*3;

    return {x:x_global, y:y_global, z: z_global };
  }

  home_wrt_global_world(){
    let x_global = -this.w/2+this.diameter*2;
    let y_global = -this.w/2+this.diameter*3.5;
    let z_global = this.h-this.diameter*3;

    return {x:x_global, y:y_global, z: z_global };
  }

  set_X(X){
    this.x = X; }

  set_Y(Y){
    this.y = Y; }

  set_Z(Z){
    this.z = Z; }

  show( X, Y, Z){
    this.x = X || this.x;
    this.y = Y || this.y;
    this.z = Z || this.z;

    push();

    this.draw_supports();

    translate(-this.w/2+diameter*1.5,
              -this.w/2+diameter*1.5,
               this.h);

    draw_left_reference_system();

    this.draw_arm_Y( this.y );
    this.draw_arm_X( this.x );
    this.draw_arm_Z( this.z );

    pop();
  }

  get_minX(){
    return 0;
  }

  get_maxX(){
    return w-diameter*4;
  }

  get_minY(){
    return 0;
  }

  get_maxY(){
    return w-diameter*3;
  }

  get_minZ(){
    return 0;
  }

  get_maxZ(){
    return h-diameter*3;
  }

  draw_arm_Z(Z){
    //draw_reference_system(50);

    translate(0,0,-Z);

    push()

    translate(0, 0, this.h/2-this.diameter*1.5);

    stroke(0, 0, 255);
    fill(120, 120, 255,164);

    box(this.diameter, this.diameter, this.h+this.diameter*3);

    pop();

  }

  draw_arm_X(X){
    translate(X+diameter*0.5, this.diameter*2, 0);
    //draw_reference_system();
    push();

    stroke(250, 0,0);
    fill(255, 120, 120,164);

    translate(0,-this.diameter,0);
    box(this.diameter*2, this.diameter*5, this.diameter*2);
    translate(0, this.diameter, 0);

    //draw_reference_system(50);

    pop();
  }

  draw_arm_Y(Y){

    translate(0, Y, 0);

    push()

    translate(this.w/2-diameter*1.5, 0, 0);

    stroke(0,250, 0);

    fill(120, 255,120,250);
    box(this.w-2*this.diameter, this.diameter,  this.diameter);

    fill(120, 255, 120,164);
    translate(this.w/2, 0, 0);
    box(this.diameter*2);

    translate(-this.w, 0, 0);
    box(this.diameter*2);

    pop()
  }

  draw_supports(){
    push();

    translate(this.w/2,0,0);
    //draw_reference_system(scale=50);
    this.draw_lateral_support(this.w, this.h, this.diameter);

    translate(-this.w, 0, 0);
    //draw_reference_system(scale=50);
    this.draw_lateral_support( this.w, this.h, this.diameter);

    translate(0,0,0);

    pop();

  }

  draw_lateral_support(){
    push();

    stroke(100);
    fill(180,200);

    translate(0, this.w/2, this.h/2);
    box(this.diameter,this.diameter,this.h);
    //draw_reference_system(30);

    translate(0, -(this.w/2), this.h/2);
    rotateX(90);
    box(this.diameter, this.diameter, this.w+this.diameter);
    //draw_reference_system(30);

    translate(0, -this.h/2,  this.w/2);
    rotateX(90);
    box(this.diameter, this.diameter, this.h);
    //draw_reference_system(30);

    pop();

  }

}


class Printer3D extends CartesianRobot{

  constructor(w, h, diameter, resolution) {
    super(w, h, diameter)

    this.stepSize = 10;
    this.step = this.stepSize;
    this.resolution = resolution;

    this.object_printed = [];
    this.last_printed = {};

    // goto initial pose to print
    this.target = {x:0, y:0, z: h-diameter*3-resolution, p:false}

    this.trajectory = [ ];

  }

  /*
    trajectory is a array of single moves at some direction denoted by:
      0,1,2 ---> X, Y, Z and
      d     ---> displacemente cells at direction
                 if d<0 move at reverse direction
     by example:
           [ {axis: 0, 10}, {axis: 1, 10}, {axis: 0, -5} ]
       denote:
             increment over x-axis 10 cell units then
             increment over y-axis 5  cell units then
             decrement over x-axis -5 cell units
      the pattern move is:
            **********
                     *
                     *
                     *
                     *
                ******
  */
  set_trajectory( trajectory ){

    for( let ii=0; ii<trajectory.length; ii+=1 )
      this.trajectory.push( trajectory[ii] );

    this.trajectory.reverse();
  }

  print_and_move(){

    this.next_move();

    // print object
    if( this.target.p ){
        let pose_effector_wrt_World = this.pose_effector_wrt_global_world();

        this.draw_extrude_material( pose_effector_wrt_World );
        this.append_element_to_object_printed( pose_effector_wrt_World );
    }

    this.draw_printed_object();

  }

  next_move(){

    if( this.x != this.target.x ){
      this.x += this.step;
    }else if( this.y != this.target.y ){
      this.y += this.step;
    }else if( this.z != this.target.z ){
      this.z += this.step;
    }else if( this.trajectory.length > 0 )
        this.update_target_from_code( this.trajectory.pop() );
    else
        this.go_home_robot();
  }

  update_target_from_code( code ){

    switch( code.axis ){
      case 0: // move along x-axis
        this.target.x += code.d;
        break;
      case 1: // move along y-axis
        this.target.y += code.d;
        break;
      case 2: // move along z-axis
        this.target.z += code.d;
        break;
    }

    this.step = code.d>0 ? this.stepSize : -this.stepSize;

    this.target.p = code.p;
  }

  go_home_robot(){
    this.target = { x:0, y:0, z:0, p:false };
    this.step = -1;
  }

  draw_extrude_material( pose ){

    push();
    translate( pose.x,
               pose.y,
               pose.z);

    stroke('teal');
    fill('orange');
    box(diameter,diameter, diameter);
    pop();

  }

  append_element_to_object_printed( pose ){

    let cell = { x: parseInt(pose.x/diameter) * diameter,
                                  y: parseInt(pose.y/diameter) * diameter,
                                  z: parseInt(pose.z/diameter) * diameter }

    if( this.object_printed.length == 0 ){
      this.object_printed.push(  cell );
      this.last_printed = cell;
    }
    else if( (cell.x != this.last_printed.x) ||
             (cell.y != this.last_printed.y) ||
             (cell.z != this.last_printed.z)  ){
      this.object_printed.push( cell );
      this.last_printed = cell;
    }
  }

  draw_printed_object(){

    this.object_printed.forEach( (element) => {
      push();
      translate( element.x, element.y, element.z);
      stroke('orange');
      fill('teal');
      box(diameter,diameter, diameter);
      pop();
    });

  }

}
