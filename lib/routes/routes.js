Router.configure({
    layoutTemplate: 'mainLayout'
});

Router.route('/', {name: 'homePage'});

Router.route('/apps/:appId', function () {
    this.render('appPage', {
        data: function () {
            var appId = this.params.appId;
            var app = _.find(Session.get('liveApps'), function (app) {
                if (app.name === appId) {
                    //var appApps = [app];
                    //appApps.concat(app.dependencies);
                    //Session.set('currentChartData', appApps);
                    return true;
                }
                return false;
            });
            app.url = app.uris[0];
            Session.set('currentApp', app);

            return {
                app: app
            }
        }
    });
});

Router.route('/spaces/:space', function () {
    var space = this.params.space;

    this.render('spacePage', {
        data: function () {
            var apps = Session.get('liveApps');
            var showBadge = true;
            if (space !== 'all') {
                showBadge = false;
                apps = _.filter(apps, function (app) {
                    return app.space.toLowerCase() === space.toLowerCase();
                });
                Session.set('currentChartData', apps);
            } else {
                Session.set('currentChartData', apps);
            }

            return {currentSpace: space, apps: apps, showBadge: showBadge};
        }
    });

});


Router.route('/product/:productId', {
    name: "productPage",
    data: function () {
        var currentProduct;
        var projectsTotal = 0;
        Meteor.call('fetchProduct', this.params.productId, function (err, respJson) {
            if (err) {
                window.alert("Error: " + err.reason);
                console.log("error occured on receiving data on server. ", err);
            } else {
                currentProduct = respJson['hits'];
                projectsTotal = currentProduct['hits'].length;
                Session.set("currentProductProjects", currentProduct['hits']);
                Session.set("currentProduct", currentProduct);
                Session.set("projectsTotal", projectsTotal);
            }
        });

        return {name: this.params.productId};
    }
});
