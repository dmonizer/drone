const motorDirections = [1, -1, 1, -1]

const Sticks = function (throttle, roll, pitch, yaw) {
  return {throttle, roll, pitch, yaw}
}

const Power = function (sticks) {
  const {throttle, roll, pitch, yaw} = sticks;
  const u1 = 1 * throttle + (-1) * roll + 1 * pitch + (-1) * yaw
  const u2 = 1 * throttle + (-1) * roll + (-1) * pitch + 1 * yaw
  const u3 = 1 * throttle + 1 * roll + (-1) * pitch + (-1) * yaw
  const u4 = 1 * throttle + 1 * roll + 1 * pitch + 1 * yaw
  return [u1, u2, u3, u4];
}

const Motor = function (max, direction, location) {
  this.maxThrust = max;
  this.direction = direction;
  this.thrust = 0;
  this.location = location;

  this.setThrust = function (t) {
    if (t <= 0) {
      this.thrust = 0;
    }
    else {
      this.thrust = t <= this.maxThrust ? t : this.maxThrust;
    }
  }
  this.getThrust = function () {return this.thrust};
  this.getMotorLocation = () => this.location;
}

const Drone = function (weight) {
  this.weight = weight;
  this.noOfMotor = 4;
  this.motors = []

  for (let i = 1; i <= this.noOfMotor; i++) {
    this.motors.push(new Motor(1, motorDirections[i - 1], i));
  }
  this.setPower = function (powers) {
    this.motors.map((motor) => motor.setThrust(powers[motor.getMotorLocation() - 1]));
  }

  this.calcXorient = () => {
    const orient = (this.motors[0].getThrust() + this.motors[3].getThrust())
      - (this.motors[1].getThrust() + this.motors[2].getThrust());
    return orient
  }
  this.calcYorient = function () {
    const orient = (this.motors[0].getThrust() + this.motors[2].getThrust()) - (this.motors[1].getThrust() + this.motors[3].getThrust());
    return orient
  }
  this.calcZorient = function () {
    const orient = (this.motors[0].getThrust() + this.motors[1].getThrust()) - (this.motors[2].getThrust() + this.motors[3].getThrust());
    return orient
  }
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var body = new THREE.BoxGeometry(2, 0.2, 2);
var bodyMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
var bodyReady = new THREE.Mesh(body, bodyMaterial);
scene.add(bodyReady)
/*var drone = new THREE.Geometry();
bodyReady.updateMatrix();
drone.merge(bodyReady.geometry, bodyReady.matrix);
propReady.updateMatrix();
drone.merge(propReady.geometry, propReady.matrix);

var droneMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
var droneMesh = new THREE.Mesh(drone, droneMaterial);
*/
//scene.add( droneMesh );

//scene.add(bodyReady);
//scene.add(propReady);
const drone = new Drone(400);
let roll = 0;
let pitch = 0;
let yaw = 0;
document.body.onkeydown = function (ev) {
  switch (ev.key) {
    case "ArrowUp" :
      pitch += 0.001;
      break;
    case "ArrowDown" :
      pitch -= 0.001;
      break;
    case "ArrowLeft" :
      roll -= 0.001;
      break;
    case "ArrowRight" :
      roll += 0.001;
      break;
    case " ":
      roll = 0;
      pitch = 0;
      yaw = 0;
      break;
    case "z" :
      yaw -= 0.001;
      break;
    case "x" :
      yaw += 0.001;
      break;

  }
  const power = new Power(new Sticks(0.1, roll, pitch, yaw))

  drone.setPower(power);
}

document.body.onkeyup = function (ev) {
  switch (ev.key) {
    case "ArrowUp" :
    case "ArrowDown" :
      pitch = 0;
      break;
    case "ArrowLeft" :
    case "ArrowRight" :
      roll = 0;
      break;
    case "z" :
    case "x" :
      yaw = 0;
      break;

  }
  const power = new Power(new Sticks(0.1, roll, pitch, yaw))

  drone.setPower(power);

}
camera.position.z = 5;
var animate = function () {
  requestAnimationFrame(animate);
  //cube.rotation.z = 5;
  //propReady.rotation.x += 0.01;
  //bodyReady.rotation.y += 0.01;

  bodyReady.rotation.x += drone.calcXorient();
  bodyReady.rotation.y += drone.calcYorient();
  bodyReady.rotation.z += drone.calcZorient();
  //console.log(bodyReady.rotation.x,bodyReady.rotation.y,bodyReady.rotation.z);
console.log(drone.motors.map(m=>m.getThrust()))
  renderer.render(scene, camera);
};

animate();
