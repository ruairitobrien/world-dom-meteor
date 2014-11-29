Template.liveAppDependencyChart.rendered = function () {
    this.autorun(function () {
        var currentApp = Session.get('currentApp');

        console.log(currentApp);

        var dependencyMessage = $('#dep-message');

        dependencyMessage.text('');

        if (currentApp.dependencies && currentApp.dependencies.length > 0) {

            $('#live-app-dependency-chart').show();
            $('#flower-visualization').show();

            var apps = populateDependencies(Session.get("liveApps"));

            currentApp = _.find(apps, function (app) {
                return app.name === currentApp.name;
            });

            var packages = [];
            var mainDeps = [];
            var matrix = [];
            mainDeps.push(0);
            packages.push(currentApp.name);


            for (var j = 0; j < currentApp.dependencies.length; j++) {
                packages.push(currentApp.dependencies[j].name);
                mainDeps.push(1);

                var currentDeps = [];

                for (var t = 0; t < currentApp.dependencies.length; t++) {
                    var thing = _.find(currentApp.dependencies[j].dependencies, function (app) {
                        return app.name === currentApp.dependencies[t].name;
                    });
                    currentDeps.push(+!!thing);
                }
                matrix.push(currentDeps);
            }

            matrix.push(Array.apply(null, new Array(currentApp.dependencies.length + 1)).map(Number.prototype.valueOf, 0));
            matrix.unshift(mainDeps);

            var data = {
                packageNames: packages,
                matrix: matrix
            };

            console.log(data);

            var chart = d3.chart.dependencyWheel();
            d3.select('#live-app-dependency-chart')
                .datum(data)
                .call(chart);


            var myFlower = new CodeFlower("#flower-visualization", 400, 400);

            var deps = [];
            for (var x = 0; x < currentApp.dependencies.length; x++) {
                var dep = {
                    "name": currentApp.dependencies[x].name,
                    "children": []
                };
                deps.push(dep);
            }

            myFlower.update({"name": currentApp.name, "children": deps});

        } else {
            $('#live-app-dependency-chart').hide();
            $('#flower-visualization').hide();
            dependencyMessage.text('No dependencies');
        }
    });
};

var populateDependencies = function (apps) {
    for (var i = 0; i < apps.length; i++) {

        var uniqueDeps = _.uniq(apps[i].dependencies, function (x) {
            return x.name;
        });

        for (var d = 0; d < uniqueDeps.length; d++) {
            var name = uniqueDeps[d].name;
            var dep = _.find(apps, function (app) {
                return app.name === name;
            });
            if (dep) {
                uniqueDeps[d] = dep;
            }
        }
        apps[i].dependencies = uniqueDeps;
    }
    return apps;
};