import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
    Loader,
    OrbitControls,
    useTexture,
    PerspectiveCamera
} from "@react-three/drei";

function Box(props) {
    // This reference will give us direct access to the mesh
    const ref = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => {
        ref.current.rotation.x = ref.current.rotation.y += 0.01
    })
    const handlerClick = (e) => {
        if (e.eventObject.uuid === e.intersections[0].object.uuid) {
            setActive(!active);
        }
    }
    const handlerHover = (e) => {
        console.log('HOVER');
        console.log(props.qwerty);
        if (e.eventObject.uuid === e.intersections[0].object.uuid) {
            setHover(true);
        }
    }
    const handlerOut = (e) => {
        console.log('OUT');
        console.log(e);
        setHover(false);
        /*if (e.eventObject.uuid === e.intersections[0].object.uuid) {
            setHover(false);
        }*/
        //console.log(e.eventObject.uuid, e.intersections[0].object.uuid);
    }
    return (
        <mesh
            {...props}
            ref={ref}
            scale={active ? 1.5 : 1}
            onClick={handlerClick}
            onPointerOver={handlerHover}
            onPointerOut={handlerOut}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}



export default function App() {
    const handlerHover = (e) => {
        console.log('HOVER');
        console.log(e.intersections[0]);
    }
    return (
        <Canvas>
            onPointerOver={handlerHover}
            <PerspectiveCamera
                position={[0.5, 0.5, 0.5]}
                near={0.01}
                far={1000}
                makeDefault
            />
            <OrbitControls screenSpacePanning={false} target={[0, 0, 0]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Box position={[-1.2, 0, 0]} qwerty={12345}/>
            <Box position={[1.2, 0, 0]} />
        </Canvas>
    )
}
