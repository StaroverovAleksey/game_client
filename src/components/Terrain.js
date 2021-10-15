import React, {useEffect, useRef, useState} from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model({clickCallback, refCallback}) {
    const gltf = useGLTF('terrain/island.gltf');
    const mesh1 = gltf.scene.children[0].clone();
    const ref = useRef();

    const [state, setState] = useState({mouseDownX: 0, mouseDownY: 0});

    useEffect(() => {
        refCallback(ref);
    }, [ref]);

    const onMouseDownHandler = (event) => {
        event.stopPropagation();
        setState({mouseDownX: event.clientX, mouseDownY: event.clientY});
    }

    const onMouseUpHandler = (event) => {
        event.stopPropagation();
        const {mouseDownX, mouseDownY} = state;
        if (mouseDownX === event.clientX && mouseDownY === event.clientY) {
            clickCallback(event.point.x, event.point.y, event.point.z);
        }
        setState({mouseDownX: 0, mouseDownY: 0});
    }

    return (
            <mesh
                ref={ref}
                geometry={mesh1.geometry}
                material={mesh1.material}
                position={mesh1.position}
                onPointerUp={onMouseUpHandler}
                onPointerDown={onMouseDownHandler}
            />
    )
}

useGLTF.preload('terrain/island.gltf');
