class XHRApi {
    request(method, url, data, callback) {
        this.xhr = new XMLHttpRequest();
        this.xhr.open(method, url);
        this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState == this.xhr.DONE) {
                callback(this.xhr.response);
            }
        };
        this.xhr.setRequestHeader('Content-Type', 'application/json');
        this.xhr.send(data);
    }
    get(url, callback) {
        this.request('GET', url, null, callback);
    }
    post(url, data, callback) {
        this.request('POST', url, JSON.stringify(data), callback);
    }
}

module.exports = XHRApi;
