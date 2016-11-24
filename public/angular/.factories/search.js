angular.module('searchFactory', [])
    .factory('search', ['$http', function($http) {
        var o = {
            results: []
        };
        o.find = function(searchText) {
            // returner hvad der fås tilbage fra route kaldet
            return $http.get('/search/' + searchText)
                .success(function(data) {
                    console.log(data);
                    angular.copy(data, o.results);
                });
        }
        return o;
    }])
