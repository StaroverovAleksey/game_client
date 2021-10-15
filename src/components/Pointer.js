import React, {useRef} from 'react'
import {useFrame} from "@react-three/fiber";

export default function Pointer({x, y, z, visible}) {
    const ref = useRef();
    useFrame(() => {
        if(ref.current) {
            ref.current.position.set(x, y + 0.3, z);
        }
    })

    if (!visible) {
        return null;
    }
    return (
        <mesh ref={ref} position={[x, y + 0.3, z]} >
            <sphereBufferGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={'red'} />
        </mesh>
    )
}
