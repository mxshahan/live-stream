import React from 'react';

const style = {
    width: "500px",
    height: "300px",
    margin: "20px auto",
    backgroundColor: "#efefef",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    padding: "10px",
}

class MediaReciever extends React.Component {
    hideAuth = () => {
        this.props.media.setState({ bridge: 'connecting' });
    }
    full = () => {
        this.props.media.setState({ bridge: 'full' });
    }
    componentDidMount() {
        const socket = this.props.socket;
        console.log('props', this.props)
        this.setState({ video: this.props.video, audio: this.props.audio });

        socket.on('create', () =>
            this.props.media.setState({ user: 'host', bridge: 'create' }));
        socket.on('full', this.full);
        socket.on('bridge', role => this.props.media.init());
        socket.on('join', () =>
            this.props.media.setState({ user: 'guest', bridge: 'join' }));
        socket.on('approve', ({ message, sid }) => {
            this.props.media.setState({ bridge: 'approve' });
            this.setState({ message, sid });
        });
        socket.emit('find');
        this.props.getUserMedia
            .then(stream => {
                this.localStream = stream;
                this.localStream.getVideoTracks()[0].enabled = this.state.video;
                this.localStream.getAudioTracks()[0].enabled = this.state.audio;
            });
    }
    handleInput = (e) => {
        this.setState({ [e.target.dataset.ref]: e.target.value });
    }
    send = (e) => {
        e.preventDefault();
        this.props.socket.emit('auth', this.state);
        this.hideAuth();
    }
    handleInvitation = (e) => {
        e.preventDefault();
        this.props.socket.emit([e.target.dataset.ref], this.state.sid);
        this.hideAuth();
    }
    getContent = (content) => {
        return { __html: (new Remarkable()).render(content) };
    }
    toggleVideo = () => {
        const video = this.localStream.getVideoTracks()[0].enabled = !this.state.video;
        this.setState({ video: video });
        this.props.setVideo(video);
    }
    toggleAudio = () => {
        const audio = this.localStream.getAudioTracks()[0].enabled = !this.state.audio;
        this.setState({ audio: audio });
        this.props.setAudio(audio);
    }
    handleHangup = () => {
        this.props.media.hangup();
    }
    render() {
        return (
            <div style={style}>
                Hello world MediaReciever
            </div>
        )
    }
}

export default MediaReciever;