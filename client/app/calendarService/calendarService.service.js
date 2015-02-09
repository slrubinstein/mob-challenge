'use strict';

angular.module('calendarApp')
  .factory('calendarService', calendarService);

calendarService.$inject = ['$http'];

function calendarService($http) {

  return {
    activate: activate,
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
    gapi.client.load('calendar', 'v3').then(makeRequest);
  }

  function makeRequest() {
    gapi.client.request('/calendar/v3/calendars/primary/events')
    .then(function(result) {
      console.log(result)
    }, function(err) {
      console.log(err)
    });
  }
}