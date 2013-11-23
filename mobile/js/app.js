angular.module('apple-pi', ['ionic'])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/login'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'Login'
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'Dashboard'
        })
        .when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'Profile'
        })
        .otherwise('/');
})
.service('Api', function ($http) {
    var Api = {
        get: function (resource, data) {

        },
        post: function (resource, data) {
            return $http.post('api/' + resource, data);
        }
    };

    return Api;
})
.service('User', function () {
    var User = {
        avatar: 'gravatar.jpg',
        fn: 'Giorgio',
        ln: 'Armani'
    };

    return User;
})
.controller('Login', function ($scope, $location, $timeout, Api) {
    $scope.user = {
        username: '',
        password: ''
    };

    $scope.logIn = function () {
        Api
            .post('login', $scope.user)
            .success(function (data) {

            })
            .error(function (data) {
                $scope.showError = true;
                $timeout(function () {
                    $scope.showError = false;
                }, 5000);
            });

        $location.path('/dashboard');
    }
})
.controller('Dashboard', function ($scope, $location, User) {
    $scope.location = {
        name: 'Baneasa Shopping City'
    };

    $scope.user = User;

    $scope.openLeft = function () {
        $scope.sideMenuController.toggleLeft();
    };

    $scope.logOut = function () {
        $location.path('/');
    };
})
.controller('Profile', function ($scope, User) {
    $scope.user = {
        fn: User.fn,
        ln: User.ln
    }
});