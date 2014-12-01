Meteor.startup(function () {
    Meteor.call('listSpaces', function (err, spaces) {
        Session.set("spaces", spaces);
        Session.set("spaceCount", spaces.length);
    });
    Meteor.call('listLiveApps', function (err, apps) {
        if (err) {
            console.log("error occurred on receiving data on server. ", err);
        } else {
            Session.set("liveApps", apps);
            Session.set("appsCount", apps.length);
        }
    });
});

