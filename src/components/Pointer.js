import React, {useEffect, useRef} from 'react'

export default function Pointer({pointerPosition, callback}) {
    const ref = useRef();

    useEffect(() => {
        callback('pointerRef', ref);
    }, [ref]);

    return (
        <mesh
            ref={ref}
            position={[pointerPosition.x, pointerPosition.y + 0.3, pointerPosition.z]}
            visible={false}
        >
            <sphereBufferGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={'red'} />
        </mesh>
    )
}
