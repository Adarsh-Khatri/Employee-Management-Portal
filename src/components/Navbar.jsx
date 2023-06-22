import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
    render() {
        let { user } = this.props;
        return (
            <div className="container-fluid">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid px-5">
                        <Link className="navbar-brand fw-bold fs-3" to="/">Employee Portal</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul className="navbar-nav fs-5 w-100 d-flex justify-content-between">
                                {
                                    user && user.role === 'ADMIN' &&
                                    (
                                        <li className="nav-item dropdown">
                                            <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Admin
                                            </Link>
                                            <ul className="dropdown-menu">
                                                <li><Link className="dropdown-item" to="/admin/addemp">Add Employees</Link></li>
                                                <li><Link className="dropdown-item" to="/admin/viewemp">View Employees</Link></li>
                                            </ul>
                                        </li>
                                    )
                                }

                                {user && user.role === 'EMPLOYEE' &&
                                    (
                                        <li className="nav-item dropdown">
                                            <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                MyPortal
                                            </Link>
                                            <ul className="dropdown-menu">
                                                <li><Link className="dropdown-item" to="/emp/contact">Contact Details</Link></li>
                                                <li><Link className="dropdown-item" to="/emp/bills">Bills</Link></li>
                                            </ul>
                                        </li>
                                    )
                                }
                            </ul>
                            <li className="nav-item d-flex">
                                {!user &&
                                    (<div className='lead'>
                                        <Link className="nav-link fw-bold text-primary" to="/login">LOGIN</Link>
                                    </div>)
                                }
                                {user &&
                                    (<div className='lead'>
                                        <Link className="nav-link fw-bold text-danger" to="/logout">LOGOUT</Link>
                                    </div>)
                                }
                            </li>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}
