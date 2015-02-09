'use strict';

angular.module('calendarApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['Auth', 'calendarService', '$http'];

function MainCtrl(Auth, calendarService, $http  ) {

  var vm = this;
  var oneDay = 1000 * 60 * 60 * 24;

  vm.date;
  vm.calendarEvents = calendarService.calendarEvents;
  vm.updateEvents = updateEvents;

  activate();

  function activate() {
    Auth.isLoggedInAsync(function(loggedIn) {
      if (loggedIn) {
        calendarService.activate();
      }
    });
  }

  function updateEvents() {
    var nextDay = new Date(vm.date.getTime() + oneDay);

    calendarService.makeRequest('primary',
                                vm.date.toISOString(),
                                nextDay.toISOString(),
                                assignEvents);
  }
    
  function assignEvents() {
    vm.calendarEvents = calendarService.calendarEvents;
  }
}