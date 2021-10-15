import React, {useEffect, useRef, useState} from 'react'
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {AVATAR_DEPTH, AVATAR_HEIGHT, AVATAR_WIDTH} from "../utils/constants";

export default function Avatar({avatarX, avatarZ, terrain, callback}) {
    const ref = useRef();
    const [avatarY, setState] = useState(0);

    useEffect(() => {
        getZPosition();
    }, [avatarX, avatarZ, terrain]);

    useFrame(() => {
        if (ref.current) {
            ref.current.position.set(avatarX, avatarY + AVATAR_HEIGHT / 2, avatarZ);
        }
    });


    const getZPosition = () => {
        console.log(avatarX, avatarZ);
        const rayCaster = new THREE.Raycaster();
        const rayOrigin = new THREE.Vector3(avatarX, 100, avatarZ);
        const rayDirection = new THREE.Vector3(avatarX, -100, avatarZ);
        rayDirection.normalize();
        rayCaster.set(rayOrigin, rayDirection);
        if (terrain && terrain.current) {
            const intersect = rayCaster.intersectObject(terrain.current);
            const {y: avatarY} = intersect.length ? intersect[0].point : avatarY;
            setState(avatarY);
            callback(avatarY);
        }
    }



    return (
        <mesh
            ref={ref}
            position={[avatarX, AVATAR_HEIGHT / 2, avatarZ]}
        >
            <boxBufferGeometry args={[AVATAR_WIDTH, AVATAR_HEIGHT, AVATAR_DEPTH]} />
            <meshStandardMaterial color={'red'} />
        </mesh>
    )
}
