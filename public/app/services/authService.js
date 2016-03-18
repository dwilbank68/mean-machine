angular
    .module('authService', [])

    .factory('AuthSvc', function($http, $q, AuthToken) {
        var authFactory = {};

        authFactory.login = function(username, password) {
            console.log('login called');
            return $http
                    .post('/api/authenticate', {
                        username: username,
                        password: password
                    })
                    .success(function(data) {
                        AuthToken.setToken(data.token);
                        console.log('data is ', data);
                        return data;
                    });
        };

        authFactory.logout = function() {
            AuthToken.setToken();
        };

        authFactory.isLoggedIn = function() {
            if (AuthToken.getToken())
                return true;
            else
                return false;
        };

        authFactory.getUser = function() {
            if (AuthToken.getToken())
                return $http.get('/api/me', { cache: true });
            else
                return $q.reject({ message: 'User has no token.' });
        };

        authFactory.createSampleUser = function() {
            $http.post('/api/sample');
        };

        // return auth factory object
        return authFactory;

    })


    .factory('AuthToken', function($window) {
        var authTokenFactory = {};
        console.log('AuthToken firing');
        authTokenFactory.getToken = function() {
            return $window.localStorage.getItem('token');
        };
        authTokenFactory.setToken = function(token) {
            if (token)
                $window.localStorage.setItem('token', token);
            else
                $window.localStorage.removeItem('token');
        };
        return authTokenFactory;
    })

    // ===================================================
    // application configuration to integrate token into requests
    // ===================================================
    .factory('AuthInterceptor', function($q, $location, AuthToken) {
        var interceptorFactory = {};
        // this will happen on all HTTP requests
        interceptorFactory
            .request = function(config) {
                var token = AuthToken.getToken();
                if (token) config.headers['x-access-token'] = token;
                return config;
            };
        // happens on response errors
        interceptorFactory
            .responseError = function(response) {
            // if our server returns a 403 forbidden response
                if (response.status == 403) {
                    AuthToken.setToken();
                    $location.path('/login');
                }
                return $q.reject(response);
            };

        return interceptorFactory;

    });