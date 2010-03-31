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

describe 'Geniverse-View-Service'
    describe ".loadViews()"
        before_each
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
    	
    	describe ": My Dragon Pool view"
    	    before_each
    	         poolWrapper = $('<div id="myDragonPoolWrapper">');
                  $('#test').append(poolWrapper);
                  GenView.loadViews(fixture('geniverse-views.html'));
            end
            
    	    it 'can create a private pool view'
              $('#dragonPool').html().should.not.be null
        	end
        	
        	it 'create-dragon button creates dragons (pending)'
              // $('#createDragons').html().should.not.be null
              // init2();
              // jsonSize(GenView.allDragons).should.be 0
              // $('#createDragons').click();
              // jsonSize(GenView.allDragons).should.be 1
        	end
        	
        	it 'create-dragon button adds dragon image to pool (pending)'
              // $('#createDragons').html().should.not.be null
              // init2();
              // $('#dragonPool').find('img').html().should.be null
        	  // $('#createDragons').click();
        	  // $('#dragonPool').find('img').html().should.not.be null
        	end
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