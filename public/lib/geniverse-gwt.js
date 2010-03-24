GenGWT = {

// 'callback' should be a function that takes a dragon (GOrganism)
generateDragon: function(callback){
	generateDragonWithCallback(callback, this.failure);
},

breedDragon: function(mother, father, callback){
	breedDragon(mother, father, callback, this.failure);
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