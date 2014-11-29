Router.configure({
	layoutTemplate: 'mainLayout'
});

Router.route('/', {name: 'homePage'});

Router.route('/apps/:appId', {
	name: 'appPage',
	data: function () {
		return {name: this.params.appId}
	}
});



