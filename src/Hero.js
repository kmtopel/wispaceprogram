import React from 'react';

class Hero extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="hero">
                <div className="hero__content">
                    <h1 className="hero__content-title">{this.props.title}</h1>
                </div>
            </div>
        )
    }
}