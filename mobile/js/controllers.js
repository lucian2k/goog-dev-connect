angular.module('controllers')
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
})
.controller('AddFriend', function ($scope, $location, $timeout, Api, DS) {
    $scope.friend = {
        name: ''
    };

    $scope.addFriend = function () {
        if (!$scope.friend.name.length) {
            $scope.showError = true;
            $timeout(function () {
                $scope.showError = false;
            }, 5000);
        }
        Api
            .post('friend/add', {name: $scope.friend.name})
            .success(function () {

            })
            .error(function () {

            });
        $location.path('/dashboard');
    };
});