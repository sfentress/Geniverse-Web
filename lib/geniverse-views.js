$(function(){
  // go through and find views, and load in appropriate html
 $.get("lib/geniverse-views.html", GenView.loadViews);
})

GenView = {
    
loadViews: function(viewsHtml){
    views = $('<div>').append(viewsHtml);
    
    // add GWT button to page, or GWT won't work (for now)
    $('body').append(views.find('#sendButtonContainer'));
    
    // inject content of other views into empty divs of that name
    function injectView(name){
        if (!/^ *$/.test($('#'+name).html())){
            console.log("skipping "+name+" as it already had content");
            return;
        }
        $('#'+name).append(views.find('#'+name).html());
    }
    
    injectView('myDragonPoolWrapper');
    injectView('publicPoolWrapper');
    injectView('dragonBreedingWrapper');
    
    // chat-related views
    injectView('clientListWrapper');
    injectView('messagingWrapper');
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
}
}