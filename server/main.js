Meteor.startup(function () {
    // code to run on server at startup
});

Meteor.methods({
    fetchProjects: function() {
        var url = "http://10.73.66.197:9200/products/stash/1";
        //synchronous GET
        var result = Meteor.http.get(url, {timeout:30000});
        if(result.statusCode==200) {
            var respJson = JSON.parse(result.content);
            console.log("response received.");
            return respJson;
        } else {
            console.log("Response issue: ", result.statusCode);
            var errorJson = JSON.parse(result.content);
            throw new Meteor.Error(result.statusCode, errorJson.error);
        }
    }
});