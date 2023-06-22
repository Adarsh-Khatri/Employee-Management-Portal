import React, { Component } from 'react';
import { post, get } from '../services/HttpService';

export default class Department extends Component {

    state = {
        details: { manager: '', designation: '', department: '' },
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
        let { id } = this.props.match.params;
        let { data } = await get(`/empapp/empdept/${id}`);
        this.setState({ details: data });
        this.checkStatus(data);
    }

    componentDidMount() {
        this.fetchData();
    }


    async postData(url, obj) {
        let { validation } = this.state;
        const { manager, designation, department } = this.state.details;
        console.log('data posting....', this.state.details);
        const isFormValid = Object.keys(validation || {}).length > 0;

        try {
            if (Object.keys(validation).length === 0 && manager && designation && department) {
                console.log('successfully posted');
                await post(url, obj)
                this.setState({ postedStatus: true, status: false })
            } else {
                this.setState({ postedStatus: false })
                console.log('error occured');
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { details } = this.state;
        let { id } = this.props.match.params;
        this.postData(`/empapp/empdept/${id}`, { empuserid: id, ...details })
    }

    checkStatus = (data) => {
        let { manager, designation, department } = data;
        if (manager && designation && department) {
            this.setState({ status: true })
        } else {
            this.setState({ status: false })
        }
    }

    generatingErrorMsg = (field, obj, key) => {
        if (field == '') {
            obj[key] = (key[0].toUpperCase() + key.substring(1) + ' is Required');
        }
        if (field && key == 'department' && field.length < 2) {
            obj[key] = key[0].toUpperCase() + key.substring(1) + ' should have atleast 2 characters';
        }
        if (field && key != "department" && field.length < 5) {
            obj[key] = key[0].toUpperCase() + key.substring(1) + ' should have atleast 5 characters';
        }
        return obj;
    }

    checkingValidation = () => {
        const { manager, designation, department } = this.state.details;
        let validation = {};
        validation = this.generatingErrorMsg(manager, validation, 'manager');
        validation = this.generatingErrorMsg(designation, validation, 'designation');
        validation = this.generatingErrorMsg(department, validation, 'department');
        this.setState({ validation });
    }

    isValid = () => {
        const { validation = null } = this.state;
        return !(validation && Object.keys(validation).length === 0);
    };

    render() {
        let { manager, designation, department } = this.state.details;
        let { errors = null, validation = null, status, postedStatus } = this.state;
        return (
            <div className="container my-3">
                <h1 className='fw-bold text-center'>Welcome To Employee Management Portal</h1>
                <div className="row bg-light mt-5">
                    <h3 className='text-center'>Department Details of New Employee</h3>
                    {
                        !postedStatus && (
                            <div className='text-center fw-bold'>{status ? <span className='text-success'>Displaying Department Details</span> : <span className='text-danger'>No Department Details Found. Please Enter Them</span>}</div>
                        )
                    }
                    <div className='text-center'>{postedStatus && <span className='text-success fw-bold'>Details Have Been Added Successfully</span>}</div>
                    <div className="col-sm-4"></div>
                    <div className='col-sm-8'>
                        <div className="form-group row my-3">
                            <label htmlFor='department' className='col-sm-2 col-form-label fw-bold'>Department:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='department' name="department" placeholder="Enter The Employee's Department" value={department} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.department}</div>}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor='designation' className='col-sm-2 col-form-label fw-bold'>Designation:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='designation' name="designation" placeholder="Enter The Employee's Designation" value={designation} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.designation}</div>}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor='manager' className='col-sm-2 col-form-label fw-bold'>Manager's Name:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='manager' name="manager" placeholder="Enter The Manager's Name" value={manager} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.manager}</div>}
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

