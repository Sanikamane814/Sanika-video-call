import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import { Badge, IconButton } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Form, Container, Card, Alert } from 'react-bootstrap';
// import server from '../environment';

const server_url = "http://localhost:8000";

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(true);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(3);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    const videoRef = useRef([])
    let [videos, setVideos] = useState([])
    const [validated, setValidated] = useState(false);
    const [usernameError, setUsernameError] = useState('');

    useEffect(() => {
        console.log("HELLO")
        getPermissions();
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        if (form.checkValidity() === false || !username.trim()) {
            event.stopPropagation();
            setUsernameError(username.trim() ? '' : 'Username is required');
            setValidated(true);
            return;
        }
        
        setAskForUsername(false);
        getMedia();
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        if (validated) {
            setUsernameError(e.target.value.trim() ? '' : 'Username is required');
        }
    };

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);
        }
    }, [video, audio])

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()
        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
    }
    
    let handleAudio = () => {
        setAudio(!audio)
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    
    let closeChat = () => {
        setModal(false);
    }
    
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");
    }

    return (
        <Container fluid className="p-0 min-vh-100 bg-dark text-white">
            {askForUsername === true ? (
                <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                    <Card className="p-4 border-0 shadow-lg" style={{ 
                        width: '100%', 
                        maxWidth: '450px',
                        background: 'rgba(30, 30, 42, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px'
                    }}>
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary mb-3">Enter Video Lobby</h2>
                                <p className="text-muted">Enter your details to join the meeting</p>
                            </div>
                            
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group className="mb-4" controlId="usernameValidation">
                                    <Form.Label className="fw-bold text-light">Username</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        value={username}
                                        onChange={handleUsernameChange}
                                        placeholder="Enter your name"
                                        className="py-2 px-3 bg-dark text-light border-secondary"
                                        style={{ borderRadius: '8px' }}
                                    />
                                    {usernameError && (
                                        <Form.Control.Feedback type="invalid" className="d-block">
                                            {usernameError}
                                        </Form.Control.Feedback>
                                    )}
                                    <Form.Text className="text-muted">
                                        This name will be visible to other participants
                                    </Form.Text>
                                </Form.Group>
                                
                                <Button 
                                    variant="primary" 
                                    type="submit"
                                    className="w-100 py-2 fw-bold"
                                    style={{ 
                                        borderRadius: '8px',
                                        fontSize: '1.1rem',
                                        background: 'linear-gradient(135deg, #4a80f0 0%, #3a70e0 100%)',
                                        border: 'none'
                                    }}
                                >
                                    Join Meeting
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    <div className="mt-4">
                        <video 
                            ref={localVideoref} 
                            autoPlay 
                            muted 
                            className="rounded shadow-lg"
                            style={{ 
                                width: '300px', 
                                border: '3px solid #4a80f0',
                                transform: 'perspective(500px) rotateY(5deg)'
                            }}
                        ></video>
                    </div>
                </div>
            ) : (
                <div className="position-relative vh-100">
                    {/* Enhanced Chat Modal */}
                    <Modal 
                        show={showModal} 
                        onHide={closeChat} 
                        centered
                        contentClassName="border-0 shadow-lg"
                        style={{ backdropFilter: 'blur(5px)' }}
                    >
                        <Modal.Header className="bg-primary text-white border-0">
                            <Modal.Title className="fw-bold">
                                <ChatIcon className="me-2" />
                                Meeting Chat
                            </Modal.Title>
                            <button 
                                type="button" 
                                className="btn-close btn-close-white" 
                                onClick={closeChat}
                            />
                        </Modal.Header>
                        <Modal.Body 
                            className="p-0" 
                            style={{ 
                                height: '400px', 
                                backgroundColor: '#f8f9fa'
                            }}
                        >
                            <div className="d-flex flex-column h-100">
                                <div 
                                    className="flex-grow-1 p-3 overflow-auto"
                                    style={{ minHeight: '300px' }}
                                >
                                    {messages.length > 0 ? (
                                        messages.map((item, index) => (
                                            <div 
                                                key={index} 
                                                className={`mb-3 d-flex ${item.sender === username ? 'justify-content-end' : 'justify-content-start'}`}
                                            >
                                                <div 
                                                    className={`p-3 rounded-3 ${item.sender === username ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                                                    style={{ maxWidth: '80%' }}
                                                >
                                                    <div className="fw-bold small mb-1">
                                                        {item.sender === username ? 'You' : item.sender}
                                                    </div>
                                                    <div>{item.data}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="d-flex justify-content-center align-items-center h-100">
                                            <div className="text-center text-muted">
                                                <ChatIcon style={{ fontSize: '3rem', opacity: 0.3 }} />
                                                <p className="mt-2">No messages yet</p>
                                                <small>Start the conversation</small>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-3 border-top">
                                    <Form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (message.trim()) {
                                            sendMessage();
                                        }
                                    }}>
                                        <div className="input-group">
                                            <Form.Control
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Type your message..."
                                                className="border-end-0 py-2 px-3"
                                                style={{ borderRadius: '20px 0 0 20px' }}
                                            />
                                            <button 
                                                className="btn btn-primary"
                                                type="submit"
                                                disabled={!message.trim()}
                                                style={{ 
                                                    borderRadius: '0 20px 20px 0',
                                                    borderLeft: 'none'
                                                }}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* Video Conference Area */}
                    <div className="position-relative h-100">
                        {/* Local Video */}
                        <div className="position-absolute bottom-0 end-0 mb-5 me-3" style={{ width: '200px', zIndex: 10 }}>
                            <video 
                                ref={localVideoref} 
                                autoPlay 
                                muted 
                                className="rounded shadow-lg"
                                style={{ 
                                    width: '100%', 
                                    border: '2px solid #4a80f0',
                                    boxShadow: '0 4px 12px rgba(74, 128, 240, 0.3)'
                                }}
                            ></video>
                        </div>

                        {/* Remote Videos */}
                        <div className="d-flex flex-wrap justify-content-center align-items-center h-100 p-3">
                            {videos.map((video) => (
                                <div key={video.socketId} className="m-2" style={{ width: '45%' }}>
                                    <video
                                        data-socket={video.socketId}
                                        ref={ref => {
                                            if (ref && video.stream) {
                                                ref.srcObject = video.stream;
                                            }
                                        }}
                                        autoPlay
                                        className="rounded shadow-lg"
                                        style={{ 
                                            width: '100%', 
                                            border: '2px solid #4a80f0',
                                            boxShadow: '0 4px 12px rgba(74, 128, 240, 0.3)'
                                        }}
                                    ></video>
                                </div>
                            ))}
                        </div>

                        {/* Control Bar */}
                        <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-90 py-3 border-top border-secondary">
                            <div className="d-flex justify-content-center">
                                <IconButton 
                                    onClick={handleVideo} 
                                    className="mx-2"
                                    style={{ 
                                        backgroundColor: video ? '#4a80f0' : '#6c757d',
                                        color: 'white'
                                    }}
                                >
                                    {video ? <VideocamIcon /> : <VideocamOffIcon />}
                                </IconButton>
                                <IconButton 
                                    onClick={handleAudio} 
                                    className="mx-2"
                                    style={{ 
                                        backgroundColor: audio ? '#4a80f0' : '#6c757d',
                                        color: 'white'
                                    }}
                                >
                                    {audio ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>
                                <IconButton 
                                    onClick={handleEndCall} 
                                    className="mx-2"
                                    style={{ 
                                        backgroundColor: '#dc3545',
                                        color: 'white'
                                    }}
                                >
                                    <CallEndIcon />
                                </IconButton>
                                {screenAvailable && (
                                    <IconButton 
                                        onClick={handleScreen} 
                                        className="mx-2"
                                        style={{ 
                                            backgroundColor: screen ? '#4a80f0' : '#6c757d',
                                            color: 'white'
                                        }}
                                    >
                                        {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                                    </IconButton>
                                )}
                                <Badge badgeContent={newMessages} color="error" overlap="circular">
                                    <IconButton 
                                        onClick={openChat} 
                                        className="mx-2"
                                        style={{ 
                                            backgroundColor: '#6c757d',
                                            color: 'white'
                                        }}
                                    >
                                        <ChatIcon />
                                    </IconButton>
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    )
}
