// let data = {
//     "empuserid": "2",
//     "amount": "4845.50",
//     "billid": "1",
//     "description": "Trip to London",
//     "expensetype": "Travel",
//     "goflightDate": "7-March-2019",
//     "goflightOrigin": "Los Angeles",
//     "goflightDest": "Seattle",
//     "goflightNum": "DELTA451",
//     "backflightDate": "9-March-2019",
//     "backflightOrigin": "Seattle",
//     "backflightDest": "Los Angeles",
//     "backflightNum": "DELTA288",
//     "corpbooking": "No"
// }
import React, { Component } from 'react';
import { post, get } from '../services/HttpService';

export default class TravelBill extends Component {

    state = {
        form: { goflightDate: '', backflightDate: '', goflightOrigin: '', backflightOrigin: '', goflightDest: '', backflightDest: '', goflightNum: '', backflightNum: '', corpbooking: '' },
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

    // {
    //     "billid": 6,
    //     "empuserid": 2,
    //     "goflightDate": "9-March-2020",
    //     "goflightOrigin": "Paris",
    //     "goflightDest": "YOYO",
    //     "goflightNum": "DELTA123",
    //     "backflightDate": "10-March-2020",
    //     "backflightOrigin": "YOYO",
    //     "backflightDest": "Paris",
    //     "backflightNum": "DELTA456",
    //     "corpbooking": "Yes"
    // }

    handleSubmit = (e) => {
        e.preventDefault();
        let { goflightDate, backflightDate, goflightOrigin, backflightOrigin, goflightDest, backflightDest, goflightNum, backflightNum, corpbooking } = this.state.form;
        let { startDay, startMonth, startYear, endDay, endMonth, endYear } = this.state.dates;
        let { id } = this.props.match.params;
        let { bill } = this.props;
        let startDate = this.formattingDate(startDay, startMonth, startYear);
        let endDate = this.formattingDate(endDay, endMonth, endYear);
        this.postData(`/empapp/hotelbill`, { "billid": bill, "empuserid": id, "goflightDate": startDate, "backflightDate": endDate, goflightOrigin, backflightOrigin, goflightDest, backflightDest, goflightNum, backflightNum, "corpbooking": corpbooking ? 'Yes' : 'No' });
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
        let { goflightDate, backflightDate, goflightOrigin, backflightOrigin, goflightDest, backflightDest, goflightNum, backflightNum, corpbooking } = data;
        if (goflightDate != '--' && backflightDate != '--' && goflightOrigin && backflightOrigin && goflightDest && backflightDest && goflightNum && backflightNum && corpbooking) {
            this.setState({ status: true })
        } else {
            this.setState({ status: false })
        }
    }

    generatingErrorMsg = (field, obj, key, name) => {
        if (field == '') {
            obj[key] = `${name} is Required`;
        }
        if (field && field.length < 3) {
            obj[key] = `${name} should have atleast 3 characters`;
        }
        return obj;
    }

    checkingValidation = () => {
        const { goflightDate, backflightDate, goflightOrigin, backflightOrigin, goflightDest, backflightDest, goflightNum, backflightNum, corpbooking } = this.state.form;
        let validation = {};
        validation = this.generatingErrorMsg(goflightDate, validation, 'goflightDate', 'Date');
        validation = this.generatingErrorMsg(backflightDate, validation, 'backflightDate', 'Date');
        validation = this.generatingErrorMsg(goflightOrigin, validation, 'goflightOrigin', 'Origin City');
        validation = this.generatingErrorMsg(backflightOrigin, validation, 'backflightOrigin', 'Origin City');
        validation = this.generatingErrorMsg(goflightDest, validation, 'goflightDest', 'Destination City');
        validation = this.generatingErrorMsg(backflightDest, validation, 'backflightDest', 'Destination City');
        validation = this.generatingErrorMsg(goflightNum, validation, 'goflightNum', 'Flight Number');
        validation = this.generatingErrorMsg(backflightNum, validation, 'backflightNum', 'Flight Number');
        this.setState({ validation });
    }

    isValid = () => {
        const { goflightDate, backflightDate, goflightOrigin, backflightOrigin, goflightDest, backflightDest, goflightNum, backflightNum, corpbooking } = this.state.form;
        if (goflightDate != '--' && backflightDate != '--') {
            return true;
        }
        return false;
    };


    getDates = (date) => {
        if (date) {
            return [...date.split('-')]
        }
    }



    render() {
        let { goflightDate, backflightDate, goflightOrigin, backflightOrigin, goflightDest, backflightDest, goflightNum, backflightNum, corpbooking } = this.state.form;
        let { startDay, startMonth, startYear, endDay, endMonth, endYear } = this.state.dates;
        let { errors = null, validation = null, status, postedStatus } = this.state;
        let { bill } = this.props;

        const isFormValid = (validation && Object.keys(validation).length === 0 && startDay && startMonth && startYear && endDay && endMonth && endYear);

        if (goflightDate && backflightDate && goflightDate != '--' && backflightDate != '--') {
            [startDay, startMonth, startYear] = this.getDates(goflightDate);
            [endDay, endMonth, endYear] = this.getDates(backflightDate);
        } else {
            startDay = this.state.dates.startDay;
            startMonth = this.state.dates.startMonth;
            startYear = this.state.dates.startYear;
            endDay = this.state.dates.endDay;
            endMonth = this.state.dates.endMonth;
            endYear = this.state.dates.endYear;
        }

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
                <div className='bg-light px-3'>
                    <div className="row mt-5 py-4">
                        <div className='text-center'>
                            <h3>Hotel Stay Details</h3>
                            <h5>Bill ID : {bill}</h5>
                        </div>
                        {
                            !postedStatus && (
                                <div className='text-center fw-bold'>{status ? <span className='text-success'>Displaying Flight Details</span> : <span className='text-primary'>No Flight Details Found. Please Enter Them</span>}</div>
                            )
                        }
                        <div className='text-center'>{postedStatus && <span className='text-success fw-bold'>Flight Details Have Been Successfully Created</span>}</div>
                        <hr className='my-3' />
                        <h5 className='text-center fw-bold mt-3'>Departure Flight Details</h5>
                        <div className="col-sm-4"></div>
                        <div className='col-sm-8'>
                            <div className='form-group row my-3'>
                                <label htmlFor='' className='text-end col-sm-3 col-form-label fw-bold'>Flight Date:</label>
                                <div className="col-sm-3">{this.makeDropDown(startYear, 'Select Year', yearOptions, "startYear")}</div>
                                <div className="col-sm-3">{this.makeDropDown(startMonth, 'Select Month', monthOptions, "startMonth")}</div>
                                <div className="col-sm-3">
                                    {
                                        this.makeDropDown(startDay, 'Select Day', (startMonth && startYear) ? this.generateDays(startMonth, startYear) : '', 'startDay')
                                    }
                                </div>
                                {validation && <div className='text-center text-danger fw-bold'>{validation.goflightDate}</div>}
                            </div>
                            <div className="form-group row my-3">
                                <label htmlFor='goflightOrigin' className='text-end col-sm-3 col-form-label fw-bold'>Origin City:</label>
                                <div className="col-sm-9">
                                    <input type="text" className='form-control' id='goflightOrigin' name="goflightOrigin" placeholder="Enter the Origin City" value={goflightOrigin} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                    {validation && <div className='text-center text-danger fw-bold'>{validation.goflightOrigin}</div>}
                                </div>
                            </div>
                            <div className="form-group row my-3">
                                <label htmlFor='goflightDest' className='text-end col-sm-3 col-form-label fw-bold'>Destination City:</label>
                                <div className="col-sm-9">
                                    <input type="text" className='form-control' id='goflightDest' name="goflightDest" placeholder="Enter The Destination City" value={goflightDest} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                    {validation && <div className='text-center text-danger fw-bold'>{validation.goflightDest}</div>}
                                </div>
                            </div>
                            <div className="form-group row my-3">
                                <label htmlFor='goflightNum' className='text-end col-sm-3 col-form-label fw-bold'>Flight Number:</label>
                                <div className="col-sm-9">
                                    <input type="text" className='form-control' id='goflightNum' name="goflightNum" placeholder="Enter The Flight Number" value={goflightNum} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                    {validation && <div className='text-center text-danger fw-bold'>{validation.goflightNum}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=' m-0'>
                        <hr className='my-3' />
                        <h5 className='text-center fw-bold mt-3'>Return Flight Details</h5>
                    </div>
                    <div className="row  py-4">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                            <div className='form-group row my-3'>
                                <label htmlFor='' className='text-end col-sm-3 col-form-label fw-bold'>Flight Date:</label>
                                <div className="col-sm-3">{this.makeDropDown(endYear, 'Select Year', yearOptions, "endYear")}</div>
                                <div className="col-sm-3">{this.makeDropDown(endMonth, 'Select Month', monthOptions, "endMonth")}</div>
                                <div className="col-sm-3">
                                    {
                                        this.makeDropDown(endDay, 'Select Day', (endMonth && endYear) ? this.generateDays(endMonth, endYear) : '', 'endDay')
                                    }
                                </div>
                                {validation && <div className='text-center text-danger fw-bold'>{validation.backflightDate}</div>}
                            </div>
                            <div className="form-group row my-3">
                                <label htmlFor='backflightOrigin' className='text-end col-sm-3 col-form-label fw-bold'>Origin City:</label>
                                <div className="col-sm-9">
                                    <input type="text" className='form-control' id='backflightOrigin' name="backflightOrigin" placeholder="Enter the Origin City" value={backflightOrigin} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                    {validation && <div className='text-center text-danger fw-bold'>{validation.backflightOrigin}</div>}
                                </div>
                            </div>
                            <div className="form-group row my-3">
                                <label htmlFor='backflightDest' className='text-end col-sm-3 col-form-label fw-bold'>Destination City:</label>
                                <div className="col-sm-9">
                                    <input type="text" className='form-control' id='backflightDest' name="backflightDest" placeholder="Enter The Destination City" value={backflightDest} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                    {validation && <div className='text-center text-danger fw-bold'>{validation.backflightDest}</div>}
                                </div>
                            </div>
                            <div className="form-group row my-3">
                                <label htmlFor='backflightNum' className='text-end col-sm-3 col-form-label fw-bold'>Flight Number:</label>
                                <div className="col-sm-9">
                                    <input type="text" className='form-control' id='backflightNum' name="backflightNum" placeholder="Enter The Flight Number" value={backflightNum} required disabled={status} onChange={(e) => this.handleChange(e)} />
                                    {validation && <div className='text-center text-danger fw-bold'>{validation.backflightNum}</div>}
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
            </div >
        )
    }
}

