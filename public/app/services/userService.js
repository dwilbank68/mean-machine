angular
    .module('userService', [])
    .factory('UserSvc', function($http){
        var userFactory = {};

        userFactory.get = function(id){
            return $http.get('/api/users/' + id);
        }

        userFactory.all = function(id){
            return $http.get('/api/users');
        }

        userFactory.create = function(userData){
            return $http.post('/api/users', userData);
        }

        userFactory.update = function(id, userData){
            return $http.put('/api/users/' + id, userData);
        }

        userFactory.delete = function(id){
            return $http.delete('/api/users/' + id);
        }

        return userFactory;
    })