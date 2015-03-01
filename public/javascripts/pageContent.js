function updatePage (){
	infoInfo();
	toggleImage();
}

function infoInfo(){
	var currentPrice = 0;
	var progess = 0;
	var wattage = 0;

	for (component in fullSystem){
		var compPrice = fullSystem[component].prc;
	
		if (!isNaN(compPrice)){
			currentPrice += fullSystem[component].prc;
			progress += 1;
		}
		
		
	}
	
	infoPane(currentPrice, progess, wattage);
}

function infoPane(prc, prog, watt){
	if (watt != 0){
		$("#watt").text("Wattage: " + watt);
	}
	
	$("#price").text("Price: " + price);
	$("#prog").text("Progress: " + prog + "/7");
}

function toggleImage (){
	var compImg = $("#componentImage");

	if (compImg.src == ''){
		compImg.css("display", "none");
	}else{
		compImg.css("display", "initial");
	}
}