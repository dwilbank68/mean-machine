angular
    .module('userCtrl', ['userService'])
    .controller('userController', function(UserSvc){

        var vm = this;

        vm.processing = true;

        // grab all the users at page load
        UserSvc
            .all()
            .success(function(data) {
                vm.processing = false;
                vm.users = data;
            });

        vm.deleteUser = function(id) {
            vm.processing = true;
            console.log('id is ', id);
            UserSvc
                .delete(id)
                .success(function(data) {
                    UserSvc.all()
                        .success(function(data) {
                            vm.processing = false;
                            vm.users = data;
                        });

                });
        };

    })

    .controller('userCreateController', function(UserSvc){
        var vm = this;
        vm.type = 'create';
        vm.saveUser = function(){
            vm.processing = true;
            vm.message = '';
            UserSvc
                .create(vm.userData)
                .success(function(data){
                    vm.processing = false;
                    vm.userData = {};
                    vm.message = data.message;
                });
        };
    })

    .controller('userEditController', function($routeParams, UserSvc){
        var vm = this;
        vm.type = 'edit';
        console.log('user id is ', $routeParams.user_id);
        UserSvc
            .get($routeParams.user_id)
            .success(function(data){
                vm.userData = data;
                console.log('and data is ', data);
            });
        vm.saveUser = function(){
            vm.processing = true;
            vm.message = '';
            UserSvc
                .update($routeParams.user_id, vm.userData)
                .success(function(data){
                    vm.processing = false;
                    vm.userData = {};
                    vm.message = data.message;
                });
        };
    })