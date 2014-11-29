Router.configure({
	layoutTemplate: 'mainLayout'
});

Router.route('/', {name: 'homePage'});

Router.route('/apps/:appId', function () {
	this.render('appPage', {
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
});



