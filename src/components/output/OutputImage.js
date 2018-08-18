import React from 'react';
import './OutputImage.css';

const OutputImage = ({ faceBoxes, imageUrl }) => {
    const boundingBoxes = [];
    let counter = 0;
    for (let faceBox of faceBoxes) {
        boundingBoxes.push(
            <div key={`faceBox-${counter}`} className='bounding-box' style={{
                top: faceBox.topRow,
                right: faceBox.rightCol,
                bottom: faceBox.bottomRow,
                left: faceBox.leftCol
            }}>
            </div>
        );
        counter++;
    }
    const count = faceBoxes.length;
    const number = count === 0 ? 'are no faces' : count === 1 ? 'is just one face' : `are ${count} faces`;
    return (
        <div className='center ma'>
            {imageUrl ?
                <div className='absolute mt5'>
                    <img id='face_image' src={imageUrl} alt='outputImage' width='500px' height='auto'/>
                    {boundingBoxes}
                </div> :
                null
            }
            <div className='countLabel'>
                <p>FaceBrain believes that there {number} in your picture</p>
            </div>
        </div>

    );
};
export default OutputImage;