Router.configure({
	layoutTemplate: 'mainLayout'
});

Router.route('/', {name: 'homePage'});

<<<<<<< HEAD
Router.route('/apps/:appId', function () {
	this.render('appPage', {
		data: function () {
			var appId = this.params.appId;
=======

Router.route('/apps/:appId', {
	name: 'appPage',
	data: function () {
		var appId = this.params.appId;
>>>>>>> 5ee8d75749d1ff1a4a1174f9026572c6d609143b

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
