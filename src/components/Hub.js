import React, { Component } from 'react'
import Terrain from "./Terrain";
import Avatar from "./Avatar";
import Pointer from "./Pointer";


export default class Hub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            terrainRef: null,
            avatarRef: null,
            pointerRef: null,
            pointerPosition: {x: 0, y: 0, z: 0}
        }
    }

    render() {
        const {terrainRef, pointerRef, pointerPosition} = this.state;
        return (
            <>
                {/***Свет*/}
                <ambientLight color={0xffffff} intensity={0.8} />
                <directionalLight position={[10, 10, 10]} color={0xffffff} intensity={1} />

                {/***Указатель пути для персонажа*/}
                <Pointer pointerPosition={pointerPosition}
                         callback={this.stateCallback}/>

                {/***Террейн*/}
                {pointerRef && pointerRef.current
                    ? <Terrain callback={this.stateCallback}
                               pointer={pointerRef.current}/>
                    : null
                }


                {/***Персонаж*/}
                {terrainRef && terrainRef.current
                    ? <Avatar terrain={terrainRef.current}
                              pointer={pointerRef.current}
                              pointerPosition={pointerPosition}
                              callback={this.stateCallback}/>
                    : null
                }


            </>
        )
    }

    stateCallback = (name, value) => {
        this.setState({[name]: value});
    }

}
