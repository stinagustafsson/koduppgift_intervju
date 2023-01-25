const fileReader = require('fs');
var dataFile = './testdata.txt';

//deletes old output file if it exists 
const XMLfile = "./convertedData.xml";
if (fileReader.existsSync(XMLfile)) {
  fileReader.unlink('convertedData.xml',(err) => {
    if(err) throw err;
    });
} 

//Reads the file with example data
fileReader.readFile(dataFile, 'utf8',(err, inputData) =>{
    if(err){
        console.error(err);
        return;
    }
   
    const lineByLineList = inputData.replace(/\r\n/g,'\n').split('\n');
    for (let index = 0; index < lineByLineList.length; index++) {
        let line = lineByLineList[index];
        let tempList = [];
        tempList.push(line);

        const nameList = tempList.toString().split('|'); 

        let dataFromIndex1 = nameList[1];
        let dataFromIndex2 = nameList[2];
        let dataFromIndex3 = nameList[3];

        //Templates for XML
        var firstPersonTemplate = "  <person> \n    <firstname>" + dataFromIndex1 + "</firstname> \n    <lastname>" + dataFromIndex2 + "</lastname> \n";
        var personTemplate = "  </person>\n  <person> \n    <firstname>" + dataFromIndex1 + "</firstname> \n    <lastname>" + dataFromIndex2 + "</lastname> \n";
        var telephoneTemplate = "    <phone> \n      <mobile>" + dataFromIndex1 + "</mobile> \n      <landline>" + dataFromIndex2 + "</landline> \n    </phone> \n";
        var addressTemplate = "    <address> \n      <street>" + dataFromIndex1 + "</street> \n      <city>" + dataFromIndex2 + "</city> \n      <postalcode>" + dataFromIndex3 + "</postalcode> \n    </address> \n";
        var familyTemplate = "    <family> \n      <name>" + dataFromIndex1 + "</name> \n      <born>" + dataFromIndex2 + "</born> \n    </family> \n";

        //Decides which template that will be used depending on the first letter on the line.
        if(nameList[0] === "P" && index < 1){
            var template = firstPersonTemplate;
        }
        
        if(nameList[0] === "P" && index > 0){
            var template = personTemplate;
        }

        if(nameList[0] === "T"){
            var template = telephoneTemplate;
        }

        if(nameList[0] === "A"){
            var template = addressTemplate;
        }

        if(nameList[0] === "F"){
            var template = familyTemplate;
        }

        //Makes sure that <people> gets printed on the first line, and </people> on the last line
        if(index < 1){
            fileReader.appendFileSync('convertedData.xml', "<people> \n", err => {
                if(err){
                    console.error(err);
                    return;
                }
                console.log("File has been updated");
            });
        }

        if(0 < index < lineByLineList.length){
            fileReader.appendFileSync('convertedData.xml',template, err => {
                if(err){
                    console.error(err);
                    return;
                }
                
            });
        }

        if(index === lineByLineList.length-1){
            console.log("\n\nText has been converted to XML and is uploaded to convertedData.xml\n\n")
            fileReader.appendFileSync('convertedData.xml',"  </person> \n</people>" ,err => {
                if(err){
                    console.error(err);
                    return;
                }
            });
        } 
    }
});