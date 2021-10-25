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

export default function Avatar({terrain, pointer, pointerPosition, callback}) {

    const getZPosition = () => {
        const rayCaster = new THREE.Raycaster();
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
    const [cameraPosition, setCameraPosition] = useState({x: 0, y: 0, z: 0});

    const startY = useMemo(getZPosition, []);
    const geometry = useMemo(() => <boxBufferGeometry args={[AVATAR_WIDTH, AVATAR_HEIGHT, AVATAR_DEPTH]}/>, []);
    const material = useMemo(() => <meshStandardMaterial color={'red'} />, []);

    useEffect(() => {
        callback('avatarRef', avatarRef);
    }, [avatarRef]);

    useEffect(() => {
        if (pointer.visible) {
            const {x: avatarX, z: avatarZ} = avatarRef.current.position;
            const {x: pointerX, z: pointerZ} = pointerPosition;
            const deltaX = pointerX - avatarX;
            const deltaZ = pointerZ - avatarZ;
            const [normX, normZ] = normalize(deltaX, deltaZ);
            setDeltaMove([deltaX, deltaZ]);
            setMoveRatio([normX, normZ])
        }
    }, [pointerPosition]);

    useFrame((rootState, time) => {

        controlRef.current.update()

        if (pointer.visible && moveRatio.length) {
            const {x: avatarX, z: avatarZ} = avatarRef.current.position;
            const {x: pointerX, z: pointerZ} = pointerPosition;

            let deltaX = time * moveRatio[0] * AVATAR_SPEED;
            let deltaZ = time * moveRatio[1] * AVATAR_SPEED;

            if (
                   (deltaMove[0] > 0 && deltaMove[1] > 0) && (avatarX + deltaX > pointerX || avatarZ + deltaZ > pointerZ)
                || (deltaMove[0] > 0 && deltaMove[1] < 0) && (avatarX + deltaX > pointerX || avatarZ + deltaZ < pointerZ)
                || (deltaMove[0] < 0 && deltaMove[1] > 0) && (avatarX + deltaX < pointerX || avatarZ + deltaZ > pointerZ)
                || (deltaMove[0] < 0 && deltaMove[1] < 0) && (avatarX + deltaX < pointerX || avatarZ + deltaZ < pointerZ)
            ) {
                deltaX = pointerX - avatarX;
                deltaZ = pointerZ - avatarZ;
                pointer.visible = false;
                setMoveRatio([]);
            }

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


    const onChangeHandler = (event) => {
        const raycaster = new THREE.Raycaster();
        let dir = new THREE.Vector3();
        let intersects = [];

        console.log(controlRef.current)

        //dir.subVectors(cameraRef.current.position, controlRef.current.target).normalize();

        raycaster.set(
            controlRef.current.target,
            dir.subVectors(cameraRef.current.position, controlRef.current.target).normalize()
        );
        intersects = raycaster.intersectObject(terrain, false);

        if (intersects.length > 0) {
            console.log(222)

            /*if (
                intersects[0].distance < controlRef.current.target.distanceTo(cameraRef.current.position)
            ) {
                //camera.position.copy(intersects[0].point)
                cameraRef.current.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
            }*/



            //console.log(intersects[0].point)
            //cameraRef.current.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
            cameraRef.current.position.copy(intersects[0].point)
            //console.log(cameraRef.current.position)
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
                    minDistance={3}
                    maxDistance={100}
                    rotateSpeed={0.5}
                    mouseButtons ={{
                        LEFT: null,
                        MIDDLE: THREE.MOUSE.DOLLY,
                        RIGHT: THREE.MOUSE.ROTATE
                    }}
                    target={[avatarRef.current.position.x, avatarRef.current.position.y, avatarRef.current.position.z]}
                    onChange={onChangeHandler}
                />
            :null}
        </>
    )
}
