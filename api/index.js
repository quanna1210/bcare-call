// import moment from 'moment'

async function fetchWithTimeout(resource, options) {
    const { timeout = 15000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        mode:'no-cors',
        signal: controller.signal
    });
    clearTimeout(id);

    return response;
}
export const groupBy = (input, key) => {
return input.reduce((acc, currentValue) => {
    // TODO: implement method
}, {}); // empty object is the initial value for result object
};
export const trimAny = (str, chars) => str.split(chars).filter(Boolean).join(chars);
export const base_url = () => {
    const env = process.env.NODE_ENV
    if (env == "development") {
        return '/'
    }else if (env == "production") {
        return 'https://bcare.vn/'
    }
}
export const api_url = () => {
    const env = process.env.NODE_ENV
    if (env == "development") {
        return 'https://beta-live.bcare.vn/v2_api/'
    }else if (env == "production") {
        return 'https://beta-live.bcare.vn/v2_api/'
        // return 'https://bcare.vn/v2_api/'
    }
}
export const api_url_doitac = () => {
    const env = process.env.NODE_ENV
    if (env == "development") {
        return 'https://beta-doitac.bcare.vn//v2_api/'
    }else if (env == "production") {
        return 'https://beta-doitac.bcare.vn//v2_api/'
        // return 'https://doitac.bcare.vn//v2_api/'
    }
}
export const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
export const printResult = (title) => {
    let divContents = document.getElementById("result-box").innerHTML;
    var params = [
        'height=' + screen.height,
        'width=' + screen.width,
        'fullscreen=yes'
    ].join(',');

    let printWindow = window.open('', '', params);
    printWindow.moveTo(0, 0);
    printWindow.document.open();
    printWindow.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    h1{
                        font-size:20px;
                        font-family:sans-serif;
                        text-align:center;
                    }
                    .styled_table {
                        border-collapse: collapse;
                        margin: 25px 0;
                        font-size: 0.9em;
                        font-family: sans-serif;
                        width: 100%;
                        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                    }
                    .styled_table thead tr {
                        background-color: #044284;
                        color: #ffffff;
                        text-align: left;
                    }
                    .styled_table thead tr th:first-child{
                        border-top-left-radius : 0.5rem;
                    }
                    .styled_table thead tr th:last-child{
                        border-top-right-radius : 0.5rem;
                    }
                    .styled_table thead tr th{
                        color:#fff;
                    }
                    .styled_table th,
                    .styled_table td {
                        padding: 12px 15px;
                    }
                    .styled_table tbody tr {
                        border-bottom: 1px solid #dddddd;
                    }
                    
                    .styled_table tbody tr:nth-of-type(even) {
                        background-color: #f3f3f3;
                    }
                    
                    .styled_table tbody tr:last-of-type {
                        border-bottom: 2px solid #044284;
                    }
                    .styled_table tbody tr.active-row {
                        font-weight: bold;
                        background-color: #e3edda;
                        text-align: center;
                    }
                    @media print{
                        .center{
                            text-align:center;
                        }
                        .styled_table thead tr th{
                            color:#000;
                            border-bottom:1px solid #000;
                        }
                        .styled_table {
                            border : 1px solid #000;
                            box-shadow: none;
                        }
                        .styled_table tbody tr {
                            border-bottom: 1px solid #000;
                        }
                        .styled_table tbody tr:last-of-type {
                            border-bottom: 2px solid #000;
                        }
                    }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                ${divContents}
            </body>
        </html>
    `);
    printWindow.print();
    printWindow.close();
}

export const checkExist = (result, item_check) => {
    var data = result.filter(item => {
        return item.id == item_check.id
    })
    if (data.length !== 0) {
        return 1;
    }
    return 0;
}
export const getData = async (url) => {
    return await fetchWithTimeout(url, {
        timeout: 30000
    })
        .then(response => Promise.all([response, response.json()])).catch(err => console.log(err));
}
export const getDataText = async (url) => {
    return await fetchWithTimeout(url, {
        timeout: 30000
    })
    .then(response => Promise.all([response, response.text()])).catch(err => console.log(err));
}
export const getDataDebug = (url) => {
    console.log(url)
    return fetchWithTimeout(url, { method: 'GET' })
        .then(response => {
            console.log(response)
            response.text()
        })
        .then((response) => {
            console.log(response)
        })
        .catch(err => console.log(err))
}
export const postData = (url, obj) => {
    console.log(url)
    return fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify(obj),
        timeout: 30000
    })
        .then(response => Promise.all([response, response.json()])).catch(err => console.log(err));
}
export const getUrlVars = (url) => {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
export const postDataDebug = (url, obj) => {
    // url = url+'?token=86d3c72215a03abb189f367aa758054b'
    console.log(url)
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(obj)
    })
        .then(response => response.text())
        .then((response) => {
            console.log(response)
        })
        .catch(err => console.log(err))
}
export function capitalizeFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function validatePhoneNumber(input_str) {
    var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    return re.test(input_str);
}
export const isEmptyObject = (obj) => {
    if (obj == null || obj == undefined) {
        return false
    }
    return (Object.getOwnPropertyNames(obj).length === 0);
}

export const getDateStringVn = (date) => {
    var day = date.getDate();
    var mon = date.getMonth() + 1;
    var year = date.getFullYear();
    if (day < 10) day = "0" + day;
    if (mon < 10) mon = "0" + mon;
    return day + '/' + mon + '/' + year;
}
export const replaceRange = (str, start, end, substitute) => {
    return str.substring(0, start) + substitute + str.substring(end);
}
export const validateEmail = (email) => {
    // eslint-disable-next-line
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
export const validateDate = (date) => {
    // eslint-disable-next-line
    var re = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
    return re.test(date);
}
export const validateNumber = (input) => {
    var re = /^\d+$/;
    return re.test(input);
}
export const validateNumberLetter = (input) => {
    var re = /^[0-9a-zA-Z]+$/;;
    return re.test(input);
}
export const uniqueId = () => {
    var uniqueId = Math.random().toString(36).substr(2, 9);
    return uniqueId;
}
export const money_format = (value) => {
    value = value.replace(/\./g, '')
    value = parseInt(value)
    return value.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export const number_format = (value) => {
    value = parseFloat(value)
    return value.toString().replace(/[^\d]/g, "");
}
export const intFormat = (e) => {
    if (e.target.value != '') {
        let res = e.target.value.toString().replace(/[^\d]/g, '')
        if (res.substr(0, 1) == '0') {
            res = parseInt(res)
        }
        e.target.value = numberWithCommas(res)
    } else {
        e.target.value = ''
    }
}
export const intFormatNotDecimal = (e) => {
    if (e.target.value != '') {
        let res = e.target.value.toString().replace(/[^\d]/g, '')
        if (res.substr(0, 1) == '0') {
            res = parseInt(res)
        }
        e.target.value = (res)
    } else {
        e.target.value = ''
    }
}
export const floatFormatNotDecimal = (e) => {
    if (e.target.value != '') {
        let res = e.target.value.toString().replace(/[^.\d]/g, '').replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2")
        if (res.substr(0, 1) == '0') {
            res = parseFloat(res)
        }
        e.target.value = res
    } else {
        e.target.value = ''
    }
}
export const floatFormat = (e) => {
    if (e.target.value != '') {
        let res = e.target.value.toString().replace(/[^.\d]/g, '').replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2")
        if (res.substr(0, 1) == '0') {
            res = parseFloat(res)
        }
        e.target.value = numberWithCommas(res)
    } else {
        e.target.value = ''
    }
}

export const numberWithCommas = (x) => {
    if (!x) {
        return 0
    } else {
        if (x.toString().indexOf('.') != -1) {
            let arr = x.toString().split('.')
            return arr[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + arr[1];
        } else {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
}
export const limitString = (str, number, show_dot = true) => {
    if (str.length > number) {
        str = str.substring(0, number);
        if (show_dot) {
            str += '...';
        }
        return str
    }
    else return str
}
// export const getDayOfMonthWeek = (year, month, week, day) => {
//     // Tạo một đối tượng Moment cho ngày 1 tháng 1 của năm đã chọn
//     let date = moment([year, month, 1]); // tháng 0 là tháng 1 trong Moment.js
//     // Tìm thứ Hai đầu tiên của tháng
//     if (date.day() > day) {
//         date = date.add(1, 'weeks');
//     }
//     date = date.day(day); // chọn thứ Hai trong tuần của ngày đầu tiên
//     // Thêm 2 tuần để đến thứ Hai của tuần thứ ba
//     date = date.add(parseInt(week) - 1, 'weeks');


//     return date // trả về ngày theo định dạng mong muốn
// }

// export const getLastDayOfMonth = (year, month, week, day) => {
//     // Tạo một đối tượng Moment cho ngày đầu tiên của tháng 6
//     let date = moment([year, parseInt(month) + 1, 1]); // tháng 5 là tháng 6 trong Moment.js (tháng 0 là tháng 1)

//     // Di chuyển về một ngày
//     date.subtract(1, 'days'); // chuyển về ngày cuối cùng của tháng 5

//     // Tìm thứ Hai cuối cùng
//     while (date.day() !== day) {
//         date.subtract(1, 'days'); // quay lại cho đến khi tìm được thứ Hai
//     }

//     return date // trả về ngày theo định dạng mong muốn
// }
export const scrolltoHash = (element_id) => {
    const element = document.getElementById(element_id)
    element?.scrollIntoView({ behavior: "smooth" });
}
export function stripHtml(html)
{
   let tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}
export const tokenProvider = async (userId) => {
    const response = await fetch("/create-token?userId=" + userId);
    const data = await response.text();
    const regex = /<div id="token">(.+)<\/div>/g;
    let result = '';
    let m;
    while ((m = regex.exec(data)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex == 1) {
                result = match
            }
        });
    }
    return result;
};
export function setCookie(cName, cValue, expSeconds) {
    let date = new Date();
    date.setTime(date.getTime() + (expSeconds * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
}

export function deleteCookie(e) {
    setCookie(e, "", -1)
}