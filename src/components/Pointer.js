import React, {useRef} from 'react'

export default function Pointer({pointerPosition}) {
    const ref = useRef();

    return (
        <mesh ref={ref} position={[pointerPosition.x, pointerPosition.y + 0.3, pointerPosition.z]} >
            <sphereBufferGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={'red'} />
        </mesh>
    )
}
