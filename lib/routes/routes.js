Router.configure({
	layoutTemplate: 'mainLayout'
});

Router.route('/', {name: 'homePage'});


Router.route('/apps/:appId', {
	name: 'appPage',
	data: function () {
		var appId = this.params.appId;

		return {
			app: _.find(Session.get('liveApps'), function (app) {
				if (app.name === appId) {
					Session.set('currentApp', app);
					return true;
				}
				return false;

			})
		}
	}
});

Router.route('/product/:productId', {
	name: "productPage",
	data: function() {
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
