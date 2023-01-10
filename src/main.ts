import "./style.css"
import * as THREE from "three"

const app = document.querySelector<HTMLDivElement>("#app")!
if (!app) {
  throw new Error("No app element found")
}

// read css variable ---cube-color from ":root" in style.css
function readCssVariable(name: string) {
  name = "---" + name
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
}

function createScene() {
  const cubeColor = readCssVariable("cube-color")
  const cubeLineColor = readCssVariable("cube-line-color")
  const { innerWidth: sceneWidth, innerHeight: sceneHeight } = window
  const perspective = sceneWidth / sceneHeight
  const scene = new THREE.Scene()

  // define the camera characteristics
  const camera = new THREE.PerspectiveCamera(75, perspective, 0.1, 1000)
  camera.position.z = 2

  // create renderer world size
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(sceneWidth, sceneHeight)

  // add smoothing to the edges of the cube
  renderer.setPixelRatio(window.devicePixelRatio)

  app.appendChild(renderer.domElement)

  // create a cube
  {
    const geometry = new THREE.BoxGeometry(1.5, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: cubeColor })
    const cube = new THREE.Mesh(geometry, material)

    // draw lines along the edges of the cube using
    const edges = new THREE.EdgesGeometry(geometry)
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: cubeLineColor })
    )

    cube.add(line)
    scene.add(cube)

    const animate = () => {
      requestAnimationFrame(animate)

      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderer.render(scene, camera)
    }

    animate()
  }

  // rotate the camera around the cube
  {
    const animate = () => {
      requestAnimationFrame(animate)

      camera.position.x = 15 - 15 *  Math.sin(Date.now() / 1000)
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()
  }
}

export { createScene }
