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

describe 'Geniverse-Views'
    before_each
        $('body').append($('<div id="test">'));
    end
    
    after_each
        $('#test').remove();
    end
    
    it 'loadViews() can inject views into specified divs'
      breedingWrapper = $('<div id="dragonBreedingWrapper">');
      $('#test').append(breedingWrapper);
      $('#dragonBreeding').html().should.be null
      GenView.loadViews(fixture('geniverse-views.html'));
      $('#dragonBreeding').html().should.not.be null
	end
end

