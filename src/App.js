import React, { Component } from 'react';
import Particles from 'react-particles-js';

import InputField from './components/input/InputField';
import Logo from './components/logo/Logo';
import Modal from './components/modal/Modal';
import Navigation from './components/navigation/Navigation';
import OutputImage from './components/output/OutputImage';
import Profile from './components/profile/Profile';
import Rank from './components/rank/Rank';
import Registration from './components/auth/Registration';
import SignIn from './components/auth/SignIn';
import { signInWithAuthToken, getProfile, getFacesForImage, updateUseCount, getSessionToken } from './services/api';

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

const initialState = {
    input: '',
    imageUrl: '',
    boxes: [],
    route: 'signin',
    isSignedIn: false,
    isProfileOpen: false,
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

    componentDidMount() {
        const token = getSessionToken();
        if (token) {
            signInWithAuthToken(token)((data) => {
                if (data && data.id) {
                    getProfile(data.id)((user) => {
                        if (user && user.email) {
                            this.updateUser(user);
                            this.onRouteChange('home');
                        }
                    }, (err) => console.log(err))
                }
            }, (err) => console.log(err));
        }
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
        this.setState({
            input: event.target.value
        });
    };

    onPictureSubmit = () => {
        const inputValue = this.state.input;

        this.setState({
            imageUrl: inputValue,
        });
        getFacesForImage(inputValue)(
            (data) => {
                if (data) {
                    updateUseCount(this.state.user.id)(
                        (useCount) => {
                            this.setState(Object.assign(this.state.user, {useCount: useCount}));
                        },
                        (err) => console.log(err));
                    this.calculateFaceLocations(data);
                }
            },
            (err) => console.log(err));
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
        if (response && response.outputs) {
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
        }
    };

    toggleProfileInfo = () => {
        this.setState(prevState => ({
            ...prevState,
           isProfileOpen: !prevState.isProfileOpen,
        }))
    };

    render() {
        const {isSignedIn, isProfileOpen, imageUrl, route, boxes, user} = this.state;
        return (
            <div className="App">
                <Particles className='particles'
                           params={particlesParameters}
                />
                <Navigation isSignedIn={ isSignedIn } onRouteChange={ this.onRouteChange } toggleProfileInfo={ this.toggleProfileInfo } />
                { isProfileOpen &&
                    <Modal>
                        <Profile user={ user } updateUser={ this.updateUser } toggleProfileInfo={ this.toggleProfileInfo } />
                    </Modal>
                }
                { route === 'home'
                    ? <div>
                        <Logo/>
                        <Rank name={ user.name } useCount={ user.useCount } />
                        <InputField onInputChange={ this.onInputChange } onPictureSubmit={ this.onPictureSubmit } />
                        <OutputImage faceBoxes={ boxes } imageUrl={ imageUrl } />
                    </div>
                    : route === 'signin'
                        ? <SignIn updateUser={ this.updateUser } onRouteChange={ this.onRouteChange } />
                        : <Registration updateUser={ this.updateUser } onRouteChange={ this.onRouteChange } />
                }
            </div>
        );
    }
}

export default App;
