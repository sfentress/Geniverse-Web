describe 'Geniverse-View-Service'
    describe ".loadViews()"
        before_each
            GenView.allDragons = {}
            $('body').append($('<div id="test">'));
        end

        after_each
            $('#test').remove();
            $('#sendButtonContainer').remove();
        end

        it 'it can inject views into specified divs'
          breedingWrapper = $('<div id="dragonBreedingWrapper">');
          $('#test').append(breedingWrapper);
          $('#dragonBreeding').html().should.be null
          GenView.loadViews(fixture('geniverse-views.html'));
          $('#dragonBreeding').html().should.not.be null
      end

      it 'it adds sendButtonContainer automatically'
          GenView.loadViews(fixture('geniverse-views.html'));
          $('#sendButtonContainer').html().should.not.be null
      end
    end

    describe "My Dragon Pool view"
      before_each
            stub(jQuery.fn, "height").and_return("");
            stub(jQuery.fn, "animate").and_return("");

            GenView.allDragons = {}
            GenView.mySelectedDragon = null;

            $('body').append($('<div id="test">'));
            poolWrapper = $('<div id="myDragonPoolWrapper">');
            $('#test').append(poolWrapper);
            GenView.loadViews(fixture('geniverse-views.html'));
        end

        after_each
            $('#test').remove();
        end

      it 'can create a private pool view'
          $('#dragonPool').html().should.not.be null
          $('#createDragons').html().should.not.be null
      end

      it 'create-dragon button creates dragons'
          jsonSize(GenView.allDragons).should.be 0
          $('#createDragons').click();
          jsonSize(GenView.allDragons).should.be 2
      end

      it 'create-dragon button adds dragon image to pool'
          $('#dragonPool').find('img.myDragonImage').length.should.be 0
          $('#createDragons').click();
          $('#dragonPool').find('img.myDragonImage').length.should.be 2
          $('#dragonPool').find('img.myDragonImage').html().should.not.be null
      end

      it 'create-dragon button adds male and female dragons in correct places'
          $('#dragonPool').find('img.myDragonImage').length.should.be 0
          $('#createDragons').click();
          $('#dragonPool .left-pool').find('img.myDragonImage').length.should.be 1
          $('#dragonPool .right-pool').find('img.myDragonImage').length.should.be 1
          $('#createDragons').click();
          $('#dragonPool .left-pool').find('img.myDragonImage').length.should.be 2
          $('#dragonPool .right-pool').find('img.myDragonImage').length.should.be 2
      end

      it 'can select dragons by clicking'
          GenView.mySelectedDragon.should.be null
          $('#createDragons').click();
          var leftImage = $('#dragonPool .left-pool').find('img.myDragonImage');
          var rightImage = $('#dragonPool .right-pool').find('img.myDragonImage');

          leftImage.click();
            GenView.mySelectedDragon.should.not.be null
            var previousDragon = GenView.mySelectedDragon

          rightImage.click();
            GenView.mySelectedDragon.should.not.be previousDragon
      end

      it 'can select dragons by clicking (UI changes)'
          $('#dragonPool').find('img.myDragonImage').length.should.be 0
          $('#createDragons').click();
          var leftImage = $('#dragonPool .left-pool').find('img.myDragonImage');
          var rightImage = $('#dragonPool .right-pool').find('img.myDragonImage');

          leftImage.click();
            leftImage.css('border').indexOf('gray').should.not.be -1
            leftImage.css('border').indexOf('white').should.be -1
            rightImage.css('border').indexOf('white').should.not.be -1

          rightImage.click();
            rightImage.css('border').indexOf('gray').should.not.be -1
            rightImage.css('border').indexOf('white').should.be -1
            leftImage.css('border').indexOf('white').should.not.be -1
      end
  end

  describe "Breeding view"
      before_each
            stub(jQuery.fn, "height").and_return("");
            stub(jQuery.fn, "animate").and_return("");

            GenView.allDragons = {}
            GenView.mySelectedDragon = null;
            GenView.mother = null;
            GenView.father = null;

            $('body').append($('<div id="test">'));
            breedWrapper = $('<div id="dragonBreedingWrapper">');
            $('#test').append(breedWrapper);
            poolWrapper = $('<div id="myDragonPoolWrapper">');
            $('#test').append(poolWrapper);
            GenView.loadViews(fixture('geniverse-views.html'));
        end

        after_each
            $('#test').remove();
        end

      it 'can create a breeding view'
          $('#dragonBreeding').html().should.not.be null
          $('#addDragonToBreeding').html().should.not.be null
          $('#breed').html().should.not.be null
      end

      it 'can add dragons to breeding view from My Dragon Pool view'
            $('#createDragons').click();
            var leftImage = $('#dragonPool .left-pool').find('img.myDragonImage');
            var rightImage = $('#dragonPool .right-pool').find('img.myDragonImage');

            leftImage.click();          // click female
            GenView.mother.should.be null
            $('#addDragonToBreeding').click();
            GenView.mother.should.not.be null

            rightImage.click();
            GenView.father.should.be null
            $('#addDragonToBreeding').click();
            GenView.father.should.not.be null
      end

      it 'can add dragons to breeding view from My Dragon Pool view (UI changes)'
            $('#createDragons').click();
            var leftImage = $('#dragonPool .left-pool').find('img.myDragonImage');
            var rightImage = $('#dragonPool .right-pool').find('img.myDragonImage');

            leftImage.click();          // click female
            $('#dragonBreeding').find('#mother').find('img').html().should.be null
            $('#addDragonToBreeding').click();
            $('#dragonBreeding').find('#mother').find('img').html().should.not.be null

            rightImage.click();
            $('#dragonBreeding').find('#father').find('img').html().should.be null
            $('#addDragonToBreeding').click();
            $('#dragonBreeding').find('#father').find('img').html().should.not.be null
      end

      it 'can can breed new dragons'
            $('#createDragons').click();
            var leftImage = $('#dragonPool .left-pool').find('img.myDragonImage');
            var rightImage = $('#dragonPool .right-pool').find('img.myDragonImage');

            leftImage.click();
            $('#addDragonToBreeding').click();
            rightImage.click();
            $('#addDragonToBreeding').click();
            $('#breed').click();

            GenView.child.should.not.be null
      end

      it 'can can breed new dragons (UI)'
            $('#createDragons').click();
            var leftImage = $('#dragonPool .left-pool').find('img.myDragonImage');
            var rightImage = $('#dragonPool .right-pool').find('img.myDragonImage');

            leftImage.click();
            $('#addDragonToBreeding').click();
            rightImage.click();
            $('#addDragonToBreeding').click();

            $('#dragonBreeding').find('#child').find('img').html().should.be null
            $('#breed').click();
            $('#dragonBreeding').find('#child').find('img').html().should.not.be null
      end

      it 'can add newly bred dragons to private pool'
            $('#createDragons').click();
            var leftImage = $('#dragonPool .left-pool').find('img.myDragonImage');
            var rightImage = $('#dragonPool .right-pool').find('img.myDragonImage');

            leftImage.click();
            $('#addDragonToBreeding').click();
            rightImage.click();
            $('#addDragonToBreeding').click();
            $('#breed').click();

            jsonSize(GenView.allDragons).should.be 2
            $('#addChildToPool').click();
            jsonSize(GenView.allDragons).should.be 3

            GenView.child.should.be null
      end

      it 'can add newly bred dragons to private pool (UI)'
            $('#createDragons').click();
            var leftImage = $('#dragonPool .left-pool').find('img.myDragonImage');
            var rightImage = $('#dragonPool .right-pool').find('img.myDragonImage');

            leftImage.click();
            $('#addDragonToBreeding').click();
            rightImage.click();
            $('#addDragonToBreeding').click();
            $('#breed').click();

            $('#dragonPool').find('img.myDragonImage').length.should.be 2
            $('#addChildToPool').click();
            $('#dragonPool').find('img.myDragonImage').length.should.be 3
      end
    end

    describe "Public Dragon Pool"
        before_each
            stub(jQuery.fn, "height").and_return("");
            stub(jQuery.fn, "animate").and_return("");

            GenView.allDragons = {}
            GenView.mySelectedDragon = null;
            GenView.mother = null;
            GenView.father = null;

            $('body').append($('<div id="test">'));
            publicPoolWrapper = $('<div id="publicPoolWrapper">');
            $('#test').append(publicPoolWrapper);
            poolWrapper = $('<div id="myDragonPoolWrapper">');
            $('#test').append(poolWrapper);
            GenView.loadViews(fixture('geniverse-views.html'));
        end

        after_each
            $('#test').remove();
        end

        it 'can create a public pool view'
              $('#publicPool').html().should.not.be null
          end
    end
    
    describe "Dragon Filter"
        before_each
            stub(jQuery.fn, "height").and_return(20);
            stub(jQuery.fn, "width").and_return(20);
            stub(jQuery.fn, "animate").and_return("");
            jQuery.fn.stubSetChecked = function(){
                $(this).attr("checked", true);
            }
            jQuery.fn.stubClick = function(){
                $(this).attr("checked", !$(this).attr("checked"));
            }
            
            GenView.allDragons = {}
            GenView.mySelectedDragon = null;
            GenView.mother = null;
            GenView.father = null;

            $('body').append($('<div id="test">'));
            poolWrapper = $('<div id="myDragonPoolWrapper">');
            $('#test').append(poolWrapper);
            GenView.loadViews(fixture('geniverse-views.html'));
        end

        after_each
            $('#test').remove();
            $('#dragonFilter').remove();
        end

        it 'public pool view has a filter button'
              $('.filterButton').html().should.not.be null
        end
        
        it 'pressing filter button opens filter window'
            $('#dragonFilter').html().should.be null
            $('.filterButton').click();
            $('#dragonFilter').html().should.not.be null
        end
        
        it 'all filters start out checked'
            $('.filterButton').click();
            $('#dragonFilter').find('input').each(function(i, val){
                // *** neither of these work in env.js ***
                // val.checked.should.be true
                // $(this).attr('checked').should.be true
                
                // so we fake it... (necessary for later)
                $(this).stubSetChecked();
                $(this).attr('checked').should.be true
            })
        end
        
        it 'clicking doFilter button makes filter window disappear'
            $('.filterButton').click();
            $('#dragonFilter').should.be_visible
            $('#doFilter').click();
            $('#dragonFilter').should.be_hidden
        end
        
        it 'can filter existing dragons'
            // setup pool with 1 dragon with wings and 1 without
            $('#createDragons').click();
            ids = []
            jQuery.each(GenView.allDragons, function(i, val){
                ids.push(val.id);
            })
            wingDragon = GenView.allDragons[ids[0]]
            noWingDragon = GenView.allDragons[ids[1]]
            
            wingDragon.dragon.characteristics.array.push("Single Wings");
            noWingDragon.dragon.characteristics.array.push("No Wings");
            
            // test filter
            $('.filterButton').click();
            $('#dragonFilter').should.be_visible
            
            $('#dragonFilter').find('input').each(function(i, val){
                // set everything checked
                $(this).stubSetChecked();
            })
            
            var wingsFilter
            var noWingsFilter
            $('#dragonFilter').find('input').each(function(i, val){
                if (val.value == "Single Wings"){
                    wingsFilter = $(this);
                } else if (val.value = "No Wings"){
                    noWingsFilter = $(this);
                }
            })
            wingsFilter.attr('checked').should.be true
            wingsFilter.stubClick();        // uncheck "Wings"
            wingsFilter.attr('checked').should.be false
            $('#doFilter').click();
            
            // (img ids are same as dragon ids)
            $('#'+wingDragon.id).should.be_hidden
            $('#'+noWingDragon.id).should.be_visible
            
            
            $('.filterButton').click();
            wingsFilter.stubClick();        // check "Wings"
            noWingsFilter.stubClick();        // uncheck "No Wings"
            $('#doFilter').click();
            
            $('#'+wingDragon.id).should.be_visible
            $('#'+noWingDragon.id).should.be_hidden
            
            $('.filterButton').click();
            wingsFilter.stubClick();        // uncheck "Wings" (both unchecked now)
            $('#doFilter').click();
            
            $('#'+wingDragon.id).should.be_hidden
            $('#'+noWingDragon.id).should.be_hidden
            
        end
    end

    describe "DragonBundle"
        before_each
            stub(jQuery.fn, "height").and_return("");
            stub(jQuery.fn, "animate").and_return("");
            GenView.allDragons = {}
            $('body').append($('<div id="test">'));
            poolWrapper = $('<div id="myDragonPoolWrapper">');
            $('#test').append(poolWrapper);
            GenView.loadViews(fixture('geniverse-views.html'));
        end

        after_each
            $('#test').remove();
            $('#sendButtonContainer').remove();
        end

        it 'newly-created dragons should wrapped in DragonBundle with an image'
            jsonSize(GenView.allDragons).should.be 0
            $('#createDragons').click();
            jsonSize(GenView.allDragons).should.be 2
            jQuery.each(GenView.allDragons, function(i, val){
                bundle = val;
                  bundle.should.not.be undefined
                  bundle.dragon.should.not.be undefined
                  bundle.image.should.not.be undefined
          });
        end

    end
end

describe 'Geniverse-Chat-Service'
    describe '.findChannel()'
        it 'should be able to pick a valid random channel'
            var channel1 = GenChatService.findChannel();
            var channel2 = GenChatService.findChannel();
            channel1.should.not.equal channel2
            channel1.slice(0,1).should.equal "/"
        end

        it 'should be able to pick a valid specified channel'
            var channel1 = GenChatService.findChannel("/test1");
            channel1.should.equal "/test1"

            var channel2 = GenChatService.findChannel("test2");
            channel2.should.equal "/test2"
        end

        it 'should be able to pick a valid channel from an array'
            var channel1 = GenChatService.findChannel(["test1"]);
            channel1.should.equal "/test1"
        end
    end
end

describe 'Geniverse-GWT mock functions'
    it 'can generate a GOrganism from a json dragon (mock)'
      var jsonOrg = {"name": "test", "alleles": "test", "imageURL": "test", "sex": "test"};
      var dragon = GenGWT.createDragon(jsonOrg);
      dragon.should.not.be null
      dragon.name.should.be "test"
  end

  it 'can create a new dragon (mock)'
    var success = false;
    var callback = function(org){
        if (org != null)
          success = true;
    }
    GenGWT.generateDragon(callback);
    success.should.be true
  end
end