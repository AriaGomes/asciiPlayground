// Threejs example: threejs.org/examples/?q=asc#webgl_effects_ascii

import { useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls} from '@react-three/drei'
import { useControls, folder} from 'leva'
import { AsciiEffect } from 'three-stdlib'

export default function App() {
  const options = useControls({
    // TODO add more effects
    //Effects options
    effect: {
      options: ["Ascii"], value: "Ascii",
    },
    // ASCII options
    ascii: folder(
    {
    "invert": { value: true, min: false, max: true },
    "characters": { value: '.:-+*=%@#'},
    "text color": { value: 'white'},
    "background": { value: 'black'},
    
    },
    {render: (get) => get("effect") === "Ascii"},
    
    ),
    // Add more meshes
    // Mesh options
    mesh: folder({
    "mesh type": { options: ['torusKnot', 'box', "cone", "lathe"], value: 'torusKnot'},
    "mesh color": { value: 'orange'},
    "rotation": { value: 0, min: -0.2, max: 0.2, step: 0.05 },
    }),
    // TorusKnot options
    torusKnot: folder(
      {
        "radius": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "tube": { value: 0.2, min: 0.1, max: 2, step: 0.1 },
        "radial segments": { value: 32, min: 3, max: 128, step: 1 },
        "tubular segments": { value: 128, min: 3, max: 128, step: 1 },
        "p": { value: 2, min: 2, max: 5, step: 1 },
        "q": { value: 3, min: 2, max: 5, step: 1 },
      },
      {render: (get) => get('mesh.mesh type') === 'torusKnot'}
    ),
    // Box options
    box: folder(
      {
        "width": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "height": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "depth": { value: 1, min: 0.1, max: 2, step: 0.1 },
      },
      {render: (get) => get('mesh.mesh type') === 'box'}
    ),
    // Lathe options
    lathe: folder(
      {
        "points": { value: [0, 0, 0, 1, 1, 1], min: 3, max: 128, step: 1 },
        "segments": { value: 32, min: 3, max: 128, step: 1 },
        "phiStart": { value: 0, min: 0, max: 2 * Math.PI, step: 0.1 },
        "phiLength": { value: 2 * Math.PI, min: 0, max: 2 * Math.PI, step: 0.1 },
      },
      {render: (get) => get('mesh.mesh type') === 'lathe'}
    ),
    // Icosahedron options
    icosahedron: folder(
      {
        "radius": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "detail": { value: 0, min: 0, max: 5, step: 1 },
      },
      {render: (get) => get('mesh.mesh type') === 'icosahedron'}
    ),
    // Octahedron options
    octahedron: folder(
      {
        "radius": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "detail": { value: 0, min: 0, max: 5, step: 1 },
      },
      {render: (get) => get('mesh.mesh type') === 'octahedron'}
    ),
    // Tetrahedron options
    tetrahedron: folder(
      {
        "radius": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "detail": { value: 0, min: 0, max: 5, step: 1 },
      },
      {render: (get) => get('mesh.mesh type') === 'tetrahedron'}
    ),
    // Sphere options
    sphere: folder(
      {
        "radius": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "widthSegments": { value: 32, min: 3, max: 128, step: 1 },
        "heightSegments": { value: 32, min: 3, max: 128, step: 1 },
        "phiStart": { value: 0, min: 0, max: 2 * Math.PI, step: 0.1 },
        "phiLength": { value: 2 * Math.PI, min: 0, max: 2 * Math.PI, step: 0.1 },
        "thetaStart": { value: 0, min: 0, max: 2 * Math.PI, step: 0.1 },
        "thetaLength": { value: 2 * Math.PI, min: 0, max: 2 * Math.PI, step: 0.1 },
      },
      {render: (get) => get('mesh.mesh type') === 'sphere'}
    ),
    // Ring options
    ring: folder(
      {
        "innerRadius": { value: 0.5, min: 0.1, max: 2, step: 0.1 },
        "outerRadius": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "thetaSegments": { value: 32, min: 3, max: 128, step: 1 },
        "phiSegments": { value: 32, min: 3, max: 128, step: 1 },
        "thetaStart": { value: 0, min: 0, max: 2 * Math.PI, step: 0.1 },
        "thetaLength": { value: 2 * Math.PI, min: 0, max: 2 * Math.PI, step: 0.1 },
      },
      {render: (get) => get('mesh.mesh type') === 'ring'}
    ),
    // Cylinder options
    cylinder: folder(
      {
        "radiusTop": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "radiusBottom": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "height": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "radialSegments": { value: 32, min: 3, max: 128, step: 1 },
        "heightSegments": { value: 32, min: 3, max: 128, step: 1 },
        "openEnded": { value: false },
      },
      {render: (get) => get('mesh.mesh type') === 'cylinder'}
    ),
    // Cone options
    cone: folder(
      {
        "radius": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "height": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "radialSegments": { value: 32, min: 3, max: 128, step: 1 },
        "heightSegments": { value: 32, min: 3, max: 128, step: 1 },
        "openEnded": { value: false },
      },
      {render: (get) => get('mesh.mesh type') === 'cone'}
    ),
    // Dodecahedron options
    dodecahedron: folder(
      {
        "radius": { value: 1, min: 0.1, max: 2, step: 0.1 },
        "detail": { value: 0, min: 0, max: 5, step: 1 },
      },
      {render: (get) => get('mesh.mesh type') === 'dodecahedron'}
    ),
  },
)
  return (
    <Canvas>
      <color attach="background" args={['black']} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Torusknot {...options}/>
      <Box {...options} />
      <Cone {...options} />
      <Lathe {...options} />
      <OrbitControls />
      <AsciiRenderer {...options} />

      
    </Canvas>
  )
}

function Box(props) {
  const ref = useRef()
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += props["rotation"] / 2 ))
  return (
    <mesh
      ref={ref}
      visible={props['mesh type'] === 'box'}
      >
      
      <boxGeometry args={[props["width"], props["height"], props["depth"]]} />
      <meshStandardMaterial color={props["mesh color"]} />
    </mesh>
  )
}

function Torusknot(props) {
  const ref = useRef()
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += props["rotation"] / 2 ))
  return (
    <mesh
      ref={ref}
      visible={props['mesh type'] === 'torusKnot'}
      >
      
      <torusKnotGeometry args={[props["radius"], props["tube"], props["radial segments"], props["tubular segments"], props["p"], props["q"]]} />
      <meshStandardMaterial color={props["mesh color"]} />
    </mesh>
  )
}

function Lathe(props) {
  const ref = useRef()
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += props["rotation"] / 2 ))
  return (
    <mesh
      ref={ref}
      visible={props['mesh type'] === 'lathe'}
      >
      
      <latheGeometry args={[props["points"], props["segments"]]} />
      <meshStandardMaterial color={props["mesh color"]} />
    </mesh>
  )
}

function icosahedron(props) {
  const ref = useRef()
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += props["rotation"] / 2 ))
  return (
    <mesh
      ref={ref}
      visible={props['mesh type'] === 'icosahedron'}
      >
      
      <icosahedronGeometry args={[props["radius"], props["detail"]]} />
      <meshStandardMaterial color={props["mesh color"]} />
    </mesh>
  )
}

function Sphere(props) {
  const ref = useRef()
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += props["rotation"] / 2 ))
  return (
    <mesh
      ref={ref}
      visible={props['mesh type'] === 'sphere'}
      >
      
      <sphereGeometry args={[props["radius"], props["widthSegments"], props["heightSegments"]]} />
      <meshStandardMaterial color={props["mesh color"]} />
    </mesh>
  )
}

function Cylinder(props) {
  const ref = useRef()
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += props["rotation"] / 2 ))
  return (
    <mesh
      ref={ref}
      visible={props['mesh type'] === 'cylinder'}
      >
      
      <cylinderGeometry args={[props["radiusTop"], props["radiusBottom"], props["height"], props["radialSegments"], props["heightSegments"], props["openEnded"]]} />
      <meshStandardMaterial color={props["mesh color"]} />
    </mesh>
  )
}

function Cone(props) {
  const ref = useRef()
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += props["rotation"] / 2 ))
  return (
    <mesh
      ref={ref}
      visible={props['mesh type'] === 'cone'}
      >
      
      <coneGeometry args={[props["radius"], props["height"], props["radialSegments"], props["heightSegments"], props["openEnded"]]} />
      <meshStandardMaterial color={props["mesh color"]} />
    </mesh>
  )
}

function Dodecahedron(props) {
  const ref = useRef()
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += props["rotation"] / 2 ))
  return (
    <mesh
      ref={ref}
      visible={props['mesh type'] === 'dodecahedron'}
      >
      
      <dodecahedronGeometry args={[props["radius"], props["detail"]]} />
      <meshStandardMaterial color={props["mesh color"]} />
    </mesh>
  )
}



function AsciiRenderer({ renderIndex = 1, characters, ...options }) {
  // Reactive state
  const { size, gl, scene, camera } = useThree()
  characters = " ".concat(...characters) // add space to start to fix invert issues 


  // Create effect
  let effect = useMemo(() => {
    let effect = new AsciiEffect(gl, characters, options)
    effect.domElement.style.position = 'absolute'
    effect.domElement.style.top = '0px'
    effect.domElement.style.left = '0px'
    effect.domElement.style.color = options['text color']
    effect.domElement.style.backgroundColor = options['background']
    effect.domElement.style.pointerEvents = 'none'
    return effect
  }, [characters, options.invert, options['text color'], options['background']])

  // Append on mount, remove on unmount
  useEffect(() => {
    gl.domElement.parentNode.appendChild(effect.domElement)
    return () => gl.domElement.parentNode.removeChild(effect.domElement)
  }, [effect])

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height)
  }, [effect, size])

  // Take over render-loop (that is what the index is for)
  useFrame((state) => {
    effect.render(scene, camera)
  }, renderIndex)

  // This component returns nothing, it has no view, it is a purely logical
}
