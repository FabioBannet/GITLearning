const fs = require('fs')

const USER_TEMPLATE = 'userTemplate.json';

const checkPropValid =  (obj, _callback)=>
{    
    var res = true;

    fs.readFile(USER_TEMPLATE, 'utf8', (err, data) =>{

        let userTemplate = JSON.parse(data)[0];        
        let error = '';

        for(const [key, value] of Object.entries(userTemplate))
        {
            if(!obj.hasOwnProperty(key))
            {
                    error +=`Not a ${key}! Wrong property of object!\n`;
                    res = false;                                             
            }
            else if(typeof value != typeof obj[key])
            {
                    error += `${obj[key]} must have type ${typeof value}\n`;
                    res = false;                  
            }                             
        }
       
        console.log(error);

        _callback(res, error);
    });
}

module.exports = checkPropValid;