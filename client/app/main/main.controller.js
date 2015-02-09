'use strict';

angular.module('calendarApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['Auth', 'calendarService', '$http', '$scope'];

function MainCtrl(Auth, calendarService, $http, $scope) {

  var vm = this;
  var oneDay = 1000 * 60 * 60 * 24;

  vm.addNewEvent = addNewEvent;
  vm.calendarEvents = calendarService.calendarEvents;
  vm.calendarName = '';
  vm.date;
  vm.endTime;
  vm.errMsg = { search: '', add: '' };
  vm.newEvent = {
    summary: '',
    start: { dateTime: '' },
    end: { dateTime: '' }
  };
  vm.pleaseLogIn = '';
  vm.startTime;
  vm.updateEvents = updateEvents;

  activate();

  function activate() {
    Auth.isLoggedInAsync(function(loggedIn) {
      if (loggedIn) {
        calendarService.activate().then(function() {
          vm.date = new Date;
          updateEvents();
        });
      } else {
        vm.pleaseLogIn = 'Please log in to view calendars.'
      }
    });
    setTimeout(setDefaultTime, 1000);
  }

  function addNewEvent() {

    var start = vm.startTime.setDate(vm.date.getDate());
        start = vm.startTime.setMonth(vm.date.getMonth());
        start = vm.startTime.setFullYear(vm.date.getFullYear());

    var end = vm.endTime.setDate(vm.date.getDate());
        end = vm.endTime.setMonth(vm.date.getMonth());
        end = vm.endTime.setFullYear(vm.date.getFullYear());

    vm.newEvent.start.dateTime = new Date(start).toISOString();
    vm.newEvent.end.dateTime = new Date(end).toISOString();

    calendarService.addEvent(vm.newEvent, confirmAddedEvent);
  }

  function confirmAddedEvent(err) {
    if (err) {
      console.log(err)
      vm.errMsg.add = err;
    } else {
      vm.errMsg.add = '';
    }
  }

  function setDefaultTime() {
    var d = new Date();
    var e = new Date();
    d.setHours(9);
    d.setMinutes(0);
    vm.startTime = d;
    e.setHours(10);
    e.setMinutes(0);
    vm.endTime = e;
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
      vm.errMsg.search = result;
      $scope.$apply();
      return;
    }
    vm.errMsg.search = '';
    vm.calendarEvents = calendarService.calendarEvents;
    $scope.$apply();
  }
}