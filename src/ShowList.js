import React from 'react';

class ShowList extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div class="showList">
                <h2>Upcoming Shows</h2>
                <ul>
                    {
                        this.props.shows.map((show, i) => {
                            return (
                                <li class='showList__show' key={i}>
                                    <div class="showList__show-info">
                                        <div>
                                            <time>{show.date}</time>
                                            <time>{show.time}</time>
                                            <p>{show.cover}</p>
                                        </div>
                                        <div>
                                            <h3>{show.venue}</h3>
                                            <a href={show.googleMapLink} target='_blank'><address><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {show.address}</address>
                                            <a class="showList__show-event-link" href={show.eventPage} target='_blank'>Event Page</a>
                                            </a>
                                        </div>
                                    </div>
                                    {/* <div class="showList__show-img">
                                        <img src={show.showPoster} alt="Show Poster" />
                                    </div> */}
                                </li>
                            )
                        }) 
                    }
                </ul>
            </div>
        )
    }
}

export default ShowList;