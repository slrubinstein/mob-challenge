'use strict';

angular.module('calendarApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['Auth', 'calendarService', '$http', '$scope'];

function MainCtrl(Auth, calendarService, $http, $scope) {

  var vm = this;
  var oneDay = 1000 * 60 * 60 * 24;

  vm.calendarEvents = calendarService.calendarEvents;
  vm.calendarName = '';
  vm.date;
  vm.errMsg = '';
  vm.searchByName = searchByName;
  vm.updateEvents = updateEvents;

  activate();

  function activate() {
    Auth.isLoggedInAsync(function(loggedIn) {
      if (loggedIn) {
        calendarService.activate().then(function() {
          vm.date = new Date;
          updateEvents();
        });
      }
    });
  }

  function searchByName() {
    updateEvents();
  }

  function updateEvents() {
    var name = vm.calendarName || 'primary'
    var nextDay = new Date(vm.date.getTime() + oneDay);

    calendarService.makeRequest(name,
                                vm.date.toISOString(),
                                nextDay.toISOString(),
                                assignEvents);
  }
    
  function assignEvents(result) {
    if (result) {
      vm.errMsg = result;
      $scope.$apply();
      return;
    }
    vm.errMsg = '';
    vm.calendarEvents = calendarService.calendarEvents;
    $scope.$apply();
  }
}