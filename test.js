
var dockerRegistry = require('./module')({
    user: "",
    password: "",
    baseURL: ""
});

dockerRegistry.setVerbose(true);
dockerRegistry.setPort(5000);
dockerRegistry.setTimeout(2000);

var selectedRepo = null;
dockerRegistry.repositories().then(function(repos) {
    console.log(repos);
    selectedRepo = repos[0];
    return dockerRegistry.tags(selectedRepo);
}).then(function(tags) {
    console.log(tags);
    return dockerRegistry.manifests(selectedRepo, tags[0]);
}).then(function(manifest) {
    console.log(manifest);
    console.log("Work Complete");
}).catch(function(error) {
    console.error(error);
});
