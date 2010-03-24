function createGOrganismFromJSONString(jsonString){
    jsonOrg = JSON.parse(jsonString);
    var gOrganism = new Object();
    gOrganism.name = jsonOrg.name;
    gOrganism.alleles = jsonOrg.alleles;
    gOrganism.sex = jsonOrg.sex;
    gOrganism.imageURL = jsonOrg.imageURL;
    return gOrganism;
}