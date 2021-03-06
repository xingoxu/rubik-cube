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

let cb = [...Array(3)].map(x => [...Array(3)].map(x => [...Array(3)]));

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
let cubesE = cubes;
{
  let x = 0, y = 0, z = 0;
  for (let i = 0; i < cubes.length; i++) {
    const el = cubes[i];
    console.log(x, y, z, el);
    let transformOriginX = 160 + (x * (-110));
    let transformOriginY = 160 + (y * (-110));
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
cb = [...Array(3)].map(x => [...Array(3)].map(x => [...Array(3)]));
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
        cb[x][y][z] = colorInstance;
        Object.keys(colorInstance).map(key => {
          singleCube.querySelector(`.${key}`).style.background = `rgba(${colorInstance[key].join(',')})`;
        })
      }
    }
  }
}

document.addEventListener("pointerdown", (event) => {
  // console.log(event.target);
  pointerIsDown = true;
  startPoint = { x: event.x, y: event.y };
});

let cubeStartPoint = { x: 0, y: 0 };
let cubeDoing = null;
let direction = null;
cubesE.forEach(el => {
  el.addEventListener('pointerdown', (event) => {
    console.log(event.target.className, el);
    pointerIsDown = true;
    cubeStartPoint = { x: event.x, y: event.y };
    for (let i = 0; i < cubes.length; i++) {
      const face = cubes[i];
      for (let j = 0; j < face.length; j++) {
        const line = face[j];
        for (let k = 0; k < line.length; k++) {
          const element = line[k];
          if (element === el) {
            cubeDoing = `${i}-${j}-${k}`;
          }
        }
      }
    }
    event.stopPropagation();
  })
  el.addEventListener('pointermove', event => {
    if (!pointerIsDown) return;
    let xNow = (event.x - cubeStartPoint.x);
    let yNow = (event.y - cubeStartPoint.y) * (-1);
    direction = Math.abs(xNow) > Math.abs(yNow) ?
      (xNow > 0 ? 'right' : 'left') : (yNow > 0 ? 'up' : 'down');

    event.stopPropagation();
  })
  // TODO
  el.addEventListener('pointerup', event => {
    if (direction === 'right') {
      const [x, y, z] = cubeDoing.split('-');
      rotateX(y);
    }
    console.log(direction);
    pointerIsDown = false;
    event.stopPropagation();
  })
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

function cubeRotateY(cube) {
  let temp = cube.left;
  cube.left = cube.back;
  cube.back = cube.right;
  cube.right = cube.front;
  cube.front = temp;
  return cube;
}
function cloneCubes(cubes) {
  return cubes.map(face => face.map(line => line.slice()));
}

async function rotateX(lineX) {
  let clone = cloneCubes(cb);
  const promises = [];
  for (let x = 0; x < cubes.length; x++) {
    const line = cubes[x][lineX];
    for (let z = 0; z < line.length; z++) {
      clone[Math.abs(z - 2)][lineX][x] = cubeRotateY(cb[x][lineX][z]);
      line[z].style.transition = `.3s transform`;
      line[z].style.transform = `rotateY(${90}deg)`;
      promises.push(new Promise(resolve => {
        line[z].addEventListener('transitionend', resolve);
        setTimeout(resolve, 310);
      }));
    }
  }
  cb = clone;

  await Promise.all(promises);
  for (let x = 0; x < cubes.length; x++) {
    const line = cubes[x][lineX];
    for (let z = 0; z < line.length; z++) {
      let colorInstance = cb[x][lineX][z];
      Object.keys(colorInstance).map(key => {
        cubes[x][lineX][z].querySelector(`.${key}`).style.background = `rgba(${colorInstance[key].join(',')})`;
      })
      line[z].style.transition = ``;
      line[z].style.transform = ``;
    }
  }
}

document.querySelector('#upper').addEventListener('click',  (event) => {
  rotateX(0);
});

function cubeRotateX(cube) {
  let temp = cube.front;
  cube.front = cube.top;
  cube.top = cube.back;
  cube.back = cube.bottom;
  cube.bottom = temp;
  return cube;
}

document.querySelector('#left').addEventListener('click', async (event) => {
  let clone = cloneCubes(cb);
  const promises = [];
  for (let y = 0; y < cubes[0].length; y++) {
    const line = cubes[0][y];
    for (let z = 0; z < line.length; z++) {
      clone[0][Math.abs(z - 2)][y] = cubeRotateX(cb[0][y][z]);
      line[z].style.transition = `.3s transform`;
      line[z].style.transform = `rotateX(${-90}deg)`;
      promises.push(new Promise(resolve => {
        line[z].addEventListener('transitionend', resolve);
        setTimeout(resolve, 310);
      }));
    }
  }
  cb = clone;

  await Promise.all(promises);
  for (let y = 0; y < cubes[0].length; y++) {
    const line = cubes[0][y];
    for (let z = 0; z < line.length; z++) {
      let colorInstance = cb[0][y][z];
      Object.keys(colorInstance).map(key => {
        cubes[0][y][z].querySelector(`.${key}`).style.background = `rgba(${colorInstance[key].join(',')})`;
      })
      line[z].style.transition = ``;
      line[z].style.transform = ``;
    }
  }
})