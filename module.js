var got = require('got');
var extend = require('extend');
var base64 = require('base64-min');

module.exports = function dockerRegistryAPI(options) {
    var _this = this;

    var _settings = extend(false, {
        user: "",
        password: "",
        baseURL: "",
        port: 5000,
        timeout: 15000,
        verbose: false
    }, options);
    _this.callAPI = function(path, queryObject, method) {
        var encodedAuth = base64.encode(`${_settings.user}:${_settings.password}`);
        var fullURL = `https://${_settings.baseURL}:${_settings.port}/v2/${path}`;

        _this.log(`Send Request to [${fullURL}] with Token [${encodedAuth}]`);

        return got(fullURL, {
            headers: { Authorization: `Basic ${encodedAuth}` },
            method: method || "GET",
            query: queryObject,
            json: true,
            timeout: _settings.timeout
        }).then(function(response) {
            _this.log(`Request [${fullURL}] Completed with [${response.statusCode}]`);
            return response;
        }).catch(function(error) {
            _this.log(`Request [${fullURL}] Failed with [${error.statusCode}]: ${error.message}`);
            throw error;
        }); // close return got
    } // close callAPI
    _this.log = function(message) {
        if (_settings.verbose) {
            console.log(`-- ${message}`);
        }
    } // close _this.log

    _this.set = function(key, value) { _settings[key] = value; }
    _this.get = function(key) { return _settings[key]; }

    var returnedMethods = {
        repositories: function() {
            return new Promise(function(resolve, reject) {
                _this.callAPI("_catalog").then(function(response) {
                    return resolve(response.body.repositories);
                }).catch(reject);
            });
        }, // close repositories
        tags: function(repository) {
            return new Promise(function(resolve, reject) {
                _this.callAPI(repository + "/tags/list").then(function(response) {
                    return resolve(response.body.tags);
                }).catch(reject);
            });
        }, // close tags
        manifests: function(repository, tag) {
            return new Promise(function(resolve, reject) {
                _this.callAPI(repository + "/manifests/" + tag).then(function(response) {
                    return resolve(response.body);
                }).catch(reject);
            });
        } // close manifests
    }; // close return

    Object.keys(_settings).forEach( key => {
        var capitalizedKey = key.charAt(0).toUpperCase() + key.substr(1);
        returnedMethods[ `get${capitalizedKey}` ] = function() {
            _this.log(`Get value for [${capitalizedKey}]`);
            return _this.get(key)
        };
        returnedMethods[ `set${capitalizedKey}` ] = function(value) {
            _this.log(`Set value for [${capitalizedKey}] to [${value}]`);
            return _this.set(key, value)
        };
    });

    return returnedMethods;
}; // close dockerRegistryAPI
