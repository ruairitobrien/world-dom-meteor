Template.liveAppDependencyChart.rendered = function () {

    var currentApp = Session.get('currentApp');

    console.log(currentApp);

    if (currentApp.dependencies && currentApp.dependencies.length > 0) {
        var data = {
            packageNames: ['Main', 'A', 'B'],
            matrix: [[0, 1, 1], // Main depends on A and B
                [0, 0, 1], // A depends on B
                [0, 0, 0]] // B doesn't depend on A or Main
        };


        var chart = d3.chart.dependencyWheel();
        d3.select('#live-app-dependency-chart')
            .datum(data)
            .call(chart);
    } else {
        // $('#live-app-dependency-chart').append('<p>No dependencies</p>');
    }


};
