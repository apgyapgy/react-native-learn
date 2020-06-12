var HTTPBase = {};
/*
    *GET请求
*/
HTTPBase.get = function(url, params, headers) {
    if (params) {
        let paramsArray = [];
        let paramsKeyArray = Object.keys(params);
        paramsKeyArray.forEach(key => paramsArray.push(key + '=' + params[key]));
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&');
        } else {
            url += paramsArray.join('&');
        }
    }
    return new Promise(function(resolve, reject) {
        fetch(url, {
            method: 'GET',
            headers: headers,
        }).then(res => res.json())
        .then(res => {resolve(res)})
        .catch(error => {
            reject({status: -1})
        })
        .done();
    })
};
HTTPBase.post = function(url, params, headers) {
    if (params) {
        var formData = new FormData();
        let paramsKeyArray = Object.keys(params);
        paramsKeyArray.forEach(key => formData.append(key, params[key]));
    }
    return new Promise(function(resolve, reject) {
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData,
        }).then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(error => {
            reject({status: -1})
        })
        .done();
    });
}
global.HTTPBase = HTTPBase;