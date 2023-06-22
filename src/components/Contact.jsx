import React, { Component } from 'react';
import { post, get } from '../services/HttpService';

export default class Contact extends Component {

    state = {
        details: { mobile: '', address: '', city: '', country: '', pincode: '' },
        status: false,
        postedStatus: false
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState(
            (prevState) => ({ details: { ...prevState.details, [input.name]: input.value } }),
            this.checkingValidation
        );
    };

    fetchData = async () => {
        try {
            let { user } = this.props;
            let { data } = await get(`/empapp/empcontact/${user.empuserid}`);
            this.setState({ details: data });
            this.checkStatus(data);
        } catch (error) {
            console.log(error.message);
        }

    }

    componentDidMount() {
        this.fetchData();
    }


    async postData(url, obj) {
        let { validation } = this.state;
        const { mobile, address, city, country, pincode } = this.state.details;
        try {
            if (Object.keys(validation).length === 0 && mobile && address && city && country && pincode) {
                console.log('successfully posted');
                await post(url, obj)
                this.setState({ postedStatus: true, status: false })
            } else {
                this.setState({ postedStatus: false })
                console.log('error occured');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { details } = this.state;
        let { user } = this.props;
        this.postData(`/empapp/empcontact/${user.empuserid}`, { empuserid: user.empuserid, ...details })
    }

    checkStatus = (data) => {
        let { mobile, address, city, country, pincode } = data;
        if (mobile && address && city && country && pincode) {
            this.setState({ status: true })
        } else {
            this.setState({ status: false })
        }
    }

    generatingErrorMsg = (field, obj, key) => {
        if (field == '') {
            obj[key] = (key[0].toUpperCase() + key.substring(1) + ' is Required');
        }
        if (key != 'mobile') {
            if (field && field.length < 5) {
                obj[key] = key[0].toUpperCase() + key.substring(1) + ' should have atleast 5 characters';
            }
        }
        if (field && key == 'mobile') {
            let regex = /^[\+\-\s\d]{10,}$/;
            if (!regex.test(field)) {
                obj[key] = 'Mobile number has at least 10 characters. Allowed are 0-9,+,- and space'
            }
        }
        return obj;
    }

    checkingValidation = () => {
        const { mobile, country, pincode } = this.state.details;
        let validation = {}
        validation = this.generatingErrorMsg(mobile, validation, 'mobile')
        validation = this.generatingErrorMsg(country, validation, 'country')
        validation = this.generatingErrorMsg(pincode, validation, 'pincode')
        this.setState({ validation })
    }

    render() {
        let { mobile, address, city, country, pincode } = this.state.details;
        let { validation = null, status, postedStatus } = this.state;
        console.log(this.state.details);
        console.log(validation);
        return (
            <div className="container my-3">
                <h1 className='fw-bold text-center'>Welcome To Employee Management Portal</h1>
                <div className="row bg-light mt-5">
                    <h3 className='text-center'>Department Details of New Employee</h3>
                    {
                        !postedStatus && (
                            <div className='text-center fw-bold'>{status ? <span className='text-success'>Displaying Contact Details</span> : <span className='text-primary'>No Contact Details Found. Please Enter Them</span>}</div>
                        )
                    }
                    <div className='text-center'>{postedStatus && <span className='text-success fw-bold'>Details Have Been Added Successfully</span>}</div>
                    <div className="col-sm-4"></div>
                    <div className='col-sm-8'>
                        <div className="form-group row my-3">
                            <label htmlFor='mobile' className='col-sm-2 col-form-label fw-bold'>Mobile:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='mobile' name="mobile" placeholder="Enter The Employee's Mobile" value={mobile} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.mobile}</div>}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor='address' className='col-sm-2 col-form-label fw-bold'>Address:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='address' name="address" placeholder="Enter The Employee's Address" value={address} disabled={status} onChange={(e) => this.handleChange(e)} />
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor='city' className='col-sm-2 col-form-label fw-bold'>City:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='city' name="city" placeholder="Enter The Manager's City" value={city} required disabled={status} onChange={(e) => this.handleChange(e)} />
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor='country' className='col-sm-2 col-form-label fw-bold'>Country:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='country' name="country" placeholder="Enter The Manager's Country" value={country} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.country}</div>}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor='pincode' className='col-sm-2 col-form-label fw-bold'>PinCode:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='pincode' name="pincode" placeholder="Enter The Manager's Pincode" value={pincode} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.pincode}</div>}
                            </div>
                        </div>
                    </div>
                    <div className='text-center'>
                        <button type='button' className='btn btn-primary my-3' disabled={status ? status : postedStatus} onClick={(e) => this.handleSubmit(e)}>Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}

