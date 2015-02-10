'use strict';

angular.module('calendarApp')
  .factory('calendarService', calendarService);

calendarService.$inject = ['$http', '$q'];

function calendarService($http, $q) {

  var calendarEvents = [];

  return {
    activate: activate,
    addEvent: addEvent,
    calendarEvents: calendarEvents,
    makeRequest: makeRequest
  }

  function activate() {
    var deferred = $q.defer();
    var apiKey, clientId;
    var scopes = 'https://www.googleapis.com/auth/calendar';

    $http.get('/api/things').then(function(result) {
      apiKey = result.data.key;
      clientId = result.data.id;      
      gapi.client.setApiKey(apiKey);
      gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: true
      }, function() {
        deferred.resolve(loadApi());
      });
    });

    return deferred.promise;
  }

  function loadApi() {
    gapi.client.load('calendar', 'v3');
  }


  function makeRequest(calendar, start, end, cb) {
    var calendar = calendar || 'primary';

    gapi.client.request('/calendar/v3/calendars/' + calendar + 
      '/events?timeMin=' + start + '&timeMax=' + end)
    .then(function(result) {
      angular.copy(result.result.items, calendarEvents);
      cb(null);
    }, function(err) {
      cb(err.result.error.message)
    });
  }

  function addEvent(eventData, cb) {
    var url = '/calendar/v3/calendars/primary/events'
    var requestData = eventData;
    gapi.client.request({
      path: url,
      method: 'POST',
      body: eventData
    })
    .then(function(result) {
      cb(null);
    }, function(err) {
      cb(err.result.error.message);
    });
  }
}