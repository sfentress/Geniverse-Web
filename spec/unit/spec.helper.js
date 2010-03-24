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

function createMockGOrganism(){
    var gOrganism = new Object();
    gOrganism.name = "test";
    gOrganism.alleles = "test";
    gOrganism.sex = "test";
    gOrganism.imageURL = "test";
    return gOrganism;
}