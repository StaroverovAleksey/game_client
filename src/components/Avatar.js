import React, {useEffect, useRef, useState} from 'react'
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {
    AVATAR_DEPTH,
    AVATAR_HEIGHT,
    AVATAR_SPEED,
    AVATAR_START_X,
    AVATAR_START_Z,
    AVATAR_WIDTH
} from "../utils/constants";

const geometry = <boxBufferGeometry args={[AVATAR_WIDTH, AVATAR_HEIGHT, AVATAR_DEPTH]} />;
const material = <meshStandardMaterial color={'red'} />;


export default function Avatar({terrain, callback, pointerVisible, pointerX, pointerZ}) {
    const rayCaster = new THREE.Raycaster();

    const ref = useRef();
    const [state, setState] = useState({
        startY: 0,
        moveRatio: 0
    });

    /***Первоначальное определение позиции Y на старте*/
    useEffect(() => {
        setState((prevState) => {
            console.log(prevState);
                return {
                    ...prevState, startY: getZPosition()
                }
            }
        );
    }, [terrain]);

    /***Определение соотношения */
    useEffect(() => {
        if (pointerX && pointerZ) {
            const {x, z} = ref.current.position;
            const [normX, normZ] = normalize(pointerX - x, pointerZ - z);
            //console.log(normX, normZ)
            setState((prevState) => ({
                ...prevState, moveRatio: [normX, normZ]
            }));
        }
    }, [pointerX, pointerZ]);

    useFrame((rootState, time) => {
        const {moveRatio} = state;

        if (pointerVisible && moveRatio) {
            ref.current.position.x += time * moveRatio[0] * AVATAR_SPEED;
            ref.current.position.z += time * moveRatio[1] * AVATAR_SPEED;
            ref.current.position.y = getZPosition() + AVATAR_HEIGHT / 2
        }
    });

    const normalize = (x, z) => {
        const absX = Math.abs(x);
        const absZ = Math.abs(z);
        const signX = Math.sign(x);
        const signZ = Math.sign(z);
        if (Math.abs(x) <= Math.abs(z)) {
            return [absX / absZ * signX, signZ]
        } else {
            return [signX, absZ / absX * signZ];
        }
    }


    const getZPosition = () => {
        const {x, z} = ref.current.position;
        const rayOrigin = new THREE.Vector3(x, 100, z);
        const rayDirection = new THREE.Vector3(0, -1, 0);
        rayCaster.set(rayOrigin, rayDirection);
        if (terrain && terrain.current) {
            const intersect = rayCaster.intersectObject(terrain.current);
            const y = intersect.length ? intersect[0].point.y : ref.current.position.y;
            callback(x, y, z);
            return y;
        } else {
            return ref.current.position.y;
        }
    }


    return (
        <mesh
            ref={ref}
            position={[AVATAR_START_X, state.startY + AVATAR_HEIGHT / 2, AVATAR_START_Z]}
        >
            {geometry}
            {material}
        </mesh>
    )
}
