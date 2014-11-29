Meteor.methods({
    listLiveApps: function () {
        return getJson("http://10.73.66.197:9200/stains/application/1", '_source.applications');
    },
    listSpaces: function () {
        return getJson("http://10.73.66.197:9200/stains/pcfSpace/1", '_source.spaces');
    },
    listServices: function () {
        return getJson("http://10.73.66.197:9200/stains/service/1", '_source.services');
    },
    fetchProducts: function () {
        return getJson("http://10.73.66.197:9200/stains/product/_search");
    },
    fetchProjects: function () {
        return getJson("http://10.73.66.197:9200/stains/devProject/_search");
    }
});

var getJson = function (url, path) {
    //synchronous GET
    var result = Meteor.http.get(url, {timeout: 30000});
    if (result.statusCode == 200) {
        var result = JSON.parse(result.content);

        if (path) {
            var nodes = path.split('.');
            var currentNode = _.clone(result);
            for (var i = 0; i < nodes.length; i++) {
                currentNode = currentNode[nodes[i]];
            }
            result = currentNode;
        }

        return result;
    } else {
        console.log("Response issue: ", result.statusCode);
        var errorJson = JSON.parse(result.content);
        throw new Meteor.Error(result.statusCode, errorJson.error);
    }
};
