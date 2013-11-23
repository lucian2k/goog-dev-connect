angular.module('apple-pi', ['ionic', 'controllers', services])
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
        .when('/location', {
            templateUrl: 'views/location.html',
            controller: 'Location'
        })
        .when('/friend/add', {
            templateUrl: '/views/add-friend.html',
            controller: 'AddFriend'
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
// Data source service
.service('DS', function () {
    var DS = {
        location: {
            name: 'Baneasa Shopping City',
            pic: 'http://www.petocuri.ro/uploads/pics/ENTERTAINMENT_20ENTRANCE_20BANEASA_20SHOPPING_20CITY.jpg',
            desc: 'The biggest and fanciest romanian mall',
            lat: 45.2,
            lng: 44.52
        },

        friends: [{
            fn: 'Leo',
            ln: 'Messi',
            active: 1,
        },
        {
            fn: 'Cristi',
            ln: 'Ronaldo',
            active: 0
        }]
    };

    return DS;
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
.controller('Dashboard', function ($scope, $location, DS, User) {
    $scope.user = User;
    $scope.location = DS.location;
    $scope.friends = DS.friends;

    $scope.openLeft = function () {
        $scope.sideMenuController.toggleLeft();
    };

    $scope.openRight = function () {
        $scope.sideMenuController.toggleRight();
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
})
.controller('Location', function ($scope, DS) {
    $scope.location = DS.location;
});