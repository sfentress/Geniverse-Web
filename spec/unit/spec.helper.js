function createGOrganismFromJSONString(jsonString){
    jsonOrg = JSON.parse(jsonString);
    var gOrganism = new Object();
    gOrganism.name = jsonOrg.name;
    gOrganism.alleles = jsonOrg.alleles;
    gOrganism.sex = jsonOrg.sex;
    gOrganism.imageURL = jsonOrg.imageURL;
    return gOrganism;
}

function generateDragonWithCallback(callback, failure){
    var org = createMockGOrganism();
    callback(org);
}

function generateDragonWithSex(sex, callback){
    var org = createMockGOrganism();
    org.sex = sex;
    callback(org);
}

function breedDragon(x, y, callback){
    var org = createMockGOrganism();
    callback(org);
}

function createMockGOrganism(){
    var gOrganism = new Object();
    var rand = Math.floor(Math.random() * 10000);
    gOrganism.name = "test"+rand;
    gOrganism.alleles = "test"+rand;
    gOrganism.sex = "test"+rand;
    gOrganism.imageURL = "test"+rand;
    gOrganism.characteristics = {
        array: ["Alive"]
    }
    return gOrganism;
}

function jsonSize(jsonObject){
    var size = 0;
    jQuery.each(jsonObject, function(i, val){
	      size++;
	  });
	 return size;
}

function Image(){
    this.src = null;
}