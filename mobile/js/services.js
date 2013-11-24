angular.module('services')
.service('Api', function ($http, Cookie) {
    var instance = 'http://localhost:8001';

    var call = function (method, url, data) {
        return $http({
            method: method,
            url: instance + '/api/' + url,
            data: method !== 'GET' ? data : {},
            params: method === 'GET' ? data: {},
            headers: {
                'X-CSRFToken': Cookie.get('csrftoken'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    };

    var Api = {
        get: function (resource, data) {
            return call('GET', resource, data);
        },
        post: function (resource, data) {
            return call('POST', resource, data);
        }
    };

    return Api;
})
.service('User', function () {
    var User = {
        avatar: 'gravatar.jpg',
        fn: 'Alex',
        ln: 'Bardas'
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
            lat: 44.43,
            lng: 26.1
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
.factory('Cookie', function () {
    var pluses = /\+/g, cookie = {}, config;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? angular.toJson(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
        } catch (e) {
            return;
        }

        try {
            // If we can't parse the cookie, ignore it, it's unusable.
            return config.json ? angular.fromJson(s) : s;
        } catch (e) {

        }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return angular.isFunction(converter) ? converter(value) : value;
    }

    config = cookie.set = cookie.get = function (key, value, options) {

        // Write
        if (value !== undefined && !angular.isFunction(value)) {
            options = angular.extend({}, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                // use expires attribute, max-age is not supported by IE
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join('');

            return document.cookie;
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling Cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    cookie.remove = function (key, options) {
        if (cookie.get(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            cookie.set(key, '', angular.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

    return cookie;
});
