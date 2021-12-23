//~~~~~~~~~INCLUDES~~~~~~~~~~~~
const Log = require('./logger');
const axios = require ("axios");
const POS_STACK_API = process.env.POS_STACK_API;

const host = "https://ineighborhood.herokuapp.com";
// const host = "http://localhost:8080";

//~~~~~~~EXPORTED FUNCTIONS~~~~~~~~~~
/*
    GET getSunApi: getSunrise(_lat, _lng, _date)
*/
function getSunTimes(_lat=32.11,_lng=34.86,_date="today", _timezone=Math.round(_lng/15)){
    
}
exports.remoteApiController = {
    async getSun(req, res) {
        var _lat=32.11;
        if (req.body._lat)
            _lat=req.body._lat;
        var _lng=34.86;
        if (req.body._lng)
            _lng=req.body._lng;
        var _date="today";
        if (req.body._date)
            _date=req.body._date;
        var _timezone=Math.round(_lng/15);
        if (req.body._timezone)
            _timezone=req.body._timezone;
        Log.logger.info(`SUN API REQ: lat ${_lat} long ${_lng} date ${_date} timezone ${_timezone}`);
        const response = await axios.get('https://api.sunrise-sunset.org/json', { 
            params: {
                lat: _lat,
                lng: _lng,
                date: _date,
                formatted: 0 }
        });
        const responseData = response.data;
        Log.logger.info(`Debugger1: ${JSON.stringify(responseData)}`);
        var localTimeRise = new Date(responseData.results.sunrise);
        localTimeRise = new Date(localTimeRise.setHours((localTimeRise.getHours())+_timezone));
        var localTimeSet = new Date(responseData.results.sunset);
        localTimeSet = new Date(localTimeSet.setHours((localTimeSet.getHours())+_timezone));
        var sunData = { status: responseData.status,
                        sunrise: localTimeRise,
                        sunset: localTimeSet};
        Log.logger.info(`API SUNRISE RES: status${sunData.status} sunrise${sunData.sunrise} sunset${sunData.sunset}`);
        res.status(200).json(sunData);
    },
    async updatePrograms(req,res){
        var _lat=32.11;
        if (req.body._lat)
            _lat=req.body._lat;
        var _lng=34.86;
        if (req.body._lng)
            _lng=req.body._lng;
        var _date="today";
        if (req.body._date)
            _date=req.body._date;
        var _timezone=Math.round(_lng/15);
        if (req.body._timezone)
            _timezone=req.body._timezone;
        Log.logger.info(`SUN API REQ: lat ${_lat} long ${_lng} date ${_date} timezone ${_timezone}`);
        const response = await axios.get('https://api.sunrise-sunset.org/json', { 
            params: {
                lat: _lat,
                lng: _lng,
                date: _date,
                formatted: 0 }
        });
        const responseData = response.data;
        Log.logger.info(`Debugger1: ${JSON.stringify(responseData)}`);
        var localTimeRise = new Date(responseData.results.sunrise);
        localTimeRise = new Date(localTimeRise.setHours((localTimeRise.getHours())+_timezone));
        var localTimeSet = new Date(responseData.results.sunset);
        localTimeSet = new Date(localTimeSet.setHours((localTimeSet.getHours())+_timezone));
        var current_time =  new Date();
        current_time=new Date(current_time.setHours((current_time.getHours())+_timezone));
        const sunData = { status: responseData.status,
                        sunrise: localTimeRise,
                        sunset: localTimeSet,
                        current: current_time};
        Log.logger.info(`API SUNRISE RES: status${sunData.status} sunrise${sunData.sunrise} sunset${sunData.sunset}`);
        
        const status_Of_Light = ((current_time>localTimeRise) && (current_time<localTimeSet)) ? 0 : 1;
        const update_response =await axios({
            method: 'put',
            url: `${host}/api/program/2`,
            data: {
                currentStatus: status_Of_Light }
          });
        if(update_response.status == 200){
            res.status(200).json({"status":200,"msg":"Updated"});
            return;
        }
        res.status(503).json({"status":503,"msg":"Internal error not updated"});
    }
};
