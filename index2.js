const fs = require('fs');

const certificates =  fs.readdirSync('./certificates');
console.log("Certificate", certificates);

let arr = []

for(let x of certificates){
    let data = fs.readFileSync(`./certificates/${x}`, 'utf8');
    arr.push(JSON.parse(data));
}

fs.writeFileSync('./certificates.json', JSON.stringify(arr));