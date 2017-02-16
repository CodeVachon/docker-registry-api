# docker-registry-api
a javascript native promise based node wrapper for working with a local instance of the docker registry api

# Install
```sh
npm install docker-registry-api --save
```

## Init
```js
var dockerRegistry = require('docker-registry-api');

var options = {
    user: "",
    password: "",
    baseURL: ""
};

dockerRegistry(options);
```

## Options
- `user`: The User to sign into the registry with
- `password`: The Password to sign into the registry with
- `baseURL`: The URL for the registry.  eg: `hub.docker.com`
- `port`: The Port Number to connect to. Default: `5000`
- `timeout`: Timeout value in milliseconds. Default `15000`
- `verbose`: Log console actions taken (for debugging). Default `false`

each option has a `get` and `set` method in camel case (`dockerRegistry(options).setVerbose(true)`).

## Usage
### List of Repositories
```js
dockerRegistry(options).repositories().then(function(repositories) {
    console.log(repositories);
}).catch(function(error) {
    console.error(error);
});
```

### List of Tags for a Repository
```js
var repository = "hello-world";
dockerRegistry(options).tags(repository).then(function(tags) {
    console.log(tags);
}).catch(function(error) {
    console.error(error);
});
```

### Manifests Details for a Repository
```js
var repository = "hello-world";
var tag = "latest";
dockerRegistry(options).manifests(repository, tag).then(function(manifest) {
    console.log(manifest);
}).catch(function(error) {
    console.error(error);
});
```
