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

    // save filter div for later
    GenView.filterDiv = views.find('#dragonFilter');
    $('.filterButton').append('<img class="filtercheck" src="css/img/200px-No-Symbol.png" style="width: 8; padding-left: 3;">');

    GenView.setupListeners();
},

filterDiv: null,

currentFilterPool: null,

setOrgPostingChannel: function (channel){
  this._orgChannel = channel;
  Chat.subscribe(this._orgChannel, this.acceptOrg, true);
},

acceptOrg: function (message) {
  if (message.messageObject != null && message.messageObject.dragon != null){
    var realDragon = GenGWT.createDragon(message.messageObject.dragon);
    // console.log("! "+realDragon.metaInfo.get("chat"));
    // add chat to metaInfo
    newDragon = message.messageObject;
    newDragon.dragon = realDragon;
    var messageString = '<b>' + message.user + ':</b> '+message.message;
    newDragon.lastChat = messageString;
    if (newDragon.chatHistory === undefined)
        newDragon.chatHistory = []
    newDragon.chatHistory.push(messageString);
      if (newDragon.userHistory === undefined)
        newDragon.userHistory = []
    newDragon.userHistory.push(message.user);
    if (newDragon.dragon.characteristics == null){
        GenGWT.getCharacteristics(newDragon.dragon, function(characteristics){
            newDragon.dragon.characteristics = characteristics;
        })
    }
    addDragonToPublicPool(newDragon)
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

setupListeners: function(){
    $('.filterButton').click(function(evt){
           filterDiv = GenView.filterDiv;
           $('body').append(filterDiv);
           var tPosX = evt.pageX  -20;
           var tPosY = evt.pageY -10;
           if (tPosX + filterDiv.width() > $(window).width())
              tPosX = $(window).width() - (filterDiv.width() + 20);
           if (tPosY + filterDiv.height() > $(window).height())
              tPosY = $(window).height() - (filterDiv.height() + 20);

           filterDiv.css({position: "absolute", top: tPosY, left: tPosX});
           filterDiv.show();
           GenView.currentFilterPool = $(this).parent();
           $('#doFilter').click(function(){
                  GenView.currentFilterPool.find('img').each(function(){

                        GenView.currentFilterPool.find('.filtercheck').attr('src', 'css/img/200px-No-Symbol.png')
                      var img = $(this);
                      img.show();
                      id = img.attr('id');
                      dragonBundle = GenView.allDragons[id];
                      if (dragonBundle != undefined){
                          filterProps = $('.filterProp');
                          filterProps.each(function(i, prop){
                              if (!GenView.matchesFilterProp(prop, dragonBundle.dragon))
                                  img.hide();
                              if (!prop.checked)
                                GenView.currentFilterPool.find('.filtercheck').attr('src', 'css/img/200px-Green_tick.png')
                           })
                     }
                  });
                  filterDiv.hide()
           });
       })
       .bind("mouseenter", function(){
           document.body.style.cursor = "hand";
       })
       .bind("mouseleave", function(){
           document.body.style.cursor = "auto";
       });
},

matchesFilterProp: function(filterProp, dragon){
    // for now, we are filtering negatively on unchecked characteristics
    // so if checked, always return true, if unchecked return true if drag
    // doesn't have feature

    // alert("for "+filterProp.value+": "+(filterProp.checked || !(GenGWT.hasCharacteristic(dragon, filterProp.value))))
   // alert(dragon.characteristics);
    return filterProp.checked || !(GenGWT.hasCharacteristic(dragon, filterProp.value))
},

allDragons: {}
}

// below is just copied over from previous script; still needs to be refactored
function init2() {

mySelectedDragon = null;  // currently selected dragon, as DragonBundle
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
      father = mySelectedDragon;
      parent = "father";
    } else {
      mother = mySelectedDragon;
      parent = "mother";
    }
    var dragonImage = jQuery(document.createElement('img'))
    dragonImage.attr('src', mySelectedDragon.image)
          .attr('width', 115)
          .attr('height', 113);
    $('#'+parent).html(dragonImage);
    $('#'+parent+'label').html(parent)
    $('#child').html("")
  }
});

$('#addChildToPool').click(function(e) {
  if (child != null){
    addDragonToMyPool(child)
    child = null;
  }
});



$('#addDragonToMyPool').click(function(){
  if (publicSelectedDragon != null){
    addDragonToMyPool(publicSelectedDragon);
  }
});

$('#breed').click(function(e) {
  if (mother != null && father != null){
      if (GenGWT.isAlive(mother.dragon) && GenGWT.isAlive(father.dragon)){
        var onSuccess = function(dragon) {
          child = new DragonBundle();
          child.dragon = dragon;
          child.mother = mother;
          child.father = father;
          child.image = dragon.imageURL;
          var dragonImage = jQuery(document.createElement('img'))
          dragonImage.hide();
          dragonImage.attr('id', 'childImage');
          addImage('childImage', child.image, 74, 74);
          $('#child').hide();
          $('#child').html(dragonImage);
          $('#child').fadeIn('slow');

        };
        GenGWT.breedDragon(mother.dragon, father.dragon, onSuccess);
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

function addDragonToPool(dragonBundle, divid, classname) {
    // give dragon an id if it doesn't already have one
    // note: this should be done automatically by GWT using uuids
        var dragon = dragonBundle.dragon;
        var dragonId
        if (dragonBundle.id === undefined || dragonBundle.id == ""){
            dragonId = dragon.name_0 + dragon.alleles;
            dragonId = dragonId.replace(/[ :,]/g,"");
            dragonBundle.id = dragonId;
        } else {
            dragonId = dragonBundle.id;
        }

    // rm existing image with same id
    if (GenView.allDragons[dragonId] != null){
        $('#'+divid).find('#'+dragonId).remove();
    }

  $('.'+classname).attr('style','border: 2px solid white');

  var dragonImage = $('<img id="'+dragonId+'">')
  dragonImage.attr('src', dragonBundle.image)
        .attr('width', 61)
        .attr('height', 60)
        .attr('style','border: 2px solid white')
        .attr('class', classname);

  GenView.allDragons[dragonId] = dragonBundle;

  dragonImage.click(function (e){
    $('.'+classname).css('border','2px solid white');
    dragonImage.css('border','2px solid gray');
  })

  tooltip = {
      delay: 400,
      showURL: false,
      bodyHandler: function() {
          var tip = $("<div>");
          var img = $("<img/>").attr("src", this.src);
          tip.append(img);
          tip.append("<br>");
          tip.append(dragonBundle.dragon.sex == 0 ? "Male" :  "Female");
          tip.append("<br>");
          tip.append(dragonBundle.lastChat)
          return tip;
      }
  }

    dragonImage.tooltip(tooltip);
    $('#'+dragonId).tooltip(tooltip);


    dragonImage.dblclick(function(){
        showModalDragonInfo(GenView.allDragons[dragonId]);
    });

    div = $('#'+divid);
    column = dragonBundle.dragon.sex == 0 ? "right-pool" : "left-pool";
    div.find('.'+column).append(dragonImage);
   // alert("div.scrollHeight = "+div.scrollHeight)
   var scrollHeight = document.getElementById(divid).scrollHeight;
    div.animate({ scrollTop: scrollHeight }, 100);

    div.parent().find('.filtercheck').attr('src', 'css/img/200px-No-Symbol.png')

  return dragonImage;
}

var viewHistory = []

function showModalDragonInfo(dragonBundle, showHistory){
    if (showHistory == null || showHistory == false){
        viewHistory = [];
    }

    viewHistory.push(dragonBundle);



    var currentDragon = dragonBundle;
    modalDiv = $('<div>');
    modalDiv.css("padding", 20)
        .css("text-align", "center");

    var motherImg;
    var fatherImg;
    if (currentDragon.mother != null){
        motherImg = dragonBundle.mother.image;
        fatherImg = dragonBundle.father.image;
    } else {
        motherImg = "css/img/QuestionMark.jpg";
        fatherImg = "css/img/QuestionMark.jpg";
    }
        motherDiv = $('<div>');
        motherDiv.css("float", "left")
            .css("clear", "left");
        var motherImg = $("<img/>").attr("src", motherImg);
        motherImg.height(90)
            .width(90);
        motherDiv.append("Mother<br>");
        motherDiv.append(motherImg);
        modalDiv.append(motherDiv);

        fatherDiv = $('<div>');
        fatherDiv.css("float", "right")
            .css("clear", "right");
        var fatherImg = $("<img/>").attr("src", fatherImg);
        fatherImg.height(90)
            .width(90);
        fatherDiv.append("Father<br>");
        fatherDiv.append(fatherImg);
        modalDiv.append(fatherDiv);



    var childImg = $("<img/>").attr("src", dragonBundle.image);
    modalDiv.append(childImg);
    var sexDiv = $('<div>');
    sexDiv.html(currentDragon.dragon.sex == 0 ? "Male" :  "Female")
    modalDiv.append(sexDiv)

    var chatHistory = ""
    for (i in currentDragon.chatHistory){
        chatHistory += currentDragon.chatHistory[i] + "<br>";
    }
    if (chatHistory.length > 0){
        chat = $('<div>');
        chat.css("overflow", "auto")
            .css("max-height", 90)
            .css("text-align", "left")
            .css("border", "1px solid black")
            .css("padding", 5)
        chat.scrollTop = chat.height()  // ? doesn't work
        chat.html(chatHistory);
        modalDiv.append(chat);
    }

    if (viewHistory.length > 1){
        back = $('<div>');
        backButton = $('<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Uploadform_arrow.svg/200px-Uploadform_arrow.svg.png">');
        backButton.height(25);
        backButton.width(25);
        backButton.css("padding", "2px")
       // backButton.html("back");
        backButton.click(function(){
            viewHistory.pop();
            previous = viewHistory.pop();
            showModalDragonInfo(previous, true);
        })
        back.append(backButton);
        modalDiv.append(back);
    }

    if (currentDragon.mother != null){
        motherImg.click(function(){
            showModalDragonInfo(currentDragon.mother, true);
        });
        fatherImg.click(function(){
            showModalDragonInfo(currentDragon.father, true);
        });
    }

    jQuery.facebox(modalDiv);
}

function addDragonToMyPool(dragonBundle) {
  var image = addDragonToPool(dragonBundle, "dragonPool", "myDragonImage");
  image.click(function (e){
    var img = image.attr('src');
    var dragonBundle = GenView.allDragons[image.attr('id')];
    mySelectedDragon = dragonBundle;
  });

  image.click(); // click to select child
}

function addDragonToPublicPool(dragonBundle) {
  var image = addDragonToPool(dragonBundle, "publicPool", "publicDragonImage");
  image.click(function (e){
    var img = image.attr('src');
    var dragonBundle = GenView.allDragons[image.attr('id')];
    publicSelectedDragon = dragonBundle;
  });

  image.click(); // click to select child
}

function addRandomDragon(sex) {
  var dragonSuccess = function(dragon) {
      newDragon = new DragonBundle();
      newDragon.dragon = dragon;
      newDragon.image = dragon.imageURL;
    addDragonToMyPool(newDragon);
    };
  GenGWT.generateDragonWithSex(sex, dragonSuccess);
}

function addDragon(alleles, sex){
    var dragonSuccess = function(dragon) {
        newDragon = new DragonBundle();
        newDragon.dragon = dragon;
      newDragon.image = dragon.imageURL;
    addDragonToMyPool(newDragon);
    };
  GenGWT.generateDragonWithAlleleStringAndSex(alleles, sex, dragonSuccess);
}


DragonBundle = function(){
    this.dragon = null;
    this.image = "";
    this.imageURL = "";
    this.chatHistory = [];
    this.userHistory = [];
    this.lastChat = "";
    this.mother = null;
    this.father = null;
}