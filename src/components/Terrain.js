import React, {useEffect, useRef, useState} from 'react'
import { useGLTF } from '@react-three/drei'

export default function Terrain({callback}) {
    const gltf = useGLTF('terrain/island.gltf');
    const mesh1 = gltf.scene.children[0].clone();
    const ref = useRef();

    const [state, setState] = useState({
        mouseDownX: 0,
        mouseDownY: 0,
        mouseDownTime : 0
    });

    useEffect(() => {
        callback('terrainRef', ref);
    }, [ref]);

    const onMouseDownHandler = (event) => {
        event.stopPropagation();
        setState({
            mouseDownX: event.clientX,
            mouseDownY: event.clientY,
            mouseDownTime: new Date()
        });
    }

    const onMouseUpHandler = (event) => {
        event.stopPropagation();
        const {mouseDownX, mouseDownY, mouseDownTime} = state;
        if ((new Date() - mouseDownTime < 150) || (mouseDownX === event.clientX && mouseDownY === event.clientY)) {
            callback('pointerPosition', {x: event.point.x, y: event.point.y, z: event.point.z});
            callback('pointerVisible', true);
        }
        setState({
            mouseDownX: 0,
            mouseDownY: 0,
            mouseDownTime: 0
        });
    }

    return (
            <mesh
                ref={ref}
                geometry={mesh1.geometry}
                material={mesh1.material}
                position={mesh1.position}
                rotation={mesh1.rotation}
                onPointerUp={onMouseUpHandler}
                onPointerDown={onMouseDownHandler}
            />
    )
}

useGLTF.preload('terrain/island.gltf');
