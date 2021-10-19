import React, { Component } from 'react'
import Terrain from "./Terrain";
import Avatar from "./Avatar";
import Pointer from "./Pointer";
import Camera from "./Camera";


export default class Hub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            terrainRef: null,
            avatarRef: null,
            pointerRef: null,
            pointerVisible: false,
            pointerPosition: {x: 0, y: 0, z: 0}
        }
    }

    render() {
        const {terrainRef, avatarRef, pointerRef, pointerVisible, pointerPosition} = this.state;
        return (
            <>
                {/***Свет*/}
                <ambientLight color={0xffffff} intensity={0.8} />
                <directionalLight position={[10, 10, 10]} color={0xffffff} intensity={1} />

                {/***Террейн*/}
                <Terrain callback={this.stateCallback}/>

                {/***Персонаж*/}
                {terrainRef && terrainRef.current
                    ? <Avatar
                        terrain={terrainRef.current}
                        pointerVisible={pointerVisible}
                        pointerPosition={pointerPosition}
                        callback={this.stateCallback}
                    />
                    : null
                }

                {/***Камера*/}
                {avatarRef && avatarRef.current
                    ? <Camera avatar={avatarRef.current} callback={this.stateCallback}/>
                    : null
                }

                {/***Указатель пути для персонажа*/}
                {pointerVisible
                    ? <Pointer pointerPosition={pointerPosition}/>
                    : null
                }
            </>
        )
    }

    stateCallback = (name, value) => {
        this.setState({[name]: value});
    }

}
