import React, {useEffect, useRef} from 'react'
import { useGLTF } from '@react-three/drei'

export default function Terrain({callback, pointer}) {
    const gltf = useGLTF('terrain/island.gltf');
    const mesh1 = gltf.scene.children[0].clone();
    const ref = useRef();

    useEffect(() => {
        callback('terrainRef', ref);
    }, [ref]);

    const onClickHandler = (event) => {
        callback('pointerPosition', {x: event.point.x, y: event.point.y, z: event.point.z});
        pointer.visible = true;
    }

    return (
            <mesh
                ref={ref}
                geometry={mesh1.geometry}
                material={mesh1.material}
                position={mesh1.position}
                rotation={mesh1.rotation}
                onClick={onClickHandler}
            />
    )
}

useGLTF.preload('terrain/island.gltf');
