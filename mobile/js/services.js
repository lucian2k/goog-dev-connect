angular.module('services')
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