function BacklogCtrl($scope,$http){
	$scope.projectId = "5d6f7345225db529a15a166f45000619";
	$scope.unassignedStory = [];
	$http.get('./db/stories/_design/stories/_view/unassignedStory',{params: {key:"\""+$scope.projectId+"\""}}).success(function(response, code){
		$scope.unassignedStory = response.rows;
	});
}