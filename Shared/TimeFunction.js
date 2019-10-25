let moment = require('moment');            
//required format
//must be this format MM/DD/YYYY h:mm:ss.SSS A
let format = 'MM/DD/YYYY h:mm:ss.SSS A';//private

module.exports.Now = function Now(){
    let moment = require('moment');            
 
    let result = moment().format(format);
    return result;
}
module.exports.isValidateNow =function isValidateNow(TimeDate){
    return moment(TimeDate,format,true).isValid();
}

module.exports.Format = function Format(){
    return format;
}