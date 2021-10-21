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
    const [deltaMove, setDeltaMove] = useState([]);
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
            const deltaX = pointerX - x;
            const deltaZ = pointerZ - z;
            const distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
            setDeltaMove([deltaX, deltaZ]);
            const [normX, normZ] = normalize(pointerX - x, pointerZ - z);
            //console.log(new Date().getTime())
            //console.log(distance / AVATAR_SPEED)
            //console.log((new Date().getTime() + distance / AVATAR_SPEED) * 1000)
            setMoveRatio([normX, normZ])
            //setMoveRatio([normX, normZ]);
        }
    }, [pointerPosition]);

    useFrame((rootState, time) => {


        //console.log(stopMoveTime === 0)

        if (pointerVisible && moveRatio.length /*&& (rootState.clock.elapsedTime < stopMoveTime || stopMoveTime === 0)*/) {
            const {x: pointerX, z: pointerZ} = pointerPosition;

            if (deltaMove[0] > 0 && deltaMove[1] > 0) {
                if (pointerX <= avatarRef.current.position.x && pointerZ <= avatarRef.current.position.z) {
                    avatarRef.current.position.x = pointerX;
                    avatarRef.current.position.z = pointerZ;
                    callback('pointerPosition', {x: 0, y: 0, z: 0});
                    callback('pointerVisible', false);
                    setMoveRatio([]);
                    return
                }
            }
            if (deltaMove[0] > 0 && deltaMove[1] < 0) {
                if (pointerX <= avatarRef.current.position.x && pointerZ >= avatarRef.current.position.z) {
                    avatarRef.current.position.x = pointerX;
                    avatarRef.current.position.z = pointerZ;
                    callback('pointerPosition', {x: 0, y: 0, z: 0});
                    callback('pointerVisible', false);
                    setMoveRatio([]);
                }
            }
            if (deltaMove[0] < 0 && deltaMove[1] > 0) {
                if (pointerX >= avatarRef.current.position.x && pointerZ <= avatarRef.current.position.z) {
                    avatarRef.current.position.x = pointerX;
                    avatarRef.current.position.z = pointerZ;
                    callback('pointerPosition', {x: 0, y: 0, z: 0});
                    callback('pointerVisible', false);
                    setMoveRatio([]);
                }
            }
            if (deltaMove[0] < 0 && deltaMove[1] < 0) {
                if (pointerX >= avatarRef.current.position.x && pointerZ >= avatarRef.current.position.z) {
                    avatarRef.current.position.x = pointerX;
                    avatarRef.current.position.z = pointerZ;
                    callback('pointerPosition', {x: 0, y: 0, z: 0});
                    callback('pointerVisible', false);
                    setMoveRatio([]);
                }
            }

            //console.log('AAAAAA', rootState.clock.elapsedTime);
            //console.log('SSSSSS', new Date().getTime());
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

            /*if (Math.abs(Math.abs(pointerX) - Math.abs(cameraRef.current.position.x)) <= 0.3 && Math.abs(Math.abs(pointerZ) - Math.abs(cameraRef.current.position.z)) <= 0.3) {
                callback('pointerPosition', {x: 0, y: 0, z: 0});
                callback('pointerVisible', false);
                setMoveRatio([]);
            }*/

            console.log(pointerX, avatarRef.current.position.x);


           /* if (Math.abs(Math.abs(pointerX) - Math.abs(avatarRef.current.position.x)) <= 0.3 && Math.abs(Math.abs(pointerZ) - Math.abs(avatarRef.current.position.z)) <= 0.3) {
                callback('pointerPosition', {x: 0, y: 0, z: 0});
                callback('pointerVisible', false);
                setMoveRatio([]);
            }*/

            /*if (!stopMoveTime) {
                console.log(111)
                const {x, z} = avatarRef.current.position;
                const {x: pointerX, z: pointerZ} = pointerPosition;
                const deltaX = Math.abs(pointerX - x);
                const deltaZ = Math.abs(pointerZ - z);
                const distance = Math.sqrt((deltaX * deltaX) + (deltaZ * deltaZ));
                setStopMoveTime(rootState.clock.elapsedTime + (distance / (AVATAR_SPEED / Math.abs(moveRatio[1] < moveRatio[0] ? moveRatio[1] : moveRatio[0]))));
                //setState({stopMoveTime: new Date().getTime() + (distance / AVATAR_SPEED * 1000), moveRatio: [normX, normZ]})
            }*/

        } /*else if (stopMoveTime && rootState.clock.elapsedTime >= stopMoveTime) {
            setStopMoveTime(0);
            callback('pointerPosition', {x: 0, y: 0, z: 0});
            callback('pointerVisible', false);
        }*/
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
