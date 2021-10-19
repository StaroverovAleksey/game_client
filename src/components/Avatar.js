import React, {useEffect, useMemo, useRef, useState} from 'react'
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

export default function Avatar({terrain, pointerVisible, pointerPosition, callback}) {
    const rayCaster = new THREE.Raycaster();

    const ref = useRef();
    const [state, setState] = useState({
        startY: 0,
        moveRatio: []
    });

    const geometry = useMemo(() => <boxBufferGeometry args={[AVATAR_WIDTH, AVATAR_HEIGHT, AVATAR_DEPTH]}/>, []);
    const material = useMemo(() => <meshStandardMaterial color={'red'} />, []);

    useEffect(() => {
        callback('avatarRef', ref);
    }, [ref]);

    /***Первоначальное определение позиции Y на старте*/
    useEffect(() => {
        const startY = getZPosition();
        setState((prevState) => ({...prevState, startY}));
    }, [terrain]);

    /***Определение соотношения */
    useEffect(() => {
        if (pointerVisible) {
            const {x, z} = ref.current.position;
            const {x: pointerX, z: pointerZ} = pointerPosition;
            const [normX, normZ] = normalize(pointerX - x, pointerZ - z);
            setState((prevState) => ({
                ...prevState, moveRatio: [normX, normZ]
            }));
        }
    }, [pointerPosition]);

    useFrame((rootState, time) => {
        const {moveRatio} = state;

        if (pointerVisible && moveRatio.length) {
            const {x: pointerX, z: pointerZ} = pointerPosition;
            const x = ref.current.position.x + time * moveRatio[0] * AVATAR_SPEED;
            const y = getZPosition() + AVATAR_HEIGHT / 2
            const z = ref.current.position.z + time * moveRatio[1] * AVATAR_SPEED;
            ref.current.position.x = x;
            ref.current.position.y = y;
            ref.current.position.z = z;
            callback('avatar', {x, y, z});

            if (Math.abs(Math.abs(pointerX) - Math.abs(x)) <= 0.3 && Math.abs(Math.abs(pointerZ) - Math.abs(z)) <= 0.3) {
                callback('pointerPosition', {x: 0, y: 0, z: 0});
                callback('pointerVisible', false);
                setState((prevState) => ({
                    ...prevState, moveRatio: []
                }));
            }

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
        const intersect = rayCaster.intersectObject(terrain);
        return intersect.length ? intersect[0].point.y : ref.current.position.y;
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
