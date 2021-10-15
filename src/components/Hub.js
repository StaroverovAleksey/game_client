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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.avatar.y !== this.state.avatar.y) {
            setInterval(() => {
                const {x, y, z} = this.state.avatar;
                const avatar = {x: x - 0.05, y, z: z - 0.05};
                console.log(avatar);
                this.setState({avatar})
            }, 50);
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
                    position={[200, 200, 200]}
                    near={0.01}
                    far={10000}
                    makeDefault
                />
                <OrbitControls screenSpacePanning={false} target={[avatarX, avatarY + AVATAR_HEIGHT, avatarZ]} />

                {/***Свет*/}
                <ambientLight color={0xffffff} intensity={0.8} />
                <directionalLight position={[10, 10, 10]} color={0xffffff} intensity={1} />

                {/***Персонаж*/}
                <Avatar avatarX={avatarX} avatarZ={avatarZ} terrain={terrainRef} callback={this.avatarCallback}/>

                {/***Указатель пути для персонажа*/}
                <Pointer x={pointerX} y={pointerY} z={pointerZ} visible={visible}/>

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

    avatarCallback = (y) => {
        const {x, z} = this.state.avatar;
        this.setState({avatar: {x, y, z}});
    }

}
