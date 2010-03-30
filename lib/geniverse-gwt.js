GenGWT = {

// 'callback' should be a function that takes a dragon (GOrganism)
generateDragon: function(callback){
	generateDragonWithCallback(callback, this.failure);
},

generateDragonWithSex: function(sex, callback){
	generateDragonWithSex(sex, callback, this.failure);
},

generateDragonWithAlleleString: function(alleles, callback){
	generateDragonWithAlleleString(alleles, callback, this.failure);
},

generateDragonWithAlleleStringAndSex: function(alleles, sex, callback){
	generateDragonWithAlleleStringAndSex(alleles, sex, callback, this.failure);
},

breedDragon: function(mother, father, callback){
	breedDragon(mother, father, callback, this.failure);
},

isAlive: function(dragon){
    return this.hasCharacteristic(dragon, "Alive");
},

hasCharacteristic: function(dragon, characteristic){
	function contains(arrayList, obj) {
	  var array = arrayList.array
      var i = array.length;
      while (i--) {
        if (array[i] == obj) {
          return true;
        }
      }
      return false;
    }
    
    return contains(dragon.characteristics, characteristic);
},

createDragon: function(jsonDragon){
	return createGOrganismFromJSONString(JSON.stringify(jsonDragon));
},

failure: function(errorMsg){
	console.error("failure on GWT callback");
	console.error(errorMsg);
	console.trace();
}
};