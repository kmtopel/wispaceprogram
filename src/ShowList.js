import React from 'react';
import ShowListing from './ShowListing.js';
import featuredImg from './images/wsp_logo.jpeg';

class ShowList extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="showList" >
                <div>
                    <h2>Upcoming Shows</h2>
                    <ul>
                        {this.props.shows.map((show, i) => (
                            <ShowListing show={show} key={i} />
                        ))}
                    </ul>
                </div>
               
            </div>
        )
    }
}

export default ShowList;
