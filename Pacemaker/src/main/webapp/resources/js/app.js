'use strict';
var PacemakerApp = angular.module('PacemakerApp', ['components','ngRoute','ui.bootstrap']);

PacemakerApp.config(['$routeProvider', function ($routeProvider) {	
	$routeProvider.when('/summary', {
		templateUrl: 'summary/layout'       
	}).when('/liveStatusSingle/:serviceName', {
		templateUrl: 'liveStatus/singleLayout',
		controller: 'SingleLiveStatusController'
	}).when('/construction', {
		templateUrl: 'summary/progress'       
	}).when('/serviceSummary', {
		templateUrl: 'summary/serviceSummary',
	}).when('/serviceTroubleShoot', {
		templateUrl: 'summary/serviceTroubleShoot',
		controller: 'ServicesSummaryController'
	}).when('/utility', {
		templateUrl: 'summary/utility'
	}).when('/dbinfo', {
		templateUrl: 'summary/dbinfo'
	}).when('/redirect/:menuItem', {
		templateUrl: 'summary/layout',
		controller:'MenuRedirectController'
	}).otherwise({
		redirectTo: '/summary'
	});
}]);


PacemakerApp.controller('TestSelectControl', function($scope, $http, $location){
	$scope.selectAction = function() {	
		if(null != $scope.member){		
			console.log("--> Menu Change " + $scope.selectedOperationName.testDescription);
			$scope.initialMessageToTest = $scope.selectedOperationName.testDescription;			
		}	
	};	

	$scope.resetTestServiceForm = function() {
		$scope.resetError();
		$scope.ts = {};
	};

	$scope.resetError = function() {
		$scope.error = false;
		$scope.errorMessage = '';
	};

	$scope.setError = function(message) {
		$scope.error = true;
		$scope.errorMessage = message;
	};

	$scope.testSoapMethod = function(ts) {
		$scope.resetError();
		console.log("--> Test " + $scope.member.name + " for " + ts.name);
		console.log("--> Test Data" + ts.testDescription);
		if(ts.testEndPoint == ''){
			ts.testEndPoint = $scope.member.endpoint;
		}
		console.log("--> Submitting form");
		$http.post('testservice/soaptest', ts).success(function(ts) {
			console.log("--> Submitting success" + ts.testOutPut);
			$scope.ts = ts;
			$scope.selectedOperationName.testOutPut = ts.testOutPut;
		}).error(function() {
			$scope.setError('Error. Could not perform testing!');
		});		
	};	

	$scope.resetSoapMethod = function(ts) {
		console.log("--> Resetting" + ts.testDescription);
		if(null != $scope.initialMessageToTest){	
			console.log("--> With" + $scope.initialMessageToTest);
			ts.testDescription = $scope.initialMessageToTest;
			ts.testOutPut ='';
		}		
	};	
});

PacemakerApp.controller('TestRestSelectControl', function($scope, $http, $location){	
	$scope.testRestMethod = function(messageDetails) {	
		console.log("--> Test " + $scope.member.name + " for " + messageDetails.name);
		console.log("--> Test Data" + messageDetails.testDescription);
		console.log("--> Submitting form");
		$http.post('testservice/resttest', messageDetails).success(function(messageDetails) {
			console.log("--> Submitting success" + messageDetails.testOutPut);
			$scope.messageDetails = messageDetails;
			$scope.selectedOperationName.testOutPut = messageDetails.testOutPut;
		}).error(function() {
			$scope.setError('Error. Could not perform testing!');
		});	
		
	};	

	$scope.resetRestMethod = function(messageDetails) {
		console.log("--> Resetting" + $scope.operationRestInputURL);
		messageDetails.testEndPoint='';
		messageDetails.testDescription='';
		messageDetails.testOutPut='';
	};	

});

PacemakerApp.controller('SummaryController', function($scope, $http,$location) {
	$http.get('summary/summarylist.json').success(function(summarylist){
		$scope.services = [];
		$scope.liveservices = [];
		$scope.services = summarylist;
	});

	$scope.$watch('selectedServiceName', function(selectedServiceName) {
		if (!selectedServiceName) {
			return;
		}
		$location.path('/liveStatusSingle/' + $scope.selectedServiceName.name);
	});
});

PacemakerApp.controller('SingleLiveStatusController', [ '$scope', '$http',
	'$routeParams', function($scope, $http, $routeParams) {
		var url = 'liveStatus/member.json/' + $routeParams.serviceName;
		$http.get(url).success(function(member) {
			$scope.member = member;
		});
	} ]);

PacemakerApp.controller('MenuRedirectController',['$routeParams','$window',
                                                  function($routeParams,$window) {
	if($routeParams.menuItem == 'graphite'){
		$window.open('http://graphite.prod.ch4.s.com/');
	}else if($routeParams.menuItem == 'esbmon'){
		$window.open('http://esbmon.intra.sears.com');
	}
}]);

PacemakerApp.controller('ServicesSummaryController', function($scope, $http,$location) {
	$http.get('summary/summarylivelist.json').success(function(liveServicesList){
		$scope.liveservices = [];
		$scope.liveservices = liveServicesList;
	});	
   /* $scope.fetchLiveStatus = function(serviceName) {
    	var url = 'liveStatus/member.json/' + serviceName;
    	alert("SingleLiveStatusController");
        $http.get(url).success(function(member){
            $scope.member = member;
        });
    };*/
});