"use strict";
exports.__esModule = true;
var XHRApi = /** @class */ (function () {
    function XHRApi() {
    }
    XHRApi.prototype.request = function (method, url, data, callback) {
        var _this = this;
        this.xhr = new XMLHttpRequest();
        this.xhr.open(method, url);
        this.xhr.onreadystatechange = function () {
            if (_this.xhr.readyState == _this.xhr.DONE) {
                callback(_this.xhr.response);
            }
        };
        this.xhr.setRequestHeader('Content-Type', 'application/json');
        this.xhr.send(data);
    };
    XHRApi.prototype.get = function (url, callback) {
        this.request('GET', url, null, callback);
    };
    XHRApi.prototype.post = function (url, data, callback) {
        this.request('POST', url, JSON.stringify(data), callback);
    };
    return XHRApi;
}());
exports.XHRApi = XHRApi;
exports.xhr = new XHRApi();
