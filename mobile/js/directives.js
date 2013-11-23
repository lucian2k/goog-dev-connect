'use strict';

angular.module('directives')
.directive('notification', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/views/notification.html',
        scope: {
            message: '@'
        },
        link: function (scope, elem, attrs) {
            scope.close = function () {
                scope.$destroy();
                angular.element(elem).remove();
            }
        }
    }
});