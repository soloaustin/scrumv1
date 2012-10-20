function OverviewCtrl($scope,$http){
	$scope.projectId = "5d6f7345225db529a15a166f45000619";
	$scope.currentProject = {};
	$http.get('./db/projects/'+$scope.projectId).success(function(response, code){
		$scope.currentProject = response;
	});
}