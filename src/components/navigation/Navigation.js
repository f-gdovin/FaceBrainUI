import React from 'react';
import ProfileIcon from '../profile/ProfileIcon';

const Navigation = ({ isSignedIn, onRouteChange, toggleProfileInfo }) => {
    if (isSignedIn) {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <ProfileIcon onRouteChange={onRouteChange} toggleProfileInfo={toggleProfileInfo} />
            </nav>
        )
    } else {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p onClick={() => onRouteChange('signin')} className='f3 link bim black underline pa3 pointer'>Sign In</p>
                <p onClick={() => onRouteChange('register')} className='f3 link bim black underline pa3 pointer'>Register</p>
            </nav>
        );
    }
};
export default Navigation;