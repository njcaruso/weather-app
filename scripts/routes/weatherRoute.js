
/**
 * Weather Router module.
 * @author Rama Raju Vatsavai <rrv.atwork@gmail.com>
 * @module routes/weatherRoute
 */

var http = require('http');
var request = require('request');

/** The Router class from restify-router module */
const Router = require('restify-router').Router;

/** An instance of Router class */
const router = new Router();

/** On a GET request for /api/getForecastDetailsWithCity/:location/:units/:apiKey, forward the request to handler */
router.get('/api/getForecastDetailsWithCity/:location/:units/:apiKey', handleGetForecastDetailsWithCity);


/** 
* Handler function for the GET request
* @function handleGetForecastDetailsWithCity 
*/
function handleGetForecastDetailsWithCity(req, res, next) {

    var data = {
        "location": req.params.location,
        "units": req.params.units,
        "apiKey": req.params.apiKey
    }

    getForecastDetailsWithCity(data, res);

    next();
}

/** 
* Function to call the openweathermap API and get forecast
* @function getForecastDetailsWithCity
* @param {Object} requestParams The request parameters as an object of location, units and apiKey
* @param {Object} respond The response object for the HTTP method. respond.send() would return to client
*/
function getForecastDetailsWithCity(requestParams, respond) {

    var weatherAPIResponse = "";

    console.log('requestParams --- ', requestParams);
    var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + requestParams.location + '&units=' + requestParams.units + '&APPID=' + requestParams.apiKey;
    //    var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=2222222222&units=' + requestParams.units + '&APPID=' + requestParams.apiKey;    

    console.log(url);


    request({
        method: 'GET',
        url: url,
    }, function (error, response) {
        if (error) {
            console.log('Error on openweather api call: ', error);
            respond.status(500).send('Error occurred while retrieving data from openweathermap api');
        }
        else {
            var body = response.body;
            var weatherAPIResponse = JSON.parse(body);

            if (response.statusCode == 500 || response.statusCode == 404 || response.statusCode == 502) {
                var errorMsg = {};
                errorMsg.message = weatherAPIResponse.message;
                console.log('------- response message', errorMsg);
                respond.status(500).send(errorMsg);
            }
            else if (response.statusCode !== 200) {
                log.error('Did not receive 200, body = ', response.body);
                respond.send(weatherAPIResponse);
            }
            else {
                respond.send(weatherAPIResponse);
            }
        }
    });

}

/** 
* Function to call the openweathermap API and get forecast
* @function getForecastDetailsWithCity
* @param {json} requestParams
* @param {json} respond 
*/
function getForecastDetailsWithCityTemp(requestParams, respond) {

    var weatherAPIResponse = "";

    console.log('requestParams --- ', requestParams);
    var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + requestParams.location + '&units=' + requestParams.units + '&APPID=' + requestParams.apiKey;
    //    var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=2222222222&units=' + requestParams.units + '&APPID=' + requestParams.apiKey;    

    console.log(url);
    var request = http.get(
        url,
        function (response) {

            var responseBody = "";
            //Read the data
            response.on('data', function (dataChunks) {
                responseBody += dataChunks;
            });

            response.on('end', function () {

                console.log(response.statusCode);
                var weatherAPIResponse = JSON.parse(responseBody);

                if (response.statusCode === 200 || response.statusCode === 304) {
                    try {
                        //Print the data
                        //console.log(weatherAPIResponse);
                        respond.send(weatherAPIResponse);
                    } catch (error) {
                        //Parse error
                        printError(error);
                    }
                } else {
                    //Status Code error
                    printError({ message: 'Error while getting forecast for ' + requestParams.location + '. (' + http.STATUS_CODES[response.statusCode] + ')' });

                    var errorMsg = {};
                    if (response.statusCode === 502) {
                        errorMsg.message = weatherAPIResponse.message;
                    }
                    respond.status(404).send(errorMsg);
                }
            })
        });

    //Connection error
    request.on('error', printError);
}

/** Print errors to console */
function printError(error) {
    console.error(error.message);
}

/** Export the Router instance */
module.exports = router;  