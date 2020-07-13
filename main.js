const color = {
  transparent: [0, 0, 0, 0],
  blue: [0, 0, 255, 1],
  red: [255, 0, 0, 1],
  green: [0, 255, 0, 1],
  yellow: [255, 255, 0, 1],
  orange: [255, 165, 0, 1],
  white: [255, 255, 255, 1],
  black: [0, 0, 0, 1],
};

const cb = [...Array(3)].map(x => [...Array(3)].map(x => [...Array(3)]));

let pointerIsDown = false;
let x = 0,
  y = 0,
  z = 0;
let startPoint = { x: 0, y: 0 };
let cube = document.querySelector('.big-cube');
let _cube = document.querySelector('.cube');
let cubes = [];
for (let i = 0; i < 8; i++) {
  cubes.push(_cube.cloneNode(true));
}
document.querySelector('.cube-line').append(...cubes);
cubes = [];
_cube = document.querySelector('.cube-line');
for (let i = 0; i < 2; i++) {
  cubes.push(_cube.cloneNode(true));
}
cube.append(...cubes);

cubes = [].slice.call(document.querySelectorAll('.cube'));
{
  let x = 0, y = 0, z = 0;
  for (let i = 0; i < cubes.length; i++) {
    const el = cubes[i];
    console.log(x, y, z, el);
    let transformOriginX = 160 + (x * (-110));
    let transformOriginY = 0;
    let transformOriginZ = -110 + 110 * z;
    el.style.transformOrigin = `${transformOriginX}px ${transformOriginY}px ${transformOriginZ}px`;
    cb[x][y][z] = el;
    x += 1;
    if (x === 3) {
      x = 0;
      y += 1;
    }
    if (y === 3) {
      y = 0;
      z += 1;
    }
  }
}

cubes = cb;
{
  for (let x = 0; x < cubes.length; x++) {
    const face = cubes[x];
    for (let y = 0; y < face.length; y++) {
      const line = face[y];
      for (let z = 0; z < line.length; z++) {
        const singleCube = line[z];
        const colorInstance = {
          front: color.black,
          back: color.black,
          left: color.black,
          right: color.black,
          top: color.black,
          bottom: color.black
        }
        if (x === 0) {
          colorInstance.left = color.orange;
        }
        if (y === 0) {
          colorInstance.top = color.yellow;
        }
        if (z === 0) {
          colorInstance.front = color.blue;
        }
        if (x === 2) {
          colorInstance.right = color.red;
        }
        if (y === 2) {
          colorInstance.bottom = color.white;
        }
        if (z === 2) {
          colorInstance.back = color.green;
        }
        Object.keys(colorInstance).map(key => {
          singleCube.querySelector(`.${key}`).style.background = `rgba(${colorInstance[key].join(',')})`;
        })
      }
    }
  }
}

document.addEventListener("pointerdown", (event) => {
  pointerIsDown = true;
  startPoint = { x: event.x, y: event.y };
});
document.addEventListener("pointermove", (event) => {
  if (!pointerIsDown) return;
  let xNow = (event.x - startPoint.x) + x;
  let yNow = (event.y - startPoint.y) * (-1) + y;
  // // if (xNow > 90) xNow = 90;
  if (yNow > 90) yNow = 90;
  // // if (xNow < -90) xNow = -90;
  if (yNow < -90) yNow = -90;
  cube.setAttribute('style', `transform: rotateX(${yNow}deg) rotateY(${xNow}deg)`);
});
document.addEventListener("pointerup", (event) => {
  pointerIsDown = false;
  x = (event.x - startPoint.x) + x;
  y = (event.y - startPoint.y) * (-1) + y;
  // if (x > 90) x = 90;
  if (y > 90) y = 90;
  // if (x < -90) x = -90;
  if (y < -90) y = -90;
});

let tsY = 0;
document.querySelector('#upper').addEventListener('click', (event) => {
  tsY += 90;
  for (let x = 0; x < cubes.length; x++) {
    const line = cubes[x][0];
    for (let z = 0; z < line.length; z++) {
      line[z].style.transform = `rotateY(${tsY}deg)`;
    }
  }
})