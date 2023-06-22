import React, { Component } from 'react';
import { post } from '../services/HttpService';
import { login } from '../services/AuthService.js';

export default class Login extends Component {

    state = {
        form: { email: '', password: '' }
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState(
            (prevState) => ({ form: { ...prevState.form, [input.name]: input.value } }),
            this.checkingValidation 
        );
    };


    async login(url, obj) {
        try {
            console.log('logging');
            let { data } = await post(url, obj);
            login(data)
            if (data.role === 'ADMIN') {
                this.props.history.push('/admin');
            } else {
                this.props.history.push('/emp');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                let errors = {};
                errors.status = err.response.data;
                this.setState({ errors });
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { form } = this.state;
        this.login("/empapp/loginuser", form)
    }

    checkingValidation = () => {
        const { email, password } = this.state.form;
        let validation = {}
        if (email == '') {
            validation.email = 'Email is Required';
        }
        if (email && email.length < 5) {
            validation.email = 'Email should have atleast 5 characters';
        }
        if (password == '') {
            validation.password = 'Password is Required';
        }
        if (password && password.length < 5) {
            validation.password = 'Password should have atleast 5 characters'
        }
        this.setState({ validation })
    }

    isValid = () => {
        const { validation = null } = this.state;
        return !(validation && Object.keys(validation).length === 0);
    };

    render() {
        let { email, password } = this.state.form;
        let { errors = null, validation = null } = this.state;
        return (
            <div className="container my-3">
                <h1 className='fw-bold text-center'>Welcome To Employee Management Portal</h1>
                <div className="row bg-light mt-5">
                    <h3 className='text-center'>Login</h3>
                    {errors && <div className='text-center text-danger fw-bold'>{errors.status}</div>}
                    <div className="col-sm-4"></div>
                    <div className='col-sm-8'>
                        <div className="form-group row my-3">
                            <label htmlFor='email' className='col-sm-2 col-form-label fw-bold'>Email ID:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='email' name="email" placeholder='Enter Your Email ID' value={email} required onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.email}</div>}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor='password' className='col-sm-2 col-form-label fw-bold'>Password:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='password' name="password" placeholder='Enter Your Password' value={password} required onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.password}</div>}
                            </div>
                        </div>
                    </div>
                    <div className='text-center'>
                        <button type='button' className='btn btn-primary my-3' disabled={this.isValid()} onClick={(e) => this.handleSubmit(e)}>Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}

