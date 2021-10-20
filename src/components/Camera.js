import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {AVATAR_HEIGHT} from "../utils/constants";
import React, {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";

export default function Camera({avatar, callback}) {
    const ref = useRef();

    useEffect(() => {
        callback('cameraRef', ref);
    }, [ref]);

    useEffect((q) => {
        console.log(q)
    }, [avatar.position.x, avatar.position.y, avatar.position.z])

    useFrame((rootState, time) => {
       //ref.current.position.x += 0.1
        //ref.current.position.y += avatar.position.y
        //ref.current.position.z += avatar.position.z
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
            <OrbitControls screenSpacePanning={false} target={[avatar.position.x, avatar.position.y + AVATAR_HEIGHT, avatar.position.z]}/>
        </>
    );
}
