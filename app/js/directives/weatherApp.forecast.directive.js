'use strict';

/* Directives */

angular.module('weatherApp.directives', [])

  //
  // Create directive that handles formatting, resource fetching and
  // output of weather data for a specific date
  //
  .directive('weatherPanel', [function factory() {
    return {
      restrict: 'EA',

      scope: {
        useDayForecast: '=showEntry',
        forecast: '=weatherPanel',
        selectedUnit: '=selectedUnit'
      },

      templateUrl: 'partials/_weather-panel.html',

      link: function(scope, element, attrs) {
        // Get icon image url
        scope.getIconImageUrl = function(iconName) {
          return (iconName ? 'http://openweathermap.org/img/w/' + iconName + '.png' : '');
        };

        scope.parseDate = function (time) {
          return new Date(time * 1000);
        };
      }
    };
  }]);
