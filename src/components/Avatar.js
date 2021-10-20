import React, {useEffect, useMemo, useRef, useState} from 'react'
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {
    AVATAR_WIDTH,
    AVATAR_HEIGHT,
    AVATAR_DEPTH,
    AVATAR_SPEED,
    AVATAR_START_X,
    AVATAR_START_Z
} from "../utils/constants";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";

export default function Avatar({terrain, pointerVisible, pointerPosition, callback}) {
    const rayCaster = new THREE.Raycaster();

    const getZPosition = () => {
        const {x, z} = avatarRef && avatarRef.current ? avatarRef.current.position : {AVATAR_START_X, AVATAR_START_Z};
        const rayOrigin = new THREE.Vector3(x, 100, z);
        const rayDirection = new THREE.Vector3(0, -1, 0);
        rayCaster.set(rayOrigin, rayDirection);
        const intersect = rayCaster.intersectObject(terrain);
        return intersect.length ? intersect[0].point.y : avatarRef.current.position.y;
    }

    const avatarRef = useRef();
    const cameraRef = useRef();
    const controlRef = useRef();
    const [moveRatio, setMoveRatio] = useState([]);

    const startY = useMemo(getZPosition, []);
    const geometry = useMemo(() => <boxBufferGeometry args={[AVATAR_WIDTH, AVATAR_HEIGHT, AVATAR_DEPTH]}/>, []);
    const material = useMemo(() => <meshStandardMaterial color={'red'} />, []);

    useEffect(() => {
        callback('avatarRef', avatarRef);
    }, [avatarRef]);

    useEffect(() => {
        if (pointerVisible) {
            const {x, z} = avatarRef.current.position;
            const {x: pointerX, z: pointerZ} = pointerPosition;
            const [normX, normZ] = normalize(pointerX - x, pointerZ - z);
            setMoveRatio([normX, normZ]);
        }
    }, [pointerPosition]);

    useFrame((rootState, time) => {

        if (pointerVisible && moveRatio.length) {
            const deltaX = time * moveRatio[0] * AVATAR_SPEED;
            const deltaZ = time * moveRatio[1] * AVATAR_SPEED;

            avatarRef.current.position.x += deltaX;
            avatarRef.current.position.z += deltaZ;

            const y = getZPosition() + AVATAR_HEIGHT / 2

            const deltaY = y - avatarRef.current.position.y;
            avatarRef.current.position.y = y;

            cameraRef.current.position.x += deltaX;
            cameraRef.current.position.y += deltaY;
            cameraRef.current.position.z += deltaZ;

            controlRef.current.target.x += deltaX;
            controlRef.current.target.y += deltaY;
            controlRef.current.target.z += deltaZ;

            /*if (Math.abs(Math.abs(pointerX) - Math.abs(x)) <= 0.3 && Math.abs(Math.abs(pointerZ) - Math.abs(z)) <= 0.3) {
                callback('pointerPosition', {x: 0, y: 0, z: 0});
                callback('pointerVisible', false);
                setMoveRatio([]);
            }*/

        } else {
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

    return (
        <>
            <mesh ref={avatarRef} position={[AVATAR_START_X, startY + AVATAR_HEIGHT / 2, AVATAR_START_Z]}
            >
                {geometry}
                {material}
            </mesh>
            <PerspectiveCamera
                ref={cameraRef}
                position={[AVATAR_START_X + 30, startY + AVATAR_HEIGHT / 2 + 10, AVATAR_START_Z]}
                near={0.01}
                far={10000}
                makeDefault
            />
            {avatarRef && avatarRef.current
            ? <OrbitControls
                    ref={controlRef}
                    enableDamping={false}
                    maxDistance={100}
                    rotateSpeed={0.5}
                    mouseButtons ={{
                        LEFT: null,
                        MIDDLE: THREE.MOUSE.DOLLY,
                        RIGHT: THREE.MOUSE.ROTATE
                    }}
                    target={[avatarRef.current.position.x, avatarRef.current.position.y + AVATAR_HEIGHT, avatarRef.current.position.z]}
                />
            :null}
        </>
    )
}
