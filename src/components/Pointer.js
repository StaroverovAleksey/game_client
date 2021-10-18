import React, {useRef} from 'react'
import {useFrame} from "@react-three/fiber";

export default function Pointer({pointerX, pointerY, pointerZ, pointerVisible}) {
    const ref = useRef();
    useFrame(() => {
        if(ref.current) {
            ref.current.position.set(pointerX, pointerY + 0.3, pointerZ);
        }
    })

    if (!pointerVisible) {
        return null;
    }
    return (
        <mesh ref={ref} position={[pointerX, pointerY + 0.3, pointerZ]} >
            <sphereBufferGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={'red'} />
        </mesh>
    )
}
