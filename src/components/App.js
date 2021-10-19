import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Hub from "./Hub";

export default function App() {

    return (
        <Canvas pixelRatio={window.devicePixelRatio}>
            <Suspense fallback={null} >
                <Hub />
            </Suspense >
        </Canvas >
    )
}
