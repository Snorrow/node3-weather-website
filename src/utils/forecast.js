const request = require('request');
const forecast = (lat, lon, callback) =>{
    const url =   "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=da0b25e0c863bf912a5de7ba3033122e&units=metric";
    request({url, json:true}, (error, {body}) => {
        if(error) callback("No internet connection");
        else if (body.error === "404") callback("Incorrect query");
        else callback(undefined, body.main);
    });
};

module.exports = forecast;