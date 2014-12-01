Template.listProducts.helpers({
    products: function () {
        return Session.get("products");
    }
});

Template.listProjectsCount.helpers({
    count: function () {
        return Session.get("projectsCount")
    }
});

Template.menuProducts.helpers({
    products: function () {
        return Session.get("products");
    }
});

Template.menuProductsCount.helpers({
    count: function () {
        return Session.get("productsCount");
    }
});

Template.productPage.helpers({
    total: function () {
        return Session.get("projectsTotal");
    },
    product: function () {
        return Session.get("currentProduct");
    },
    projects: function () {
        return Session.get("currentProductProjects");
    }
});

Template.productPage.events({
    "click .showPane": function (event, template) {
        var forPane = event.currentTarget.attributes['data-for'].value;
        $('.showablePane').hide();
        $("#pane_" + forPane).show();
    }
});

Template.menuProductsCount.rendered = function () {
    populateProducts();
};

function populateProducts() {
    if (!this._rendered) {
        this._rendered = true;
        Meteor.call('fetchProducts', function (err, respJson) {
            if (err) {
                window.alert("Error: " + err.reason);
                console.log("error occured on receiving data on server. ", err);
            } else {
                try {
                    var products = respJson['hits'];
                    Session.set("products", products['hits']);
                    Session.set("productsCount", products['total']);
                } catch (err) {
                }
            }
        });

        Meteor.call('fetchProjects', function (err, respJson) {
            if (err) {
                window.alert("Error: " + err.reason);
                console.log("error occured on receiving data on server. ", err);
            } else {

                try {
                    var projects = respJson['hits'];
                    Session.set("projects", projects['hits']);
                    Session.set("projectsCount", projects['total']);
                } catch (err) {
                }
            }
        });
    }
}
