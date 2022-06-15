// Threejs example: threejs.org/examples/?q=asc#webgl_effects_ascii

import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useCursor } from '@react-three/drei'
import { useControls } from 'leva'
import { AsciiEffect } from 'three-stdlib'

export default function App() {
  const options = useControls({
    "geometry scale": { value: 1, min: 1, max: 5, step: 0.1 },
    "rotation delta": { value: 0, min: 0, max: 0.5, step: 0.01 },
  })
  return (
    <Canvas>
      <color attach="background" args={['black']} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Torusknot {...options}/>
      <OrbitControls />
      <AsciiRenderer invert {...options} />
    </Canvas>
  )
}

function Torusknot(props) {
  const ref = useRef()
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta / 2 + props["rotation delta"]))
  return (
    <mesh
      ref={ref}
      scale={props['geometry scale']}
      >

      <torusKnotGeometry args={[1, 0.2, 128, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

function AsciiRenderer({ renderIndex = 1, characters = ' .:-+*=%@#', speed, ...options }) {
  // Reactive state
  const { size, gl, scene, camera } = useThree()

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, options)
    effect.domElement.style.position = 'absolute'
    effect.domElement.style.top = '0px'
    effect.domElement.style.left = '0px'
    effect.domElement.style.color = 'white'
    effect.domElement.style.backgroundColor = 'black'
    effect.domElement.style.pointerEvents = 'none'
    return effect
  }, [characters, options.invert])

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
