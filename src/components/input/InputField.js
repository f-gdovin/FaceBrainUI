import React from 'react';
import './InputField.css';

const InputField = ({ onInputChange, onPictureSubmit }) => {
    return (
        <div>
            <p className='f3'>
                {'FaceBrain will detect faces in your picture, paste URL into the input field and hit "Detect"'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center'
                           type='text'
                           placeholder='Paste image URL in here'
                           onChange={onInputChange}/>
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onPictureSubmit}>Detect</button>
                </div>
            </div>
        </div>
    );
};
export default InputField;