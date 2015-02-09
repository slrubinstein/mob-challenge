'use strict';

angular.module('calendarApp')
  .factory('calendarService', calendarService);

calendarService.$inject = ['$http'];

function calendarService($http) {

  var calendarEvents = [];

  return {
    activate: activate,
    calendarEvents: calendarEvents,
    makeRequest: makeRequest
  }

  function activate() {
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
      }, function(result) {
        loadApi();
      });
    });
  }

  function loadApi() {
    gapi.client.load('calendar', 'v3');
  }

  // 2011-08-30T13:22:53.108Z
  // date.toISOString()
  function makeRequest(calendar, start, end, cb) {
    var calendar = calendar || 'primary',
        start = start || '2015-02-09T14%3A18%3A43.391Z',
        end = end || '2015-02-10T14%3A18%3A43.391Z';

    gapi.client.request('/calendar/v3/calendars/' + calendar + 
      '/events?timeMin=' + start + '&timeMax=' + end)
    .then(function(result) {
      angular.copy(result.result.items, calendarEvents);
      cb(calendarEvents);
    }, function(err) {
      console.log(err)
    });
  }
}