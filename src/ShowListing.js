import React from 'react';

class ShowListing extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        // month abbreviation array
        const monthAbbrev = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const datetime = new Date(this.props.show.date + ' ' + this.props.show.time);
        let month = monthAbbrev[datetime.getMonth()];
        let day = datetime.getDate();
        let year = datetime.getFullYear();
        console.log(year);
        return (
            <li className='showList__show' key={this.props.key}>
                <div className="showList__show-cal">
                    <time>{month}</time>
                    <time>{day}</time>
                </div>
                <div className="showList__show-info">
                    <h3>{this.props.show.venue}</h3>
                    <address><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {this.props.show.address}</address>
                    <time><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> {this.props.show.date} {this.props.show.time}</time>
                    <div className="showList__links">
                        <a class="showList__show-event-link" href={this.props.show.eventPage} target='_blank'>View Event Page</a>
                        <a class="showList__show-event-link" href={this.props.show.googleMapLink}  target='_blank'>View on Google Maps</a>
                        {/* if there's a show poster create a link */}
                        {this.props.show.showPoster ? <a class="showList__show-event-link" href={this.props.show.showPoster} target='_blank'>View Show Poster</a> : ''}
                    </div>
                </div>
            </li>
        )
    }
}

export default ShowListing;