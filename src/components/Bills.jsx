import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../services/HttpService.jsx'
import NewBill from './NewBill.jsx';
import { addBillId } from '../services/AuthService.js';

export default class Bills extends Component {

    state = { bills: [], view: 0 }

    fetchData = async () => {
        let { user } = this.props;
        let { data } = await get(`/empapp/empbills/${user.empuserid}`);
        console.log(data.data);
        this.setState({ bills: data.data })
    }

    componentDidMount() {
        this.fetchData()
    }

    newBill = () => {
        // Toggling view
        let { view } = this.state;
        let newView = view === 0 ? 1 : 0
        this.setState({ view: newView })
    }


    BillOrHotel = (expensetype, billid) => {
        let { user } = this.props;
        addBillId(billid)
        this.props.history.push(`${expensetype == 'Hotel' ? '/emp/hotelbill/' : '/emp/travelbill/'}${user.empuserid}`)
    }


    render() {
        let { bills, view } = this.state;
        return (
            <div className="container">
                <h1 className='fw-bold text-center'>Welcome To Employee Management Portal</h1>
                <h3 className='my-4'>Details Of Bills Submitted</h3>
                <div className='text-center'>
                    <div class="row bg-primary">
                        <div class="col-sm-1 border">ID</div>
                        <div class="col-sm-4 border">Description</div>
                        <div class="col-sm-3 border">Expense Head</div>
                        <div class="col-sm-3 border">Amount</div>
                        <div class="col-sm-1 border"></div>
                    </div>
                    {
                        bills.map(bill =>
                            <div class="row">
                                <div class="col-sm-1 border">{bill.billid}</div>
                                <div class="col-sm-4 border">{bill.description}</div>
                                <div class="col-sm-3 border">{bill.expensetype}</div>
                                <div class="col-sm-3 border">{bill.amount}</div>
                                <div class="col-sm-1 border">
                                    {
                                        // (bill.expensetype == 'Hotel' || bill.expensetype == 'Travel')
                                        // && (<Link to={`${bill.expensetype == 'Hotel' ? '/emp/hotelbill/' : '/emp/travelbill/'}${user.empuserid}`}>
                                        //     <i className="fa-solid fa-square-plus fs-5 text-success" style={{ cursor: 'pointer' }}></i>
                                        // </Link>)
                                        (bill.expensetype == 'Hotel' || bill.expensetype == 'Travel')
                                        && (<button type='button' className='border p-0 btn btn-sm' onClick={() => this.BillOrHotel(bill.expensetype, bill.billid)}>
                                            <i className="fa-solid fs-5 fa-square-plus text-success" style={{ cursor: 'pointer' }}></i>
                                        </button>)
                                    }
                                </div>
                            </div>
                        )
                    }
                    <div className="row text-start my-3">
                        <div>
                            <button type='button' className="btn btn-outline-secondary" onClick={() => this.newBill()}>Submit a New Bill</button>
                        </div>
                    </div>
                </div>
                {
                    (view === 1 && <NewBill user={this.props.user} />)
                }
            </div>
        )
    }
}
