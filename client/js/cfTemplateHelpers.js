Template.menuLiveApps.helpers({
    apps: function () {
        return Session.get("liveApps");
    }
});

Template.liveAppCount.helpers({
   count: function () {
       return Session.get("appsCount");
   }
});


Template.menuLiveApps.rendered = function () {
    Meteor.call('listLiveApps', function (err, respJson) {
        if (err) {
            window.alert("Error: " + err.reason);
            console.log("error occured on receiving data on server. ", err);
        } else {
            console.log("respJson: ", respJson);
            var apps = respJson._source.applications;
            Session.set("liveApps", apps);
            Session.set("appsCount", apps.length);
        }
    });
};