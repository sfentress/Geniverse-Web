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

function createMockGOrganism(){
    var gOrganism = new Object();
    gOrganism.name = "test";
    gOrganism.alleles = "test";
    gOrganism.sex = "test";
    gOrganism.imageURL = "test";
    gOrganism.metaInfo = {
        put: function(){}
    };
    gOrganism.metaInfo.stringMap = {};      // this should be retired when metaInfo is fixed
    return gOrganism;
}

function jsonSize(jsonObject){
    var size = 0;
    jQuery.each(jsonObject, function(i, val){
	      size++;
	  });
	 return size;
}