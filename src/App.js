import React, {Component} from 'react';
import {Particles} from 'react-particles-js';
import SignIn from './components/auth/SignIn';
import Registration from './components/auth/Registration';
import Navigation from './components/navigation/Navigation';
import InputField from './components/input/InputField';
import OutputImage from './components/output/OutputImage';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import './App.css';

const particlesParameters = {
    particles: {
        number: {
            value: 30,
            density: {
                enable: true,
                value_area: 800,
            }
        },
        move: {
            enable: true,
            speed: 12,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: false,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 800,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 800,
                size: 80,
                duration: 2,
                opacity: 0.8,
                speed: 3
            },
            repulse: {
                distance: 400,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
};

const serverUrl = 'https://whispering-everglades-17138.herokuapp.com';

const initialState = {
    input: '',
    imageUrl: '',
    boxes: [],
    route: 'signin',
    isSignedIn: false,
    user: {
        id: -1,
        name: '',
        email: '',
        useCount: 0,
        joined: '',
    }
};

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    updateUser = (newUser) => {
        this.setState({
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                useCount: newUser.useCount || newUser.usecount,
                joined: newUser.joined,
            },
        })
    };

    onInputChange = (event) => {
        console.log(event.target.value);
        this.setState({
            input: event.target.value
        });
    };

    onPictureSubmit = () => {
        const inputValue = this.state.input;
        this.setState({
            imageUrl: inputValue,
        });
        fetch(`${serverUrl}/imageurl`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: inputValue,
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response) {
                    fetch(`${serverUrl}/image`, {
                        method: 'put',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: this.state.user.id,
                        })
                    })
                        .then(response => response.json())
                        .then(useCount => {
                            this.setState(Object.assign(this.state.user, {useCount: useCount}));
                        })
                        .catch(err => console.log(err));
                }
                this.calculateFaceLocations(response);
            })
            .catch(err => console.log(err));
    };

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState(initialState)
        } else if (route === 'home') {
            this.setState({
                isSignedIn: true,
            })
        }
        this.setState({
            route,
        })
    };

    calculateFaceLocations = (response) => {
        const boxes = [];
        const image = document.getElementById('face_image');
        const width = Number(image.width);
        const height = Number(image.height);

        // get all the faces
        const regions = response.outputs[0].data.regions;
        for (let region of regions) {
            const box = region.region_info.bounding_box;
            boxes.push({
                leftCol: box.left_col * width,
                topRow: box.top_row * height,
                rightCol: width - (box.right_col * width),
                bottomRow: height - (box.bottom_row * height),
            })
        }
        this.setState({
            boxes: boxes,
        });
    };

    render() {
        const {isSignedIn, imageUrl, route, boxes, user} = this.state;
        return (
            <div className="App">
                <Particles className='particles'
                           params={particlesParameters}
                />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                {route === 'home'
                    ? <div>
                        <Logo/>
                        <Rank name={user.name} useCount={user.useCount}/>
                        <InputField onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit}/>
                        <OutputImage faceBoxes={boxes} imageUrl={imageUrl}/>
                    </div>
                    : route === 'signin'
                        ? <SignIn updateUser={this.updateUser} onRouteChange={this.onRouteChange}/>
                        : <Registration updateUser={this.updateUser} onRouteChange={this.onRouteChange}/>
                }
            </div>
        );
    }
}

export default App;
