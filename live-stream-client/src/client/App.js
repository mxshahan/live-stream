import React from 'react';
import ReactDOM from 'react-dom';
import MediaContainer from './container/media.container';
import MediaReciever from './container/media.reciever';
import io from 'socket.io-client';
const socket = io.connect('https://live-stream-sh.herokuapp.com/');

export default class App extends React.Component{
    constructor(props) {
        super(props);
        this.socket = socket;
    }

    state = {
        data: [],
        media: false
    }

    loadCamara = () => {
        console.log('Succesfull');
    }

    failCamara = () => {
        console.log('Fail Camara');
    }

    captureVideo = (e) => {
        this.getUserMedia = navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }, this.loadCamara, this.failCamara)
        .catch((e) => {
            alert('getUserMedia() error: ' + e.name);
        });
        
        this.setState({
            media: true
        })
    }
    
    // componentWillMount() {
    //     socket.on('emit', msg => {
    //         console.log('asdf',msg);
    //         const ms = this.state.data.concat(msg);
    //         this.setState({
    //             data: Object.assign(this.state.data, ms)
    //         })
    //     })
    // }

    // sendMsg = (e) => {
    //     e.preventDefault();

    //     const msg = this.refs.msg.value;
    //     const ms = this.state.data.concat(msg);
    //     this.setState({
    //         data: Object.assign(this.state.data, ms)
    //     })
    //     socket.emit('stream', msg)
    // }

    render() {
        return (
            <div>
                <div>
                    {this.state.data.map((val, key) => {
                        return <p key={key}>{val}</p>
                    })}
                </div>
                <input type="text" ref="msg"/>
                <button onClick={this.sendMsg}>Send</button>
                <button onClick={this.captureVideo}>Camara</button>
                {this.state.media &&
                <MediaContainer 
                    media={media => this.media = media} 
                    socket={this.socket} 
                    getUserMedia={this.getUserMedia}
                />
                }

                {/* <MediaReciever socket={this.socket} media={this.media} getUserMedia={this.getUserMedia}/> */}
            </div>
        )
    }
}
