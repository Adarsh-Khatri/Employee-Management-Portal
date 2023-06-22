import React, { Component } from 'react';
import { post } from '../services/HttpService';

export default class NewBill extends Component {

    state = {
        form: { description: '', expensetype: '', amount: '' },
        status: false,
        postedStatus: false
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState(
            (prevState) => ({ form: { ...prevState.form, [input.name]: input.value } }),
            this.checkingValidation
        );
    };

    async postData(url, obj) {
        let { validation } = this.state;
        const { description, expensetype, amount } = this.state.form;
        try {
            if (Object.keys(validation).length === 0 && description && expensetype && amount) {
                await post(url, obj)
                this.setState({ postedStatus: true, status: false })
            } else {
                this.setState({ postedStatus: false })
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { user } = this.props;
        let { form } = this.state;
        this.postData(`/empapp/empbills/${user.empuserid}`, { empuserid: user.empuserid, ...form })
    }

    generatingErrorMsg = (field, obj, key) => {
        console.log(this.state.form);
        if (key == 'amount') {
            if (field == '') {
                obj[key] = key[0].toUpperCase() + key.substring(1) + ' is Required';
            }
            let regex = /^\d*[\.]*\d+$/
            if (field && !regex.test(field)) {
                obj[key] = ' Not a Valid Amount';
            }
        }
        if (key != 'amount') {
            if (field == '') {
                obj[key] = key[0].toUpperCase() + key.substring(1) + ' is Required';
            }
            if (field && field.length < 5) {
                obj[key] = key[0].toUpperCase() + key.substring(1) + ' should have atleast 5 characters';
            }
        }
        return obj;
    }

    checkingValidation = () => {
        const { description, expensetype, amount } = this.state.form;
        let validation = {}
        validation = this.generatingErrorMsg(description, validation, 'description')
        validation = this.generatingErrorMsg(expensetype, validation, 'expensetype')
        validation = this.generatingErrorMsg(amount, validation, 'amount')
        this.setState({ validation })
    }

    isValid = () => {
        const { validation = null, postedStatus } = this.state;
        if (postedStatus) {
            return true;
        }
        return !(validation && Object.keys(validation).length === 0);
    };

    render() {
        let { description, expensetype, amount } = this.state.form;
        let expenses = ["Travel", "Hotel", "Software", "Communication", "Others"];
        let { validation = null, status, postedStatus } = this.state;

        return (
            <div className="container my-3">
                <div className="row bg-light mt-5">
                    <h3 className='text-center'>Enter Details Of The New Bill</h3>
                    {
                        !postedStatus && (
                            <div className='text-center fw-bold'>{status && <span className='text-success'>Displaying Department Details</span>}</div>
                        )
                    }
                    <div className='text-center'>{postedStatus && <span className='text-success fw-bold'>New Bill Has Been Successfully Created</span>}</div>
                    <div className="col-sm-4"></div>
                    <div className='col-sm-8'>
                        <div className="form-group row my-3">
                            <label htmlFor='description' className='col-sm-2 col-form-label fw-bold'>Description:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='description' name="description" placeholder='Enter The Description' value={description} required onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.description}</div>}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor='expensetype' className='col-sm-2 col-form-label fw-bold'>Expense Type:</label>
                            <div className="col-sm-10">
                                <select name="expensetype" id="expensetype" className='form-select' value={expensetype} onChange={(e) => this.handleChange(e)}>
                                    <option value="">Select Expense Type</option>
                                    {
                                        expenses.map((exp, index) => <option key={index} value={exp}>{exp}</option>)
                                    }
                                </select>
                                {validation && <div className='text-center text-danger fw-bold'>{validation.expensetype}</div>}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor='amount' className='col-sm-2 col-form-label fw-bold'>Amount:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='amount' name="amount" placeholder='Enter The Amount' value={amount} required onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.amount}</div>}
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

