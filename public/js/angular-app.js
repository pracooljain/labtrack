var app = angular.module('labtrackApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {

  $routeProvider

    .when('/opportunities', {
      templateUrl: '/partials/opportunities.html',
      controller: 'OpportunitiesCtrl'
    })

    .when('/my-applications', {
      templateUrl: '/partials/my-applications.html',
      controller: 'MyApplicationsCtrl'
    })

    .when('/showcase', {
      templateUrl: '/partials/showcase.html',
      controller: 'ShowcaseCtrl'
    })

    .when('/notifications', {
      templateUrl: '/partials/notifications.html',
      controller: 'NotificationsCtrl'
    })

    .when('/profile', {
      templateUrl: '/partials/profile.html',
      controller: 'ProfileCtrl'
    })

    .otherwise({
      redirectTo: '/opportunities'
    });

  $locationProvider.hashPrefix('!');
});

// Opportunities Controller
app.controller('OpportunitiesCtrl', function($scope, $http) {
  $scope.opportunities = [];
  $scope.search = '';
  $scope.loading = true;

  $http.get('/opportunities/api').then(function(res) {
    $scope.opportunities = res.data;
    $scope.loading = false;
  }).catch(function() {
    $scope.loading = false;
  });

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

  $scope.appreciate = function(showcase) {
    $http.post('/showcase/appreciate/' + showcase._id).then(function(res) {
      if (res.data.success) {
        showcase.appreciations = res.data.appreciations;
        // jQuery animation
        $('#appreciate-' + showcase._id).addClass('pulse');
        setTimeout(function() {
          $('#appreciate-' + showcase._id).removeClass('pulse');
        }, 300);
      }
    });
  };

  $scope.filterShowcases = function(s) {
    if (!$scope.search) return true;
    var q = $scope.search.toLowerCase();
    return s.title.toLowerCase().includes(q);
  };
});

// Notifications Controller
app.controller('NotificationsCtrl', function($scope, $http) {
  $scope.notifications = [];
  $scope.loading = true;

  $http.get('/notifications/api').then(function(res) {
    $scope.notifications = res.data;
    $scope.loading = false;
  }).catch(function() {
    $scope.loading = false;
  });

  $scope.markRead = function(notification) {
    $http.post('/notifications/read/' + notification._id).then(function() {
      notification.isRead = true;
    });
  };

  $scope.markAllRead = function() {
    $http.post('/notifications/read-all').then(function() {
      $scope.notifications.forEach(function(n) {
        n.isRead = true;
      });
    });
  };
});

// Profile Controller
app.controller('ProfileCtrl', function($scope, $http) {
  $scope.profile = null;
  $scope.loading = true;

  $http.get('/auth/profile/api').then(function(res) {
    $scope.profile = res.data;
    $scope.loading = false;
  }).catch(function() {
    $scope.loading = false;
  });
});