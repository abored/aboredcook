angular.module('usersFactory', [])
    .factory('Users', ['$http', 'Auth', function($http, Auth) {
        var o = {};
        o.getCurrentUser = function() {
            var userId = Auth.currentUserId();
            if (userId) {
                return $http.get('/users/' + userId).then(function(res) {
                    return res.data;
                });
            } else {
                return "";
            }
        };

        o.getUserByUsername = function(username) {
            return $http.get('/users/' + username).then(function(res) {
                console.log(res.data);
                return res.data;
            });
        }

        o.editUser = function(user) {
            return $http.put('/me/edit', user, {
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            }).then(function(res) {

                return res.data;
            });
        }

        return o;
    }])
