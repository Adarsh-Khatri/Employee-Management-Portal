import React, { Component } from 'react';
import { logout } from '../services/AuthService.js'

export default class Logout extends Component {

    componentDidMount() {
        logout();
        
        this.props.history.push("/login")
    }

    render() {
        return ("")
    }
}
