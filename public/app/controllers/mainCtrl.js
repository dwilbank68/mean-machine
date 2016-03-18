//angular
//    .module('mainCtrl', [])
//    .controller('mainController', function($rootScope, $location, AuthSvc){
//
//        var vm = this;
//
//        vm.loggedIn = AuthSvc.isLoggedIn();
//
//        $rootScope.$on('$routeChangeStart', function(){
//            vm.loggedIn = AuthSvc.isLoggedIn();
//            AuthSvc
//                .getUser()
//                .success(function(data){
//                    vm.user = data;
//                })
//        })
//
//        vm.doLogin = function(){
//            AuthSvc
//                .login(vm.loginData.username, vm.loginData.password)
//                .success(function(data){
//                    $location.path('/users');
//                });
//        };
//
//        vm.doLogout = function() {
//            AuthSvc.logout();
//            vm.user = {};
//            $location.path('/login');
//        };
//
//    });

angular.module('mainCtrl', [])

    .controller('mainController', function($rootScope, $location, AuthSvc) {

        var vm = this;

        // get info if a person is logged in
        vm.loggedIn = AuthSvc.isLoggedIn();

        // check to see if a user is logged in on every request
        $rootScope.$on('$routeChangeStart', function() {
            vm.loggedIn = AuthSvc.isLoggedIn();
            // get user information on page load
            AuthSvc.getUser()
                .then(function(data) {
                    vm.user = data.data;
                });
        });

        // function to handle login form
        vm.doLogin = function() {
            vm.processing = true;
            vm.error = '';
            AuthSvc
                .login(vm.loginData.username, vm.loginData.password)
                .success(function(data) {
                    vm.processing = false;
                    // if a user successfully logs in, redirect to users page
                    if (data.success)
                        $location.path('/users');
                    else
                        vm.error = data.message;

                });
        };

        // function to handle logging out
        vm.doLogout = function() {
            AuthSvc.logout();
            vm.user = '';
            $location.path('/login');
        };

        vm.createSample = function() {
            AuthSvc.createSampleUser();
        };

    });

