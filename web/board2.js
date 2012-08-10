function BoardCtrl($scope, $http) {
    $scope.stories = [];
    $http.get('http://127.0.0.1:5984/tasks/_design/board/_view/query_board?group_level=1').success(function(response, code) {
        $scope.stories = response.rows;
        EventHelpers.addPageLoadEvent('DragDropHelpers.init');
    });
    DragDropHelpers.fixVisualCues = true;
    var taskNodes, taskContainers, currentlyDraggedNode;

    $scope.dragStartHandler = function(e,task) {
        e.dataTransfer.setData("Task", angular.toJson(task));
        currentlyDraggedNode = this;
    };
    $scope.dragEndHandler = function(e) {

    };
    $scope.dragOverHandler = function(e) {
        EventHelpers.preventDefault(e);
    };
    $scope.dropHandler = function(e,story,status) {
        var sourceTask = e.dataTransfer.getData("Task");
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
    $scope.taskClickHandler = function(e,p){
        console.log(p.x + " " + p.y);
    };
}