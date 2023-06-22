import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './Navbar';
import AddEmployee from './AddEmployee';
import ViewEmployees from './ViewEmployees';
import Admin from './Admin';
import Contact from './Contact';
import Bills from './Bills';
import TravelBill from './TravelBill';
import HotelBill from './HotelBill';
import Employee from './Employee';
import Login from './Login';
import Logout from './Logout';
import Department from './Department';
import NotFound from './NotFound';
import { getBillId, getUser } from '../services/AuthService';

export default class MainComponent extends Component {
    render() {
        const user = getUser()
        const bill = getBillId()
        return (
            <div className="container-fluid">
                <Navbar user={user} />
                <Switch>

                    <Route path="/admin/addemp" render={props => user ? (user.role === 'ADMIN' ? <AddEmployee {...props} /> : <Redirect to="/notfound" />) : <Redirect to="login" />} />

                    <Route path="/admin/viewemp/:id" render={props => user ? (user.role === 'ADMIN' ? <Department {...props} /> : <Redirect to="/notfound" />) : <Redirect to="login" />} />

                    <Route path="/admin/viewemp" render={props => user ? (user.role === 'ADMIN' ? <ViewEmployees {...props} /> : <Redirect to="/notfound" />) : <Redirect to="login" />} />

                    <Route path="/admin" render={props => user ? (user.role === 'ADMIN' ? <Admin {...props} /> : <Redirect to="/notfound" />) : <Redirect to="login" />} />

                    <Route path="/emp/contact" render={props => user ? <Contact {...props} user={user} /> : <Redirect to="/login" />} />

                    <Route path="/emp/bills" render={props => user ? <Bills {...props} user={user} /> : <Redirect to="/login" />} />

                    <Route path="/emp/travelbill/:id" render={props => user ? <TravelBill {...props} user={user} bill={bill} /> : <Redirect to="/login" />} />

                    <Route path="/emp/hotelbill/:id" render={props => user ? <HotelBill {...props} user={user} bill={bill} /> : <Redirect to="/login" />} />

                    <Route path="/emp" render={props => user ? <Employee {...props} user={user} /> : <Redirect to="/login" />} />

                    <Route path="/login" component={Login} />

                    <Route path="/logout" component={Logout} />

                    <Route path="/notfound" component={NotFound} />

                    <Redirect from="/" to="/login" />

                </Switch>
            </div>
        )
    }
}
