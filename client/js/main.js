Template.projects.events = {
};

Template.projects.listProjects = function () {
    console.dir("here");
    return Session.get("projects");
};

Template.menuProjects.listMenuProjects = function() {
    return Session.get("projects");
};

Template.menuProjectsCount.menuProjectsCount = function() {
    return Session.get("projectsCount");
};

Template.menuProjectsCount.rendered = function() {
    populateProjects();
};

Template.dependencyChart.rendered = function() {
    drawDependencyGraph();
};

function populateProjects() {
    if(!this._rendered) {
        this._rendered = true;
        Meteor.call('fetchProjects', function (err, respJson) {
            if (err) {
                window.alert("Error: " + err.reason);
                console.log("error occured on receiving data on server. ", err);
            } else {
                console.log("respJson: ", respJson);
                var projects = respJson._source.message;
                Session.set("projects", projects);
                Session.set("projectsCount", projects.length);
            }
        });
    }
}

function drawDependencyGraph() {

    var diameter = 960;

    var tree = d3.layout.tree()
        .size([360, diameter / 2 - 120])
        .separation(function (a, b) {
            return (a.parent == b.parent ? 1 : 2) / a.depth;
        });

    var diagonal = d3.svg.diagonal.radial()
        .projection(function (d) {
            return [d.y, d.x / 180 * Math.PI];
        });

    var svg = d3.select("#dependencyChart").append("svg")
        .attr("width", diameter)
        .attr("height", diameter - 150)
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    d3.json("flare.json", function (error, root) {
        var nodes = tree.nodes(root),
            links = tree.links(nodes);

        var link = svg.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

        var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
            })

        node.append("circle")
            .attr("r", 4.5);

        node.append("text")
            .attr("dy", ".31em")
            .attr("text-anchor", function (d) {
                return d.x < 180 ? "start" : "end";
            })
            .attr("transform", function (d) {
                return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
            })
            .text(function (d) {
                return d.name;
            });
    });

    d3.select(self.frameElement).style("height", diameter - 150 + "px")
};

