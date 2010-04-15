GenView = {

init: function(callback){
    this._callback = callback;  // function to callback after finished loading views
    // go through and find views, and load in appropriate html
    var self = this;
    loadViews = function(html){ self.loadViews(html); }
     $.get("lib/geniverse-views.html", loadViews);
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

    for (i in this.allViews){
        injectView(this.allViews[i]);
    }

    // save filter div for later
    this.filterDiv = views.find('#dragonFilter');
    $('.filterButton').append('<img class="filtercheck" src="css/img/200px-No-Symbol.png" style="width: 8; padding-left: 3;">');

    this.setupListeners();

    if (this._callback != null){
        this._callback();
    }
},

setupListeners: function(){
    var self = this;

    $('#createDragons').click(function(e) {
      self.addRandomDragon(0);
      self.addRandomDragon(1);
    });

    $('#addDragon').click(function(e) {
           if (self.mySelectedDragon != null)
          Chat.addMessageObjectToChat(self.mySelectedDragon);
    });

    $('#addDragonToBreeding').click(function(e) {
      self.addSelectedDragonToBreeding();
    });

    $('#breed').click(function(e) {
      self.breedDragons();
    });

    $('#addChildToPool').click(function(e) {
      if (self.child != null){
        self.addDragonToMyPool(self.child)
        self.child = null;
      }
    });

    $('#addDragonToMyPool').click(function(){
      if (self.publicSelectedDragon != null){
        self.addDragonToMyPool(self.publicSelectedDragon);
      }
    });

    $('.filterButton').click(function(evt){
           self.showFilterDiv(evt, this);
       })
       .bind("mouseenter", function(){
           document.body.style.cursor = "hand";
       })
       .bind("mouseleave", function(){
           document.body.style.cursor = "auto";
       });
},

allDragons: {},
mySelectedDragon: null,         // currently selected dragon, as DragonBundle
publicSelectedDragon: null,
mother: null,
father: null,
child: null,

filterDiv: null,
currentFilterPool: null,

setOrgPostingChannel: function (channel){
  this._orgChannel = GenChatService.validate(channel);
  var self = this;
  acceptOrg = function(message){ self.acceptOrg(message) };
  Chat.subscribe(this._orgChannel, acceptOrg, true);
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
    this.addDragonToPublicPool(newDragon)
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

addSelectedDragonToBreeding: function(){
    if (this.mySelectedDragon != null){
        var parent;
        if (this.mySelectedDragon.dragon.sex == 0) {
          this.father = this.mySelectedDragon;
          parent = "father";
        } else {
          this.mother = this.mySelectedDragon;
          parent = "mother";
        }
        var dragonImage = jQuery(document.createElement('img'))
        dragonImage.attr('src', GenView.mySelectedDragon.image)
              .attr('width', 115)
              .attr('height', 113);
        $('#'+parent).html(dragonImage);
        $('#'+parent+'label').html(parent)
        $('#child').html("")
      }
},

breedDragons: function(){
    var self = this;
    if (this.mother != null && this.father != null){
          if (GenGWT.isAlive(this.mother.dragon) && GenGWT.isAlive(this.father.dragon)){
            var onSuccess = function(dragon) {
              self.child = new DragonBundle();
              self.child.dragon = dragon;
              self.child.mother = GenView.mother;
              self.child.father = GenView.father;
              self.child.image = dragon.imageURL;
              var dragonImage = jQuery(document.createElement('img'))
              dragonImage.hide();
              dragonImage.attr('id', 'childImage');
              self.addImage('childImage', self.child.image, 74, 74);
              $('#child').hide();
              $('#child').html(dragonImage);
              $('#child').fadeIn('slow');
            };
            GenGWT.breedDragon(GenView.mother.dragon, GenView.father.dragon, onSuccess);
          } else {
              alert("Both parents must be alive to breed")
          }
      }
},

addImage: function(id, url, width, height){
    // wait for image to load before adding it
  var image = new Image();
  $(image).load(function(){
      $('#'+id).attr('src', image.src)
        .attr('width', width)
        .attr('height', height)
        .attr('style', '');
    });
  image.src = url;
},

showFilterDiv: function(evt, _this){
        filterDiv = this.filterDiv;
        $('body').append(filterDiv);
        var tPosX = evt.pageX  -20;
        var tPosY = evt.pageY -10;
        if (tPosX + filterDiv.width() > $(window).width())
            tPosX = $(window).width() - (filterDiv.width() + 20);
        if (tPosY + filterDiv.height() > $(window).height())
            tPosY = $(window).height() - (filterDiv.height() + 20);
        filterDiv.css({position: "absolute", top: tPosY, left: tPosX});
        
        filterDiv.show();
        this.currentFilterPool = $(_this).parent();
      
        var self = this;
        $('#doFilter').click(function(){
            self.filter();
        });
},

filter: function(){
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
},

matchesFilterProp: function(filterProp, dragon){
    // for now, we are filtering negatively on unchecked characteristics.
    // so if prop is checked, always return true,
    // if unchecked return true if drag doesn't have feature, false if does have feature

    return filterProp.checked || !(GenGWT.hasCharacteristic(dragon, filterProp.value))
},

addRandomDragon: function (sex) {
    var self = this;
    var dragonSuccess = function(dragon) {
      newDragon = new DragonBundle();
      newDragon.dragon = dragon;
      newDragon.image = dragon.imageURL;
      self.addDragonToMyPool(newDragon);
    };
  GenGWT.generateDragonWithSex(sex, dragonSuccess);
},

addDragon: function(alleles, sex){
    var self = this;
    var dragonSuccess = function(dragon) {
        newDragon = new DragonBundle();
        newDragon.dragon = dragon;
        newDragon.image = dragon.imageURL;
        self.addDragonToMyPool(newDragon);
    };
  GenGWT.generateDragonWithAlleleStringAndSex(alleles, sex, dragonSuccess);
},

addDragonToMyPool: function(dragonBundle) {
  var image = this.addDragonToPool(dragonBundle, "dragonPool", "myDragonImage");
  var self = this;
  image.click(function (e){
    var img = image.attr('src');
    var dragonBundle = self.allDragons[image.attr('id')];
    self.mySelectedDragon = dragonBundle;
  });

  image.click(); // click to select child
},

addDragonToPublicPool: function(dragonBundle) {
  var image = this.addDragonToPool(dragonBundle, "publicPool", "publicDragonImage");
  var self = this;
  image.click(function (e){
    var img = image.attr('src');
    var dragonBundle = self.allDragons[image.attr('id')];
    self.publicSelectedDragon = dragonBundle;
  });

  image.click(); // click to select child
},

addDragonToPool: function(dragonBundle, divid, classname) {
    var self = this;
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
    if (self.allDragons[dragonId] != null){
        $('#'+divid).find('#'+dragonId).remove();
    }

  $('.'+classname).attr('style','border: 2px solid white');

  var dragonImage = $('<img id="'+dragonId+'">')
  dragonImage.attr('src', dragonBundle.image)
        .attr('width', 61)
        .attr('height', 60)
        .attr('style','border: 2px solid white')
        .attr('class', classname);

  self.allDragons[dragonId] = dragonBundle;

  dragonImage.click(function (e){
    $('.'+classname).css('border','2px solid white');
    dragonImage.css('border','2px solid gray');
  })

  tooltip = this.createTooltip(dragonBundle);

    dragonImage.tooltip(tooltip);
    $('#'+dragonId).tooltip(tooltip);


    dragonImage.dblclick(function(){
        self.showModalDragonInfo(self.allDragons[dragonId]);
    });

    div = $('#'+divid);
    column = dragonBundle.dragon.sex == 0 ? "right-pool" : "left-pool";
    div.find('.'+column).append(dragonImage);
   // alert("div.scrollHeight = "+div.scrollHeight)
   var scrollHeight = document.getElementById(divid).scrollHeight;
    div.animate({ scrollTop: scrollHeight }, 100);

    div.parent().find('.filtercheck').attr('src', 'css/img/200px-No-Symbol.png')

  return dragonImage;
},

createTooltip: function(dragonBundle){
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
      return tooltip;
},

viewHistory: [],

showModalDragonInfo: function(dragonBundle, showHistory){
    var self = this;
    if (showHistory == null || showHistory == false){
        this.viewHistory = [];
    }

    this.viewHistory.push(dragonBundle);

    var currentDragon = dragonBundle;
    modalDiv = $('<div class="dragonModalInfo">');

    var motherImg;
    var fatherImg;
    if (currentDragon.mother != null){
        motherImg = dragonBundle.mother.image;
        fatherImg = dragonBundle.father.image;
    } else {
        motherImg = "css/img/QuestionMark.jpg";
        fatherImg = "css/img/QuestionMark.jpg";
    }
        motherDiv = $('<div class="mother">');
        var motherImg = $("<img/>").attr("src", motherImg);
        motherImg.height(90)
            .width(90);
        motherDiv.append("Mother<br>");
        motherDiv.append(motherImg);
        modalDiv.append(motherDiv);

        fatherDiv = $('<div class="father">');
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
        chat = $('<div class="chatHistory">');
        chat.scrollTop = chat.height()  // ? doesn't work
        chat.html(chatHistory);
        modalDiv.append(chat);
    }

    if (this.viewHistory.length > 1){
        back = $('<div>');
        backButton = $('<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Uploadform_arrow.svg/200px-Uploadform_arrow.svg.png">');
        backButton.height(25);
        backButton.width(25);
        backButton.css("padding", "2px")
       // backButton.html("back");
        backButton.click(function(){
            self.viewHistory.pop();             // pop self out
            previous = self.viewHistory.pop();  // get previous
            self.showModalDragonInfo(previous, true);
        })
        back.append(backButton);
        modalDiv.append(back);
    }

    if (currentDragon.mother != null){
        motherImg.click(function(){
            self.showModalDragonInfo(currentDragon.mother, true);
        });
        fatherImg.click(function(){
            self.showModalDragonInfo(currentDragon.father, true);
        });
    }

    jQuery.facebox(modalDiv);
},

clearAllDragons: function(){
    this.allDragons = {};
    this.mySelectedDragon = null;  
    this.publicSelectedDragon = null;
    this.mother = null;
    this.father = null;
    this.child = null;
    $('.right-pool').html("");
    $('.left-pool').html("");
}

}


// wrapper for gOrganism containing metadata
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

// kept for backward compatibility. Nothing should call this.
function init2() {}

// kept for backward compatibility. Nothing should call this.
function addDragon(alleles, sex){
  GenView.addDragon(alleles, sex)
}


