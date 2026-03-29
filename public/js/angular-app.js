// Define the AngularJS app
var app = angular.module('labtrackApp', ['ngRoute']);

// Configure routes
app.config(function($routeProvider, $locationProvider) {

  $routeProvider

    // Opportunities board
    .when('/opportunities', {
      templateUrl: '/partials/opportunities.html',
      controller: 'OpportunitiesCtrl'
    })

    // My applications (student)
    .when('/my-applications', {
      templateUrl: '/partials/my-applications.html',
      controller: 'MyApplicationsCtrl'
    })

    // Showcase wall
    .when('/showcase', {
      templateUrl: '/partials/showcase.html',
      controller: 'ShowcaseCtrl'
    })

    // Default route
    .otherwise({
      redirectTo: '/opportunities'
    });

  // Use hash-based URLs e.g. /#/opportunities
  $locationProvider.hashPrefix('!');
});

// Opportunities Controller
app.controller('OpportunitiesCtrl', function($scope, $http) {
  $scope.opportunities = [];
  $scope.search = '';
  $scope.loading = true;

  // Fetch opportunities from our REST API
  $http.get('/opportunities/api').then(function(res) {
    $scope.opportunities = res.data;
    $scope.loading = false;
  }).catch(function() {
    $scope.loading = false;
  });

  // Filter opportunities by search
  $scope.filterOpportunities = function(opp) {
    if (!$scope.search) return true;
    var s = $scope.search.toLowerCase();
    return opp.title.toLowerCase().includes(s) ||
           opp.domain.toLowerCase().includes(s);
  };
});

// My Applications Controller
app.controller('MyApplicationsCtrl', function($scope, $http) {
  $scope.applications = [];
  $scope.loading = true;

  $http.get('/applications/api').then(function(res) {
    $scope.applications = res.data;
    $scope.loading = false;
  }).catch(function() {
    $scope.loading = false;
  });
});

// Showcase Controller
app.controller('ShowcaseCtrl', function($scope, $http) {
  $scope.showcases = [];
  $scope.search = '';
  $scope.loading = true;

  $http.get('/showcase/api').then(function(res) {
    $scope.showcases = res.data;
    $scope.loading = false;
  }).catch(function() {
    $scope.loading = false;
  });

  // Appreciate a showcase
  $scope.appreciate = function(showcase) {
    $http.post('/showcase/appreciate/' + showcase._id).then(function(res) {
      if (res.data.success) {
        showcase.appreciations = res.data.appreciations;
      }
    });
  };

  // Filter showcases by search
  $scope.filterShowcases = function(s) {
    if (!$scope.search) return true;
    var q = $scope.search.toLowerCase();
    return s.title.toLowerCase().includes(q);
  };
});