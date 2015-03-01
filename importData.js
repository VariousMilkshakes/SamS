var orcMongo = require('orchestrate-mongo');

var importer = new orcMongo({
	orchestrate: {
		api_key: '9b9bbc70-82b4-4caf-a565-cdf46f52c334'
	},
	mongodb: {
		port: 27017,
		host: 'localhost',
		database: 'SamS',
		format: 'raw',
		onError: function (error) {
			console.log('Error - MongoWatch:', (error && error.stack) || error)
		},
		convertObjectIDs: true
	},
	collection: 'tblComponents'
});

importer.on('change.success', console.log);
console.log("Working");