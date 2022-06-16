// Threejs example: threejs.org/examples/?q=asc#webgl_effects_ascii

import { useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls} from '@react-three/drei'
import { useControls } from 'leva'
import { AsciiEffect } from 'three-stdlib'

export default function App() {
  //TODO: add groups/folders
  const options = useControls({
    // ASCII options
    "invert": { value: true, min: false, max: true },
    "characters": { value: '.:-+*=%@#'},
    "text color": { value: 'white'},
    "background": { value: 'black'},
    // Mesh options
    "mesh color": { value: 'orange'},
    "mesh type": { options: ['torusKnot', 'box'], value: 'torusKnot'},
    "rotation": { value: 0, min: -0.2, max: 0.2, step: 0.05 }
    // TODO: add mesh specific options
    // Box options
    // TorusKnot options
    //...
    
  })
  return (
    <Canvas>
      <color attach="background" args={['black']} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Torusknot {...options}/>
      <Box {...options} />
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
      
      <boxGeometry args={[1, 1, 1]} />
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
      
      <torusKnotGeometry args={[1, 0.2, 128, 32]} />
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
