import React, { Component } from 'react'
import {
    OrbitControls,
    PerspectiveCamera
} from "@react-three/drei";
import Terrain from "./Terrain";
import Avatar from "./Avatar";
import Pointer from "./Pointer";
import {AVATAR_HEIGHT} from "../utils/constants";


export default class Hub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: {x: 0, y: 0, z: 0},
            pointer: {x: 0, y: 0, z: 0, visible: false},
            terrainRef: null
        }
    }

    render() {
        const {terrainRef} = this.state;
        const {x: avatarX, y: avatarY, z: avatarZ} = this.state.avatar;
        const {x: pointerX, y: pointerY, z: pointerZ, visible} = this.state.pointer;
        return (
            <>
                {/***Камера*/}
                <PerspectiveCamera
                    position={[0, 100, 55]}
                    near={0.01}
                    far={10000}
                    makeDefault
                />
                <OrbitControls screenSpacePanning={false} target={[avatarX, avatarY + AVATAR_HEIGHT, avatarZ]} />

                {/***Свет*/}
                <ambientLight color={0xffffff} intensity={0.8} />
                <directionalLight position={[10, 10, 10]} color={0xffffff} intensity={1} />

                {/***Персонаж*/}
                <Avatar
                    terrain={terrainRef}
                    callback={this.avatarCallback}
                    pointerVisible={visible}
                    pointerX={pointerX}
                    pointerZ={pointerZ}
                />

                {/***Указатель пути для персонажа*/}
                <Pointer pointerX={pointerX} pointerY={pointerY} pointerZ={pointerZ} pointerVisible={visible}/>

                {/***Террейн*/}
                <Terrain clickCallback={this.terrainClickCallback} refCallback={this.terrainRefCallback}/>
            </>
        )
    }

    terrainClickCallback = (x, y, z) => {
        this.setState((prevState) => ({
            ...prevState,
            pointer: { x, y, z, visible: true }
        }));
    }

    terrainRefCallback = (ref) => {
        this.setState({terrainRef: ref});
    }

    avatarCallback = (x, y, z) => {
        this.setState({avatar: {x, y, z}});
    }

}
