var express = require('express');
var router = express.Router();

var connection = require('orchestrate');
var db = connection(process.env.ORCHESTRATE_API_KEY);
var compGrab = connection(process.env.ORCHESTRATE_API_KEY);

/* GET home page. */
router.get('/', function(req, res, next){
	res.render('index', { title: 'SamS', componentTitle: "Component Name", data: null });
	
	db.ping()
	.then(function() {
		console.log("Connected to DB");
	})
	.fail(function(err) {
		console.log(err);
		console.log("Not Connected");
	});
});

router.get('/require', function(req, res){
	var budgetCat = req.query['budget'];
	var query = 'value.budget: ' + budgetCat + ' AND ';
	console.log("Budget: " + budgetCat);

	initalComponentCall(query, res);
});

function suggestionQuery (req){
	var budgetCat = req.query['budget'];
	var usage = req.query['use'];
	var upgrade = req.query['upgrade'];

	switch(usage){
		case 'b':
			
			break;
		default:
			statements_def
			break;
	}
}

function createQuery (){
	while (i = 0; i < 7; i++) {
		if ()
	}
}

function initalComponentCall (query, res){
	var componentTransfer_Obj = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
	var rowCount = 6;
	
	suggestedRowCall(0, rowCount, componentTransfer_Obj, query, res, intialComponentCall_Render);
}

function suggestedRowCall (runTime, endPoint, data_Obj, query, res, next){
	var types_Ar = ["MOBO", "CPU", "GPU", "RAM", "HDD", "PSU", "CASE"];
	var currentType = types_Ar[runTime];

	db.newSearchBuilder()
	.collection('tblComponents')
	.sort('price', 'asc')
	.limit(4)
	.query(query + 'value.type: "' + currentType + '"')
	.then(function (components){
		console.log("Sorting Components");
		
		var row_Ar = [];
		var componentBox_Obj = components.body.results;

		var waitingForComponent = false;

		for (each in componentBox_Obj) {
			var componentID = componentBox_Obj[each].value.compID;
			waitingForComponent = true;

			row_Ar.push(componentBox_Obj[each].value);

			data_Obj[runTime] = row_Ar;
			
		}

		if (runTime == endPoint) {
			getComponentSpecificData (0, endPoint, 0, data_Obj, query, res, next);
		}else{
			suggestedRowCall(runTime + 1, endPoint, data_Obj, query, res, next);
		}

	})
	.fail(function(err) {
		console.log("NO GET : \n" + err);
		res.redirect('/');
	});
}

function getComponentSpecificData (runTime, endPoint, compIndex, data_Obj, query, res, next){
	var component = data_Obj[runTime][compIndex];
	var compIndexLimit = sizeOf(data_Obj[runTime]);

	var componentType = component.type;

	if (componentType == "PSU") {
		if (runTime == endPoint && compIndex == compIndexLimit -1) {
			intialComponentCall_Render (data_Obj, res);
		} else if (compIndex == compIndexLimit -1) {
			getComponentSpecificData(runTime + 1, endPoint, 0, data_Obj, query, res, next)
		} else {
			getComponentSpecificData(runTime, endPoint, compIndex + 1, data_Obj, query, res, next)
		}
	} else {
		var formatType_Ar = componentType.split('');

		var firstLetter = formatType_Ar[0].toUpperCase();

		var letters_Count = formatType_Ar.length;
		var lowerLetters_Ar = formatType_Ar.splice(1, letters_Count - 1);

		var lowerLetters = lowerLetters_Ar.join('').toLowerCase();

		var typeTblString = 'tbl' + firstLetter + lowerLetters;
		console.log("Getting Component Info");
			
		db.newSearchBuilder()
		.collection(typeTblString)
		.query('value.compID:' + component.compID)
		.then(function (componentInfo){
			console.log("Intergrating info");

			var componentData_Obj = componentInfo.body.results[0].value;
			var tempHolder = data_Obj[runTime][compIndex];
			tempHolder.stats = componentData_Obj;
			data_Obj[runTime][compIndex] = tempHolder;

			if (runTime == endPoint && compIndex == compIndexLimit -1) {
				intialComponentCall_Render (data_Obj, res);
			} else if (compIndex == compIndexLimit -1) {
				getComponentSpecificData(runTime + 1, endPoint, 0, data_Obj, query, res, next)
			} else {
				getComponentSpecificData(runTime, endPoint, compIndex + 1, data_Obj, query, res, next)
			}
		})
		.fail(function (err){
			console.log("Search Failed");
		});
	}
}

function intialComponentCall_Render (componentData_Obj, res){
	console.log("Rendering Page");
	try {
		res.render('index', {
			title : 'SamS',
			data : componentData_Obj,
			componentTitle: "TEST"
		});
	} catch (err) {
		//console.log("Page render failed");
		//console.log(err);
	}
}

router.post('/comp', function(req, res) {
	var count = 0;
	var compTbl = 'tblComponents'

	var cName = req.param('compName');
	var cType = req.param('compType');
	var cPrce = req.param('compPrice');
	var cBugt = req.param('bugCat');
	
	if (cName == null || cType == null || cPrce == null || cBugt == null){
		console.log("missing information");
		res.redirect('/');
	}else{
		db.newSearchBuilder()
		.collection(compTbl)
		.query('*')
		.then(function(components) {
			if(components.body.count > 0){
				count = components.body.count;
			}
			console.log(count);
			
			db.put(compTbl, count, {
				"name" : cName,
				"type" : cType,
				"price" : cPrce,
				"priceBracket" : cBugt
				})
				.then(function(result) {
					res.redirect('/');
					console.log("POST GOODDE");
				})
				.fail(function(err) {
					console.log("POST FAD");
			});
		})
		.fail(function(err) {
			console.log(err);
			console.log("No count made");
		});
	
		
	}
});

router.get('/comp', function(req, res){
	var compId = req.param('id');
	console.log(compId);

	db.get('tblComponents', req.param('id'))
	.then(function(result) {
		console.log(result);
		res.render('index', { title: 'SamS', componentTitle : result.body.name });
		console.log("worked");
	})
	.fail(function(err) {
		console.log("NOP{e");
	});
});

function sizeOf (obj){
    var size = 0;
    for (key in obj) {
        //Ignores empty keys
        if (obj.hasOwnProperty(key)) {
            size += 1;
        }
    }   
    return size;
}

module.exports = router;
