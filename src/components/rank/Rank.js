import React from 'react';
import { awsLambdaUrl } from '../../services/api'

class Rank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRank: 1,
            trimmedRank: 1,
            rankSymbol: ''
        }
    }

    componentDidMount() {
        this.fetchRank(this.props.useCount);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.useCount !== this.props.useCount) {
            this.fetchRank(this.props.useCount);
        }
    }

    fetchRank = (useCount) => {
        fetch(`${awsLambdaUrl}?useCount=${useCount}`)
            .then(resp => resp.json())
            .then(data => data.rank)
            .then(rank => this.setState({
                currentRank: rank.currentRank,
                trimmedRank: rank.trimmedRank,
                rankSymbol: rank.rankSymbol,
            }))
            .catch(err => console.log(err))
    };

    render() {
        const { name, useCount } = this.props;
        const { currentRank, rankSymbol } = this.state;
        return (
            <div>
                <div className='white f3'>
                    {`${name}, you have used FaceBrain ${useCount} times`}
                </div>
                <div className='white f3'>
                    {`Your current rank is`}
                </div>
                <div className='f1'>
                    {rankSymbol}
                </div>
            </div>
        );
    }
}

export default Rank;