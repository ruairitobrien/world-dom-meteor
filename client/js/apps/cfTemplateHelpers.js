Template.menuLiveApps.helpers({
    spaces: function () {
        return Session.get('spaces');
    }
});

Template.liveAppCount.helpers({
    count: function () {
        return Session.get("appsCount");
    }
});


