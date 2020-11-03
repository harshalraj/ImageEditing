

//Service for no reason yet :P
angular.module('pixel.services', []).service('pixelService', ['$http',function ($http) {
    {
        this.getImageUrl = function (category) {
            //console.log(category);
            var url = '/api/getImageUrl' + '?category=' + category;
            return $http.get(url);
        }
        this.getCategory= function () {
            var url = '/api/getCategoryNames';
            return $http.get(url);
        }
         this.sendEmail = function (email,orderid) {
             var url = '/api/sendEmail'+ '?email=' + email + '&orderid='+ orderid;
            return $http.get(url);
         }
         this.saveImage = function (dataUrl) {
             var url = '/api/saveImage';
             return $http.post(url, dataUrl);
         }
         this.getElementByCat = function (category) {
             var url = '/api/getElementbyCategory' + '?category=' + category;
             return $http.get(url);
         }
         this.insertorderDetails = function (location, venueSize,eventdate, eventtime, duration, geofilterType, email) {
             var url = '/api/insertorderDetails' + '?location=' + location + '&venueSize=' + venueSize + '&eventdate=' 
                 + eventdate + '&eventtime=' + eventtime + '&duration=' + duration + '&geofilterType=' + geofilterType + '&email=' + email;
             return $http.get(url);
         }
         this.makePurchase = function (payPalId, location, venueSize, eventdate, eventtime, duration, geofilterType, email,dataUrl) {

             data = {};

             data.payPalId = payPalId;
             data.location = location;
             data.venueSize = venueSize;
             data.eventdate = eventdate;
             data.eventtime = eventtime;
             data.duration = duration;
             data.geofilterType = geofilterType;
             data.email = email;
             data.dataUrl = dataUrl;

             var url = '/api/makePurchase';

             return $http.post(url, data);
         }

    }

}]);