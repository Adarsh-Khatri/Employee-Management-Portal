import React, { Component } from 'react';
import { post } from '../services/HttpService.jsx'

export default class AddEmployee extends Component {
    state = {
        form: { name: '', email: '', password: '', confirmPassword: '' },
        errors: {},
        isDisabled: null
    };

    handleChange = ({ target }) => {
        const { name, value } = target;
        this.setState((prevState) => ({
            form: { ...prevState.form, [name]: value },
        }));
    };

    postData = async (url, obj) => {
        console.log('POSTING');
        await post(url, obj);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.isValid()) {
            this.setState({ isDisabled: true })
            let { name, email, password } = this.state.form;
            this.postData("/empapp/emps", { name, email, password, "role": "EMPLOYEE" });
            console.log('Form submitted:', { name, email, password, "role": "EMPLOYEE" });
        } else {
            this.setState({ isDisabled: false })
            console.log('Form is not valid');
        }
    };

    validateForm = () => {
        const { name, email, password, confirmPassword } = this.state.form;
        const errors = {};
        if (name.length < 8) {
            errors.name = 'Name should have a minimum of 8 characters';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Email should be a valid email address';
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            errors.password = 'Password should have a minimum of 8 characters, at least 1 lowercase alphabet, 1 uppercase alphabet, and 1 digit';
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
    };

    isValid = () => {
        const errors = this.validateForm();
        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    render() {
        const { name, email, password, confirmPassword } = this.state.form;
        const { errors, isDisabled } = this.state;
        return (
            <div className="container my-3">
                <h1 className="fw-bold text-center">Welcome To Employee Management Portal</h1>
                <div className="row bg-light mt-5 py-5">
                    <h3 className="text-center">Add New Employee</h3>
                    <div className='text-center text-success fw-bold'>{isDisabled && "Employee Successfully Added"}</div>
                    {/* <div className='text-center text-danger fw-bold'>{isDisabled && "Database Error"}</div> */}
                    <div className="col-sm-4"></div>
                    <div className="col-sm-8">
                        <div className="form-group row my-3">
                            <label htmlFor="name" className="col-sm-2 col-form-label fw-bold">
                                Name:
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="Enter the Employee Name"
                                    value={name}
                                    onChange={this.handleChange}
                                    required
                                />
                                {errors.name && (
                                    <div className="text-center text-danger fw-bold">{errors.name}</div>
                                )}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor="email" className="col-sm-2 col-form-label fw-bold">
                                Email ID:
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="Enter The Employee's Email ID"
                                    value={email}
                                    onChange={this.handleChange}
                                    required
                                />
                                {errors.email && (
                                    <div className="text-center text-danger fw-bold">{errors.email}</div>
                                )}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor="password" className="col-sm-2 col-form-label fw-bold">
                                Password:
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Enter The Password"
                                    value={password}
                                    onChange={this.handleChange}
                                    required
                                />
                                {errors.password && (
                                    <div className="text-center text-danger fw-bold">{errors.password}</div>
                                )}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor="confirmPassword" className="col-sm-2 col-form-label fw-bold">
                                Re-enter Password:
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Re-enter The Password"
                                    value={confirmPassword}
                                    onChange={this.handleChange}
                                    required
                                />
                                {errors.confirmPassword && (
                                    <div className="text-center text-danger fw-bold">
                                        {errors.confirmPassword}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="button" className="btn btn-primary my-3" disabled={isDisabled} onClick={this.handleSubmit} >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
