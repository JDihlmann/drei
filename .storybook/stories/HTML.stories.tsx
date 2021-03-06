import * as React from 'react'
import * as THREE from 'three'

import { Setup } from '../Setup'
import { useTurntable } from '../useTurntable'

import { Icosahedron, Html, OrthographicCamera } from '../../src'
import { HtmlProps, CalculatePosition } from 'web/Html'
import { useFrame, useThree } from 'react-three-fiber'

export default {
  title: 'Misc/Html',
  component: Html,
  decorators: [(storyFn) => <Setup cameraPosition={new THREE.Vector3(-20, 20, -20)}> {storyFn()}</Setup>],
}

function HTMLScene(htmlProps: HtmlProps) {
  const ref = useTurntable()
  return (
    <group ref={ref}>
      <Icosahedron args={[2, 2]} position={[3, 6, 4]}>
        <meshBasicMaterial attach="material" color="hotpink" wireframe />
        <Html {...htmlProps}>First</Html>
      </Icosahedron>

      <Icosahedron args={[2, 2]} position={[10, 0, 10]}>
        <meshBasicMaterial attach="material" color="hotpink" wireframe />
        <Html {...htmlProps}>Second</Html>
      </Icosahedron>

      <Icosahedron args={[2, 2]} position={[-20, 0, -20]}>
        <meshBasicMaterial attach="material" color="hotpink" wireframe />
        <Html {...htmlProps}>Third</Html>
      </Icosahedron>
    </group>
  )
}

export const HTMLSt = () => <HTMLScene distanceFactor={30} className="html-story-block" />
HTMLSt.storyName = 'Default'

function HTMLOrthographicScene() {
  const { camera } = useThree()
  const [zoomIn, setZoomIn] = React.useState(true)

  const initialCamera = {
    position: new THREE.Vector3(0, 0, -10),
  }

  useFrame(() => {
    zoomIn ? (camera.zoom += 0.01) : (camera.zoom -= 0.01)
    camera.updateProjectionMatrix()

    if (camera.zoom > 3) {
      setZoomIn(false)
    } else if (camera.zoom < 1) {
      setZoomIn(true)
    }
  })

  return (
    <>
      <OrthographicCamera makeDefault={true} applyMatrix4={undefined} {...initialCamera} />

      <Icosahedron args={[200, 5]} position={[0, 0, 0]}>
        <meshBasicMaterial attach="material" color="hotpink" wireframe />
        {
          // for smoother text use css will-change: transform
          <Html className="html-story-label" distanceFactor={1}>
            Orthographic
          </Html>
        }
      </Icosahedron>
      <ambientLight intensity={0.8} />
      <pointLight intensity={1} position={[0, 6, 0]} />
    </>
  )
}

export const HTMLOrthoSt = () => <HTMLOrthographicScene />
HTMLOrthoSt.storyName = 'Orthographic'

const v1 = new THREE.Vector3()
const overrideCalculatePosition: CalculatePosition = (el, camera, size) => {
  const objectPos = v1.setFromMatrixPosition(el.matrixWorld)
  objectPos.project(camera)
  const widthHalf = size.width / 2
  const heightHalf = size.height / 2
  return [
    Math.min(size.width - 100, Math.max(0, objectPos.x * widthHalf + widthHalf)),
    Math.min(size.height - 20, Math.max(0, -(objectPos.y * heightHalf) + heightHalf)),
  ]
}

export const HTMLCalculatePosition = () => (
  <HTMLScene className="html-story-label" calculatePosition={overrideCalculatePosition} />
)
HTMLCalculatePosition.storyName = 'Custom Calculate Position'
