import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import { get } from '../services/HttpService'


export default class ViewEmployees extends Component {

    state = {
        employees: [],
        pageInfo: {}
    }

    fetchData = async () => {
        console.log('MOUNTED');
        let queryParams = queryString.parse(this.props.location.search);
        console.log(queryParams);
        let searchStr = this.makeSearchString(queryParams);
        console.log(searchStr);
        let { data } = await get(`/empapp/emps?${searchStr}`);
        console.log(data);
        this.setState({ employees: data.data, pageInfo: data.pageInfo })
    }

    componentDidMount() {
        this.fetchData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props)
            this.fetchData()
    }

    callURL = (url, options) => {
        let searchStr = this.makeSearchString(options);
        this.props.history.push({ pathname: url, search: searchStr })
    }

    makeSearchString = (options) => {
        let { page } = options;
        let searchStr = '';
        searchStr = this.addToQueryString(searchStr, 'page', page);
        return searchStr;
    };

    addToQueryString = (str, paramName, paramValue) =>
        paramValue ? str ? `${str}&${paramName}=${paramValue}` :
            `${paramName}=${paramValue}` : str;


    handlePage = (num) => {
        let queryParams = queryString.parse(this.props.location.search);
        let { page = '1' } = queryParams;
        let newPage = +page + num;
        queryParams.page = newPage;
        console.log('HANDLING PAGE:', queryParams);
        this.callURL('/admin/viewemp', queryParams)
    }


    render() {
        let { employees = [], pageInfo = {} } = this.state;
        let { numOfItems, numberOfPages, pageNumber, totalItemCount } = pageInfo;
        let startIndex = (pageNumber - 1) * numOfItems;
        let endIndex = totalItemCount > startIndex + numOfItems - 1
            ? startIndex + numOfItems - 1
            : totalItemCount - 1;

        console.log(startIndex);
        console.log(endIndex);
        console.log(totalItemCount);

        return (
            <div className="container text-center">
                <h1>ALL EMPLOYEES</h1>
                <div className='text-start fst-italic fw-bold'>{startIndex + 1} to {endIndex + 1} of {totalItemCount}</div>
                <div class="row bg-primary fw-bold lead">
                    <div className="col-sm-5 border">Name</div>
                    <div className="col-sm-5 border">Email ID</div>
                    <div className="col-sm-2 border"></div>
                </div>
                {
                    employees.map(emp =>
                        <div class="row lead">
                            <div className="col-sm-5 border">{emp.name}</div>
                            <div className="col-sm-5 border">{emp.email}</div>
                            <div className="col-sm-2 border">
                                <Link className='btn btn-success btn-sm' to={`/admin/viewemp/${emp.empuserid}`}>Details</Link>
                            </div>
                        </div>
                    )
                }
                <div className="row my-3">
                    <div className="col-sm-2">
                        {
                            startIndex > 0 ? (
                                <button className='btn btn-primary btn-sm' onClick={() => this.handlePage(-1)}>Prev</button>
                            ) : ('')
                        }
                    </div>
                    <div className="col-sm-8"></div>
                    <div className="col-sm-2">
                        {
                            startIndex + numOfItems < totalItemCount ? (
                                <button className='btn btn-primary btn-sm' onClick={() => this.handlePage(1)}>Next</button>
                            ) : ('')
                        }
                    </div>
                </div>
            </div>
        )
    }
}

