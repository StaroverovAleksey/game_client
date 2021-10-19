import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {AVATAR_HEIGHT} from "../utils/constants";
import React, {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";

export default function Camera({avatar, callback}) {
    const ref = useRef();

    useEffect(() => {
        callback('cameraRef', ref);
    }, [ref]);

    useFrame((rootState, time) => {

    })

    return (
        <>
            <PerspectiveCamera
                ref={ref}
                position={[0, 100, 55]}
                near={0.01}
                far={10000}
                makeDefault
            />
            <OrbitControls screenSpacePanning={false} target={[avatar.position.x, avatar.position.y + AVATAR_HEIGHT, avatar.position.z]} />
        </>
    );
}
