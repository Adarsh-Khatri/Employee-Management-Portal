import React, { Component } from 'react';
import { post, get } from '../services/HttpService';

export default class HotelBill extends Component {

    state = {
        form: { staystartdate: '', stayenddate: '', hotel: '', city: '', corpbooking: '' },
        dates: { startDay: '', startMonth: '', startYear: '', endDay: '', endMonth: '', endYear: '' },
        status: false,
        postedStatus: false
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState(
            (prevState) => ({ form: { ...prevState.form, [input.name]: input.type == 'checkbox' ? input.checked : input.value } }),
            this.checkingValidation
        );
    }

    handleDayChange = ({ currentTarget: input }) => {
        this.setState(
            (prevState) => ({ dates: { ...prevState.dates, [input.name]: input.value } }),
            this.checkingValidation
        )
    }

    fetchData = async () => {
        let { id } = this.props.match.params;
        let { bill } = this.props;
        let { data } = await get(`/empapp/hotelbill/${id}/${bill}`);
        this.setState({ form: data, status: true });
        this.checkStatus(data);
    }

    componentDidMount() {
        this.fetchData();
    }

    async postData(url, obj) {
        let { validation } = this.state;
        const isFormValid = Object.keys(validation || {}).length > 0;
        try {
            if (this.isValid()) {
                await post(url, obj)
                this.setState({ postedStatus: true, status: false })
            } else {
                this.setState({ postedStatus: false })
            }
        } catch (error) {
            console.log('ERROR :', error);
        }
    }

    formattingDate = (day, month, year) => {
        if (day && month && year) {
            return `${day}-${month}-${year}`
        }
        return ''
    }


    handleSubmit = (e) => {
        e.preventDefault();
        let { city, hotel, corpbooking } = this.state.form;
        let { startDay, startMonth, startYear, endDay, endMonth, endYear } = this.state.dates;
        let { id } = this.props.match.params;
        let { bill } = this.props;
        let startDate = this.formattingDate(startDay, startMonth, startYear);
        let endDate = this.formattingDate(endDay, endMonth, endYear);
        this.postData(`/empapp/hotelbill`, { "billid": bill, "empuserid": id, "staystartdate": startDate, "stayenddate": endDate, "hotel": hotel, "city": city, "corpbooking": corpbooking ? 'Yes' : 'No' });
    }

    makeDropDown = (value, startValue, arr, name) => (
        <>
            <select className='form-select' name={name} value={value} disabled={this.state.status} onChange={this.handleDayChange}>
                <option value="" disabled>{startValue}</option>
                {arr && arr.map((day) => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </select>
        </>
    )

    generateDays = (month, year) => {
        const dateObj = new Date(`${month} 1, ${year}`);
        const monthNumber = dateObj.getMonth() + 1;
        const daysInMonth = new Date(year, monthNumber, 0).getDate();
        const days = [];
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    };

    checkStatus = (data) => {
        let { staystartdate, stayenddate, hotel, city, corpbooking } = data;
        if (staystartdate != '--' && stayenddate != '--' && hotel && city && corpbooking) {
            this.setState({ status: true })
        } else {
            this.setState({ status: false })
        }
    }

    generatingErrorMsg = (field, obj, key) => {
        console.log(field);
        if (field == '') {
            obj[key] = (key[0].toUpperCase() + key.substring(1) + ' is Required');
        }
        if (field && field.length < 5) {
            obj[key] = key[0].toUpperCase() + key.substring(1) + ' should have atleast 5 characters';
        }
        return obj;
    }

    checkingValidation = () => {
        const { staystartdate, stayenddate, hotel, city } = this.state.form;
        let validation = {};
        console.log('inside checkingvalidation');
        validation = this.generatingErrorMsg(staystartdate, validation, 'staystartdate');
        validation = this.generatingErrorMsg(stayenddate, validation, 'stayenddate');
        validation = this.generatingErrorMsg(hotel, validation, 'hotel');
        validation = this.generatingErrorMsg(city, validation, 'city');
        this.setState({ validation });
    }

    isValid = () => {
        console.log('VALIDATING');
        const { staystartdate, stayenddate, hotel, city } = this.state.form;
        console.log(staystartdate);
        console.log(this.state.validation);
        if (staystartdate != '--' && stayenddate != '--' && hotel && city) {
            console.log('all valid');
            return true;
        }
        console.log('none valid');
        return false;
        // const { validation = null } = this.state;
        // return !(validation && Object.keys(validation).length === 0);
    };


    getDates = (date) => {
        if (date) {
            return [...date.split('-')]
        }
    }

    render() {
        let { staystartdate, stayenddate, hotel, city, corpbooking } = this.state.form;
        let { startDay, startMonth, startYear, endDay, endMonth, endYear } = this.state.dates;
        let { errors = null, validation = null, status, postedStatus } = this.state;
        let { bill } = this.props;

        // const isFormValid = this.isValid();
        const isFormValid = (validation && Object.keys(validation).length === 0 && startDay && startMonth && startYear && endDay && endMonth && endYear && hotel && city);

        if (staystartdate && stayenddate && staystartdate != '--' && stayenddate != '--') {
            [startDay, startMonth, startYear] = this.getDates(staystartdate);
            [endDay, endMonth, endYear] = this.getDates(stayenddate);
        } else {
            startDay = this.state.dates.startDay;
            startMonth = this.state.dates.startMonth;
            startYear = this.state.dates.startYear;
            endDay = this.state.dates.endDay;
            endMonth = this.state.dates.endMonth;
            endYear = this.state.dates.endYear;
        }

        console.log(this.state.form);
        console.log(this.state.dates);

        const monthOptions = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const yearOptions = [2018, 2019, 2020];
        return (
            <div className="container my-3">
                <h1 className='fw-bold text-center'>Welcome To Employee Management Portal</h1>
                <div className="row bg-light mt-5 py-4">
                    <div className='text-center'>
                        <h3>Hotel Stay Details</h3>
                        <h5>Bill ID : {bill}</h5>
                    </div>
                    {
                        !postedStatus && (
                            <div className='text-center fw-bold'>{status ? <span className='text-success'>Displaying Hotel Bill Details</span> : <span className='text-primary'>No Hotel Stay Details Found. Please Enter Them</span>}</div>
                        )
                    }
                    <div className='text-center'>{postedStatus && <span className='text-success fw-bold'>Hotel Stay Details Have Been Successfully Created</span>}</div>
                    <div className="col-sm-4"></div>
                    <div className='col-sm-8'>
                        <div className='form-group row my-3'>
                            <label htmlFor='' className='text-end col-sm-3 col-form-label fw-bold'>Check In Date:</label>
                            <div className="col-sm-3">{this.makeDropDown(startYear, 'Select Year', yearOptions, "startYear")}</div>
                            <div className="col-sm-3">{this.makeDropDown(startMonth, 'Select Month', monthOptions, "startMonth")}</div>
                            <div className="col-sm-3">
                                {
                                    this.makeDropDown(startDay, 'Select Day', (startMonth && startYear) ? this.generateDays(startMonth, startYear) : '', 'startDay')
                                }
                            </div>
                            {validation && <div className='text-center text-danger fw-bold'>{validation.staystartdate}</div>}
                        </div>
                        <div className='form-group row my-3'>
                            <label htmlFor='' className='text-end col-sm-3 col-form-label fw-bold'>Check Out Date:</label>
                            <div className="col-sm-3">{this.makeDropDown(endYear, 'Select Year', yearOptions, "endYear")}</div>
                            <div className="col-sm-3">{this.makeDropDown(endMonth, 'Select Month', monthOptions, "endMonth")}</div>
                            <div className="col-sm-3">
                                {
                                    this.makeDropDown(endDay, 'Select Day', (endMonth && endYear) ? this.generateDays(endMonth, endYear) : '', 'endDay')
                                }
                            </div>
                            {validation && <div className='text-center text-danger fw-bold'>{validation.stayenddate}</div>}
                        </div>

                        <div className="form-group row my-3">
                            <label htmlFor='hotel' className='text-end col-sm-3 col-form-label fw-bold'>Hotel:</label>
                            <div className="col-sm-9">
                                <input type="text" className='form-control' id='hotel' name="hotel" placeholder="Name of the Hotel" value={hotel} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.hotel}</div>}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor='city' className='text-end col-sm-3 col-form-label fw-bold'>City:</label>
                            <div className="col-sm-9">
                                <input type="text" className='form-control' id='city' name="city" placeholder="Enter The City Name" value={city} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.city}</div>}
                            </div>
                        </div>
                        <div className="form-group row my-3">
                            <label htmlFor='city' className='col-sm-3 col-form-label fw-bold'></label>
                            <div className="col-sm-9">
                                <input type="checkbox" className='form-check-inline' name='corpbooking' id="corpbooking" checked={corpbooking} disabled={status} onChange={(e) => this.handleChange(e)} />
                                <label htmlFor="corpbooking" className='form-label'>Corporate Booking</label>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='text-center'>
                            <button type='button' className='btn btn-primary my-3' disabled={status || postedStatus || !isFormValid} onClick={(e) => this.handleSubmit(e)}>Submit</button>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}






{/* 
import React, { Component } from 'react';
import { post } from '../services/HttpService';

export default class HotelBill extends Component {

    state = {
        form: { staystartdate: '', stayenddate: '', hotel: '', city: '', corpbooking: '' },
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
        const { staystartdate, stayenddate, hotel, city, corpbooking } = this.state.form;
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
        let { staystartdate, stayenddate, hotel, city, corpbooking } = this.state.form;
        let expenses = ["Travel", "Hotel", "Software", "Communication", "Others"];
        let { validation = null, status, postedStatus } = this.state;
        let { id } = this.props.match.params;

        return (
            <div className="container my-3">
                <h1 className='fw-bold text-center'>Welcome To Employee Management Portal</h1>
                <div className="row bg-light mt-5">
                    <h3 className='text-center'>Hotel Stay Details</h3>
                    <h4>Bill ID : {id}</h4>
                    {
                        !postedStatus && (
                            <div className='text-center fw-bold'>{status && <span className='text-success'>Displaying Department Details</span>}</div>
                        )
                    }
                    <div className='text-center'>{postedStatus && <span className='text-success fw-bold'>New Bill Has Been Successfully Created</span>}</div>
                    <div className="col-sm-4"></div>
                    <div className='col-sm-8'>
                        <div className="form-group row my-3">
                            <label htmlFor='hotel' className='col-sm-2 col-form-label fw-bold'>Hotel:</label>
                            <div className="col-sm-10">
                                <input type="text" className='form-control' id='hotel' name="hotel" placeholder='Enter The Hotel Name' value={hotel} required onChange={(e) => this.handleChange(e)} />
                                {validation && <div className='text-center text-danger fw-bold'>{validation.hotel}</div>}
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
                        <div className="form-group row my-3">
                            <input type="checkbox" name='corpbooking' id="corpbooking" checked={corpbooking} onChange={(e) => this.handleChange(e)} />
                            <label htmlFor="corpbooking">Corporate Booking</label>
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
 */}



//  <div className="form-group">
//  <div>
//      <label>Day:</label>
//      <select value={day} onChange={this.handleDayChange}>
//          <option value="">Select Day</option>
//          {dayOptions.map((day) => (
//              <option key={day} value={day}>
//                  {day}
//              </option>
//          ))}
//      </select>
//  </div>
//  <div>
//      <label>Month:</label>
//      <select value={month} onChange={this.handleMonthChange}>
//          <option value="">Select Month</option>
//          {monthOptions.map((month, index) => (
//              <option key={index} value={month}>
//                  {month}
//              </option>
//          ))}
//      </select>
//  </div>
//  <div>
//      <label>Year:</label>
//      <select value={year} onChange={this.handleYearChange}>
//          <option value="">Select Year</option>
//          {yearOptions.map((year) => (
//              <option key={year} value={year}>
//                  {year}
//              </option>
//          ))}
//      </select>
//  </div>
// </div>