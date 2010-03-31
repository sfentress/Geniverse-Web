GenView = {
    
init: function(callback){
    this._callback = callback;
    // go through and find views, and load in appropriate html
     $.get("lib/geniverse-views.html", this.loadViews);
},

allViews: ['myDragonPoolWrapper', 
            'publicPoolWrapper', 
            'dragonBreedingWrapper',
            'clientListWrapper',
            'messagingWrapper'],
    
loadViews: function(viewsHtml){
    views = $('<div>').append(viewsHtml);
    
    // add GWT button to page, or GWT won't work (for now)
    $('body').append(views.find('#sendButtonContainer'));
    
    // inject content of other views into empty divs of that name
    function injectView(name){
        if (!/^ *$/.test($('#'+name).html())){
        //    // console.log("skipping "+name+" as it already had content");
            return;
        }
        $('#'+name).append(views.find('#'+name).html());
    }
    
    for (i in GenView.allViews){
        injectView(GenView.allViews[i]);
    }
    
    if (GenView._callback != null){
        GenView._callback();
    }
},

setOrgPostingChannel: function (channel){
  this._orgChannel = channel;  
  Chat.subscribe(this._orgChannel, this.acceptOrg, true);
},

acceptOrg: function (message) {
	if (message.messageObject != null && message.messageObject.dragon != null){ 
		var realDragon = GenGWT.createDragon(message.messageObject.dragon);
		// console.log("! "+realDragon.metaInfo.get("chat"));
		// add chat to metaInfo
		alert("was "+realDragon.metaInfo.stringMap[":chat"])
		realDragon.metaInfo.put("chat", message.message);
		addDragonToPublicPool(realDragon, message.messageObject.image)
	}
},
    
addImage: function (id, url, width, height){
	var image = new Image();
	$(image).load(function(){
		$('#'+id).attr('src', image.src)
			.attr('width', width)
			.attr('height', height)
			.attr('style', '');
	});
	image.src = url;
},

allDragons: {}
}

// below is just copied over from previous script; still needs to be refactored
function init2() {

mySelectedDragon = null;	// currently selected dragon, as {image: IMG_URL, dragon: JSON_GOrganism}
publicSelectedDragon = null;
mother = null;
father = null;
child = null;

$('#createDragons').click(function(e) {
	addRandomDragon(0);
	addRandomDragon(1);
});



$('#addDragon').click(function(e) {
	     if (mySelectedDragon != null)
			Chat.addMessageObjectToChat(mySelectedDragon);
});

$('#addDragonToBreeding').click(function(e) {
	if (mySelectedDragon != null){
		var parent;
		if (mySelectedDragon.dragon.sex == 0) {
			father = mySelectedDragon.dragon;
			parent = "father";
		} else {
			mother = mySelectedDragon.dragon;
			parent = "mother";
		}
		var dragonImage = jQuery(document.createElement('img'))
		dragonImage.attr('src', mySelectedDragon.image)
					.attr('width', 100)
					.attr('height', 100);
		$('#'+parent).html(dragonImage);
		$('#'+parent+'label').html(parent)
		
	}
});

$('#addChildToPool').click(function(e) {
	if (child != null){
		addDragonToMyPool(child, $('#child img').attr('src'))
		child = null;
	}
});



$('#addDragonToMyPool').click(function(){
	if (publicSelectedDragon != null){
		addDragonToMyPool(publicSelectedDragon.dragon, publicSelectedDragon.image);
	}
});

$('#breed').click(function(e) {
	if (mother != null && father != null){
	    if (GenGWT.isAlive(mother) && GenGWT.isAlive(father)){
		    var onSuccess = function(organism) {
    			child = organism;
    			var dragonImage = jQuery(document.createElement('img'))
    			dragonImage.hide();
    			dragonImage.attr('id', 'childImage');
    			addImage('childImage', child.imageURL, 80, 80);
    			$('#child').html(dragonImage);
			
    		};
    		GenGWT.breedDragon(mother, father, onSuccess);
	    } else {
	        alert("Both parents must be alive to breed")
	    }
	}
});



function addImage(id, url, width, height){
	var image = new Image();
	$(image).load(function(){
		$('#'+id).attr('src', image.src)
			.attr('width', width)
			.attr('height', height)
			.attr('style', '');
	});
	image.src = url;
}

}   // end of init2

function addDragonToPool(dragon, imageurl, divid, classname) {
    // give dragon an id if it doesn't already have one
    // note: this should be done automatically by GWT using uuids
        if (dragon.metaInfo.stringMap[":id"] === undefined){
            var dragonId = dragon.name_0 + dragon.alleles
            dragonId = dragonId.replace(/[ :,]/g,"")
            dragon.metaInfo.put("id",dragonId)
        } else {
            var dragonId = dragon.metaInfo.stringMap[":id"];
        }
    
    // rm existing image with same id
    if (GenView.allDragons[dragonId] != null){
        $('#'+divid).find('#'+dragonId).remove();
    }
    
	$('.'+classname).attr('style','border: 2px solid white');

	var dragonImage = $('<img id="'+dragonId+'">')
	dragonImage.attr('src', imageurl)
				.attr('width', 63)
				.attr('height', 63)
				.attr('style','border: 2px solid white')
				.attr('class', classname);
			
	GenView.allDragons[dragonId] = dragon;
	
	dragonImage.click(function (e){
		$('.'+classname).attr('style','border: 2px solid white');
		dragonImage.attr('style','border: 2px solid gray');
	})
	
	tooltip = { 
	    delay: 400, 
	    showURL: false, 
	    bodyHandler: function() { 
	        var tip = $("<div>");
	        var img = $("<img/>").attr("src", this.src);
	        tip.append(img);
	        tip.append("<br>");
	        tip.append(dragon.metaInfo.stringMap[":chat"])
	        return tip; 
	    } 
	}
	
    dragonImage.tooltip(tooltip);
    $('#'+dragonId).tooltip(tooltip);
     
    div = $('#'+divid);
    div.append(dragonImage);
    div.animate({ scrollTop: div.height() }, 1000);
	
	return dragonImage;
}

function addDragonToMyPool(dragon, imageurl) {
	var image = addDragonToPool(dragon, imageurl, "dragonPool", "myDragonImage");
	image.click(function (e){
		var img = image.attr('src');
		var dragon = GenView.allDragons[image.attr('id')];
		mySelectedDragon = {image: imageurl, dragon: dragon};
	});
	
	image.click(); // click to select child
}

function addDragonToPublicPool(dragon, imageurl) {
	var image = addDragonToPool(dragon, imageurl, "publicPool", "publicDragonImage");
	image.click(function (e){
		var img = image.attr('src');
		var dragon = GenView.allDragons[image.attr('id')];
		publicSelectedDragon = {image: imageurl, dragon: dragon};
	});
	
	image.click(); // click to select child
}

function addRandomDragon(sex) {
	var dragonSuccess = function(dragon) {
		addDragonToMyPool(dragon, dragon.imageURL);
    };
	GenGWT.generateDragonWithSex(sex, dragonSuccess);
}