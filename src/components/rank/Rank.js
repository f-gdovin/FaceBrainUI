import React from 'react';

const Rank = ({ name, useCount }) => {
    return (
        <div>
            <div className='white f3'>
                {`${name}, you have used FaceBrain ${useCount} times`}
            </div>
        </div>
    );
};
export default Rank;