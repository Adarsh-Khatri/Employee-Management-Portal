const keyName = "user";
const bill = 'bill';

const login = (obj) => {
    let str = JSON.stringify(obj);
    localStorage.setItem(keyName, str)
}

const logout = () => {
    localStorage.removeItem(keyName);
    localStorage.removeItem(bill)
}

const getUser = () => {
    let str = localStorage.getItem(keyName);
    let obj = str ? JSON.parse(str) : null;
    return obj;
}

const addBillId = (id) => {
    localStorage.setItem(bill, id)
}


const getBillId = () => {
    return localStorage.getItem(bill);
}

export { login, logout, getUser, addBillId, getBillId }