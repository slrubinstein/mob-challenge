'use strict';

angular.module('calendarApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['Auth', 'calendarService', '$http'];

function MainCtrl(Auth, calendarService, $http  ) {

  activate();

  function activate() {
    

    Auth.isLoggedInAsync(function(loggedIn) {
      if (loggedIn) {
        calendarService.activate();
      }
    });
  }
    
}