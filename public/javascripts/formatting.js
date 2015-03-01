var resetPos;

$(document).ready(function (){
    update();

    var scrolTime;

    $(".scrollButton").hover(function() {
        var buttonChoice = this.id;

        scrolTime = setInterval(function (){
            scrollSystemCards(buttonChoice);
        }, 20);
    }, function (){
        window.clearInterval(scrolTime);
    });

    initalSuggestions();
});

function update (){
    var content;

    $(".suggest").hover(function() {
        var hoverLoc_Ar = findRow(this);
        var componentAtHover_Obj = findComponentAt(hoverLoc_Ar[0], hoverLoc_Ar[1]);

        content = componentAtHover_Obj.name;

        var suggestion = $(this);
        var tick = ' &#10004';

        var addCss = {
            //backgroundColor : 'rgba(155, 152, 152, 0.44)',
            fontSize : '50px',
            color : '#4EB666',
            padding : '0 28px 0 0',
            margin : '3px 0 3px 34px',
            width : '43px'
        };

        suggestion.html(tick);
        suggestion.css(addCss);
    }, function() {
        var suggestion = $(this);

        var resetCss = {
            //backgroundColor : 'white',
            fontSize : '16px',
            color : '#000000',
            padding : '0 0 0 5px',
            margin : '3px 0 3px 0',
            width : '100px'
        };

        suggestion.text(content);
        suggestion.css(resetCss);
    });

    $(".circle").click(function(e){
        removeSugg_button(e);
    });
	
	$(".suggest").click(function(){
        previewSuggestion(this)
	});
	
    //Update page content
	updatePage();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*\
	SCROLL CONTROL STARTS HERE
\*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function scrollSystemCards (button)
{
    var nextPos;

    //Get card holder
    var stack = $("#systemStack");
    var stackPos = stack.position().top;//Get the holder position

    //Distance to scroll each frame
    var shiftDist = 5;

    //Get array of card elements
    var cards = $(".tSystem");
    var cards_num = cards.length - 1; //Number of cards

    var topCard = cards[0];
    var bottomCard = cards[cards_num];

    var cardHeight = $(topCard).height();

    //Current position of topCard
    var posCheck = $(topCard).offset().top;

    if (button === "top"){
        nextPos = stackPos + shiftDist;
    }else{
        nextPos = stackPos - shiftDist;
    }

    stack.css({
        top : nextPos
    });

    var jumpCheck = false;
    if (posCheck <= 0 && posCheck >= 0 - (cardHeight + 20)){
        jumpCheck = true;
    }

    if (jumpCheck == true && button == "top"){
        jumpUp(cards, "#systemStack");
    }else if(posCheck <= (0 - cardHeight) && button == "bottom"){
        jumpDown(cards, "#systemStack");
    }
}

function jumpUp (items, holder)
{
    var topItem = $(items[0]);

    //find difference between holder and item
    var holderPos_Top = $(holder).offset().top;
    var topItemPos_Top = topItem.offset().top;

    var spacer = topItemPos_Top - holderPos_Top;

    //now bump up bottom tile
    bump("up", items, holder);

    //Reposition holder to keep smooth scrolling
    var rectafier = spacer + topItem.height();
    var newPos_Top = holderPos_Top - rectafier;

    $(holder).css({top : newPos_Top + "px"});
}

function jumpDown (items, holder)
{
    var cardHeight = $(items[0]).height();
    var topItem = $(items[0]);

    //Get holder initial position
    var holderPos_Top = $(holder).offset().top;
    var topItemPos_Top = topItem.offset().top;

    var spacer = topItemPos_Top - holderPos_Top;


    bump("down", items, holder);

    var newPos_Top = holderPos_Top + cardHeight + spacer;

    $(holder).css({top : newPos_Top + "px"});
}

/**
 * Moves items to the top or bottom of lists
 * @param  {string} direction up or down
 * @param  {array} list
 * @param  {element} box
 * @return {none}
 */
function bump (direction, list, box)
{
    //Number of items in list
    var list_size = list.length - 1;

    //Holds card while its being removed
    var tempItem;

    if (direction == "up"){
        //Get card to bump
        var bottomCard = $(list[list_size]);
        tempItem = bottomCard;

        //Switch to the top
        bottomCard.remove();
        $(box).prepend(tempItem);
    }else if (direction == "down"){
        //Get card to bump
        var topCard = $(list[0]);
        tempItem = topCard;

        //Switch to bottom
        topCard.remove();
        $(box).append(tempItem);
    }else{
        console.log("Illegal Bump: Only 'up' or 'down'");
    }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*\
	SCROLL CONTROL ENDS HERE
	!CONTINUE AT OWN RISK!
\*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*\
	NODE VERSION STARTS HERE
\*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Variables
const suggestionFormatting_Class = "compSugg";
const maxSuggestionCount = 4;

var suggestedComponents_Obj = {};

//Gets components sent from server through Jade template
function importComponents (){
    imports = getSentComponents();

	if (imports == null){
		console.log("No Suggestions");
        return null;
	}else{
		console.log(imports);
		suggestedComponents_Obj = imports;
		
        return imports;
	}
}

//Converts location of hover element to component
function findComponentAt (rowId, suggId){
    var components_Obj = importComponents();

    var component_Obj = components_Obj[rowId - 1][suggId - 1];

    return component_Obj;
}

//Stage 1 setup
//Prepare page for initial useage
function hideRemoveButtons (hide){
    var rowButtons = $(".circle");

    if (hide) {
        rowButtons.addClass("hidden");
    }else{
        rowButtons.removeClass("hidden");
    }
}

//Stage 2 setup
//Setup initial suggestions
function initalSuggestions (iSuggestions_Obj){
	var rows_Ele = $(".compDesc");
    var rowCount = rows_Ele.length;

    var iSuggestions_Obj = importComponents();

    if (iSuggestions_Obj == null) {
        hideRemoveButtons(true);
    }

    for (i = 1; i <= rowCount; i++){
		addSuggestions(i, iSuggestions_Obj);
        hideRemoveButtons(true);
    }
}

//Stage 2 Ends
//Stage 3 controls
//Preview, choose and remove components
//TODO: preview component on click
function previewSuggestion (e){
    var clickLoc_Ar = findRow(e);
    var targetComponent_Obj = findComponentAt(clickLoc_Ar[0], clickLoc_Ar[1]);

    var previewWindow_Obj = {
        title : $("#compName"),
        image : $("#componentImage")
    };

    previewWindow_Obj.title.text(targetComponent_Obj.name);
}

//TODO: Confirm component and add it to component table
//
//TODO: Remove component from table with 'x' -> go back to suggestions

//Component sheet control functions
//Add suggestion to component sheet
function addSuggestions (row, suggestions_Obj){
	var rowLocation = "#comp" + row;
    var targetRow_Ele = $(rowLocation + " .compDesc");
	var rowSuggestionString_HTML = "<div class='suggTitle'><h5>Suggestion</h5></div>";
    var suggestionCount = maxSuggestionCount;

    //May need to change to increse browser compatability
    var numberOfSuggestions = sizeOf(suggestions_Obj[row - 1]);

    if (numberOfSuggestions == 0) {
        return 0;
    } else if (numberOfSuggestions < maxSuggestionCount) {
        suggestionCount = numberOfSuggestions;
    }
	
	for (c = 1; c <= suggestionCount; c++){
		var suggestion_Obj = suggestions_Obj[row - 1][c - 1];
		
		var suggestionString_HTML = "<a href='javascript:void(0)' id='sugg" + c + "' class='suggest'>" + suggestion_Obj.name + "</a>"
		
		rowSuggestionString_HTML += suggestionString_HTML;
	}
	
    targetRow_Ele.addClass(suggestionFormatting_Class);
	targetRow_Ele.html(rowSuggestionString_HTML);

    var modiLoc_Ele = $(rowLocation + " .compModi .triangle .circle");
    modiLoc_Ele.addClass("hidden");

    update();
    console.log("Fin");
}

//Convert row Id to component string type
function rowIDtoType (id){
	
	id *= 1;
	var types = ["MOBO", "CPU", "GPU", "RAM", "HDD", "PSU", "CASE"];
	
	try {
		return types[id];
	} catch (err) {
		console.log(err);
		console.log("Invalid ID");
	}
}

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

//Find row of hovering element
function findRow (e){
    var initial_Ele = $(e);
    var row_Ele = initial_Ele.parents()[1];
    var rowId = row_Ele.id;
    
    var parentId = splitEleID(rowId);
    var initialId = splitEleID(e.id);
    
    var rowLocation = [parentId, initialId];
    return rowLocation;
}

function splitEleID (eleID){
    var eleID = eleID.split('');
    var id = eleID[4];

    return id;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*\
	NODE VERSION ENDS HERE
	BADLANDS BEYOND
\*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*
function componentTest (id){
    var testComponent = new comp_cpu(id);
	var type = testComponent.type
	fullSystem[type.toLowerCase()] = testComponent;

    var componentTitle = testComponent.name;

    var title = $("#compName");
    title.text(componentTitle);
    console.log(componentTitle);
}

function suggSetup (){
    var rows = $(".compDesc");
    var rowCount = rows.length;

    for (i = 1; i <= rowCount; i++){
		addSuggRow(i);
    }
}

var suggestedComp = {
	"mobo" : {0 : ""},
	"cpu" : {0 : "test"},
	"gpu" : {0 : ""},
	"ram" : {0 : ""},
	"hdd" : {0 : ""},
	"psu" : {0 : ""},
	"case" : {0 : ""}
};

var fullSystem = {
	"mobo" : {0 : ""},
	"cpu" : {0 : "test"},
	"gpu" : {0 : ""},
	"ram" : {0 : ""},
	"hdd" : {0 : ""},
	"psu" : {0 : ""},
	"case" : {0 : ""}
};

function addSuggRow (row){
    var location = "#comp" + row;
    var targetElement = $(location + " .compDesc");
	var type = rowIDtoType(row);
	
	for (c = 1; c <= suggestionCount; c++){
		var newComponent = new comp_cpu(c);
		var tempHilder = suggestedComp[type];
		tempHilder[c - 1] = newComponent;
		
		suggestedComp[type] = tempHilder;
	}
	
    targetElement.addClass(suggClass);

    var modiLoc = $(location + " .compModi .triangle .circle");
    modiLoc.addClass("hidden");
	
	var compHolder = suggestedComp[type];
	
    targetElement.html('<div class="suggTitle"><h5>Suggestion</h5>\
</div><a href="javascript:void(0)" id="sugg1" class="suggest">' + compHolder[0].name + '</a>\
<a href="javascript:void(0)" id="sugg2" class="suggest">' + compHolder[1].name + '</a>\
<a href="javascript:void(0)" id="sugg3" class="suggest">' + compHolder[2].name + '</a>\
<a href="javascript:void(0)" id="sugg4" class="suggest suggLast">' + compHolder[3].name + '</a>');

    update();
	console.log(suggestedComp);
    console.log("Fin");
}

function findRow (e){
	var initial = $(e.toElement);
	var row_Ele = initial.parents()[1];
	var row = row_Ele.id;
	
	var parent_id = splitEleID(row);
	var initial_id = splitEleID(initial.context.id);
	
	suggObj_loc = rowIDtoType(parent_id);
	var target = suggestedComp[suggObj_loc];
	target = target[initial_id - 1];
	
	addComponent(target.compID, parent_id);
}

function splitEleID (eleID){
	var eleID = eleID.split('');
	var id = eleID[4];

	return id;
}

function addComponent (id, row){
	targetComponent(id);
	removeSuggRow(row);
}

function targetComponent (id){
	componentTest(id);
}

function findSuggestion (type, rank, base){
	
}

function removeSuggRow (row){
    var location = "#comp" + row;
    var targetElement = $(location + " .compDesc");

    if (targetElement.hasClass(suggClass)){
        targetElement.removeClass(suggClass);

        var modiLoc = $(location + " .compModi .triangle .circle");
        modiLoc.removeClass("hidden");

        targetElement.html('hello');
    }else{
        console.log("No suggestions removed!");
    }
}

function removeSugg_button (id){
    var target = id.target.id;
    addSuggRow(target);
}*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*\
    Controls for page ccontent start here
    Smooth sailing from here
\*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function updatePage (){
    //infoInfo();
    toggleImage();
}/*

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
}*/

function toggleImage (){
    var compImg = $("#componentImage");

    if (compImg.attr('src') == ''){
        compImg.css("display", "none");
    } else {
        compImg.css("display", "initial");
    }
}

function updatePreviewWindow (){
    
}