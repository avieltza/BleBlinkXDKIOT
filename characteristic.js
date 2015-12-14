/*jslint node:true,vars:true,bitwise:true,unparam:true */
/*jshint unused:true */
var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); 

var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var ledState=0;

var myOnboardLed = new mraa.Gpio(13); //LED hooked up to digital pin 13 (or built in pin on Intel Galileo Gen2 as well as Intel Edison)
myOnboardLed.dir(mraa.DIR_OUT);

var FirstCharacteristic = function() {
  FirstCharacteristic.super_.call(this, {
    uuid: 'fc0f',
    properties: ['read', 'write', 'notify'],
    value: null
  });
    
  console.log("Characterisitic's value: "+this._value);
    
  this._updateValueCallback = null;
};

util.inherits(FirstCharacteristic, BlenoCharacteristic);

FirstCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;
    console.log('FirstCharacteristic - onWriteRequest: value = ' + this._value.toString("utf-8"));

    if(ledState==0){
        ledState=1;
        myOnboardLed.write(1); 
    }
    else {
        ledState =0;
        myOnboardLed.write(0); 
    }
    
  if (this._updateValueCallback) {
    console.log('FirstCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = FirstCharacteristic;