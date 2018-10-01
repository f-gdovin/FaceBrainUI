import React from 'react';
import './Profile.css';
import { updateProfile } from '../../services/api';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.user.name,
        }
    }

    onNameChange = (event) => {
        this.setState({
            name: event.target.value,
        });
    };

    onSubmitButton = (data) => {
        updateProfile(this.props.user.id, data)(
            (data) => {
                if (data.status === 200 || data.status === 304) {
                    this.props.toggleProfileInfo();
                    this.props.updateUser({ ...this.props.user, ...data })
                }
            }, (err) => console.log(err));
    };

    render() {
        const { toggleProfileInfo, user } = this.props;
        const { name } = this.state;
        return (
            <div className='profile-modal'>
                <article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white'>
                    <main className='pa4 black-80 w-80'>
                        <img
                            src='http://tachyons.io/img/logo.jpg'
                            className='h3 w3 dib' alt='avatar'/>
                        <h1>{ user.email }</h1>
                        <h1>{ name }</h1>
                        <h4>Images submitted: { user.useCount }</h4>
                        <p>Member since: January 1st</p>
                        <hr/>
                        <label className='mt2 fw6' htmlFor='name'>Name:</label>
                        <input className='pa2 ba w-100'
                               onChange={this.onNameChange}
                               placeholder='John'
                               type='text'
                               name='name'
                               id='name'
                               value={name}
                               autoComplete='none'/>
                        <div className='mt4' style={{ display: 'flex', justifyContent: 'space-evenly'}}>
                            <button className='b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20' onClick={ () => this.onSubmitButton({ name }) }>Save</button>
                            <button className='b pa2 grow pointer hover-white w-40 bg-light-red b--black-20' onClick={ toggleProfileInfo }>Cancel</button>
                        </div>
                    </main>
                    <div className='modal-close' onClick={toggleProfileInfo}>&times;</div>
                </article>
            </div>
        )
    }
}

export default Profile;