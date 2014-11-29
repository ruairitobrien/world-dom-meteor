Meteor.methods({
    listLiveApps: function () {
        return getJson("http://10.73.66.197:9200/stains/application/1");
    },
    listSpaces: function () {
        return getJson("http://10.73.66.197:9200/stains/pcfSpace/1");
    },
    listServices: function () {
        return getJson("http://10.73.66.197:9200/stains/service/1");
    }
});

var getJson = function (url) {
    //synchronous GET
    var result = Meteor.http.get(url, {timeout: 30000});
    if (result.statusCode == 200) {
        var respJson = JSON.parse(result.content);
        //console.log("response received." + result.content);
        return respJson;
    } else {
        console.log("Response issue: ", result.statusCode);
        var errorJson = JSON.parse(result.content);
        throw new Meteor.Error(result.statusCode, errorJson.error);
    }
};