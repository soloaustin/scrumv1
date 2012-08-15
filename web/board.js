function BoardCtrl($scope, $http) {
    $scope.contextMenu = {left:0,top:0};
    $scope.taskStatus = ['todo','inProgress','done'];
    $scope.legends = ['Development','Test','QAuto','Framework','UI']
    $scope.members = [{name:'Austin'},{name:'Aaron'}];
    $scope.newTask = {};
    $scope.newTask.assignTo = $scope.members[0];
    $scope.stories = [];
    $http.get('http://localhost:8125/db/tasks/_design/board/_view/query_board?group_level=1').success(function(response, code) {
        $scope.stories = response.rows;
    });
    var taskNodes, taskContainers;

    $scope.dragStartHandler = function(e,task) {
        e.dataTransfer.setData("Text", angular.toJson(task));
    };
    $scope.dragEndHandler = function(e) {

    };
    $scope.dragOverHandler = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        
        try {
            e.returnValue = false;
        } 
        catch (ex) {
            // do nothing
        }
        e.preventDefault();
    };
    $scope.dropHandler = function(e,story,status) {
        var sourceTask = e.dataTransfer.getData("Text");
        var targetTask = null;
        sourceTask = angular.fromJson(sourceTask);
        if(sourceTask.story != story.key){
            return;
        }
        story = story.value;

        console.log("sourceTask\n"+sourceTask.id);
        
        targetTask = _.find(_.union(story.todo,story.inProgress,story.done),function(task){
            console.log(task.id);
            return task.id == sourceTask.id;
        });
        if(targetTask.status!=status){
            story[targetTask.status] = _.filter(story[targetTask.status],function(task){
                return task.id != targetTask.id;
            });
            targetTask.status = status;
            story[status].push(targetTask);
        }
        
        console.log(targetTask);
        console.log($scope.stories);
        
    };
    $scope.rightclickHandler = function(e,p){
        $scope.showContext = true;
        $scope.contextMenu.left = p.x + "px";
        $scope.contextMenu.top = p.y + "px";
    };
}