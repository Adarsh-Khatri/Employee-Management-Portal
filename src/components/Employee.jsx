import React, { Component } from 'react'

export default class Employee extends Component {
    render() {
        let { user } = this.props;
        return (
            <div className="container-fluid text-center">
                <h1 className='fw-bold '>Welcome {user.name} to the Employee Management Portal</h1>
            </div>
        )
    }
}
