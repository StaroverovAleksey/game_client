import React, {useEffect, useRef, useState} from 'react'
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {AVATAR_DEPTH, AVATAR_HEIGHT, AVATAR_START_X, AVATAR_START_Z, AVATAR_WIDTH} from "../utils/constants";


export default function Avatar({terrain, callback, pointerVisible, pointerX, pointerZ}) {
    const rayCaster = new THREE.Raycaster();

    const ref = useRef();
    const [state, setState] = useState({
        startY: 0,
        moveRatio: 1
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

    /***Первоначальное определение позиции на старте*/
    useEffect(() => {
        if (pointerX && pointerZ) {
            const {x, z} = ref.current.position;
            setState((prevState) => ({
                ...prevState, moveRatio: (pointerX - x) / (pointerZ - z)
            }));
        }
    }, [pointerX, pointerZ]);

    useFrame((rootState, time) => {
        const {moveRatio} = state;
        const {x, z} = ref.current.position;
        const deltaX = pointerX - x;
        const deltaZ = pointerZ - z;

        if (pointerVisible && moveRatio) {
            console.log(deltaX, deltaZ, moveRatio);
            ref.current.position.x += time * moveRatio;
            ref.current.position.z += time;
            //ref.current.position.z += elapsedTime * 0.1;
            ref.current.position.y = getZPosition() + AVATAR_HEIGHT / 2
        }
    });




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
            <boxBufferGeometry args={[AVATAR_WIDTH, AVATAR_HEIGHT, AVATAR_DEPTH]} />
            <meshStandardMaterial color={'red'} />
            <axesHelper args={[20, 20, 20]} />
        </mesh>
    )
}
