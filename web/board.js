function BoardCtrl($scope, $http) {
    $scope.host = ".";//"http://localhost:8125";
    $scope.contextMenu = {
        left: 0,
        top: 0
    };
    $scope.taskStatus = ['todo', 'inProgress', 'done'];
    $scope.legends = [{
        value: 'dev',
        label: 'Development'
    }, {
        value: 'qa',
        label: 'Test'
    }, {
        value: 'qauto',
        label: 'QAuto'
    }, {
        value: 'framework',
        label: 'Framework'
    }, {
        label: 'UI',
        value: 'ui'
    }];
    $scope.members = [{
        name: 'austin'
    }, {
        name: 'aaron'
    }]; //_.map([{name:'austin'},{name:'aaron'}],function(member){return member.name});
    $scope.currentTask = {};

    $scope.stories = [];
    $http.get($scope.host+'/db/stories/_design/sprint_backlog/_view/all', {
        params: {
            key: {
                "project": 1,
                "sprint": 1
            }
        }
    }).success(function(response, code) {
        var tempStories = _.map(response.rows, function(story) {
            return _.pick(story, 'value').value;
        })
        $http.get($scope.host+'/db/tasks/_design/board/_view/query_board', {
            params: {
                group_level: 1
            }
        }).success(function(response, code) {
            var storyTasks = {};
            _.each(response.rows, function(story) {
                storyTasks[story.key] = story.value;
            });
            $scope.stories = _.map(tempStories, function(story) {
                return _.extend(story, {
                    tasks: storyTasks[story.id]
                });
            });

        });
    });


    $scope.createTask = function() {
        if($scope.currentTask.id){
            $http.put($scope.host+'/db/tasks/'+$scope.currentTask.id, angular.toJson($scope.currentTask)).success(function(response, code) {
                $scope.currentTask._rev = response.rev;
                $('#myModal').modal('hide');
            });
        }else{
            $http.post($scope.host+'/db/tasks/', angular.toJson($scope.currentTask)).success(function(response, code) {
                $scope.currentTask._rev = response.rev;
                $('#myModal').modal('hide');
            });
        }
        
    };

    $scope.popupCreateModal = function() {
        $scope.currentTask = {story:$scope.currentTask.story,status:'todo'};
        $scope.createOrEdit = "Create";
        $scope.createOrSave = "Create New Task";
    };
    $scope.popupEditModal = function() {
        $scope.createOrEdit = "Edit";
        $scope.createOrSave = "Save Changes";
    };

    var taskNodes, taskContainers;

    $scope.dragStartHandler = function(e, task) {
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
        } catch (ex) {
            // do nothing
        }
        e.preventDefault();
    };
    $scope.dropHandler = function(e, story, status) {
        var sourceTask = e.dataTransfer.getData("Text");
        var targetTask = null;
        sourceTask = angular.fromJson(sourceTask);
        if (sourceTask.story != story.id) {
            return;
        }
        var tasks = story.tasks;

        targetTask = _.find(_.union(tasks.todo, tasks.inProgress, tasks.done), function(task) {
            return task.id == sourceTask.id;
        });
        if (targetTask.status != status) {
            tasks[targetTask.status] = _.filter(tasks[targetTask.status], function(task) {
                return task.id != targetTask.id;
            });
            targetTask.status = status;
            tasks[status].push(targetTask);
            $http.put($scope.host+'/db/tasks/'+targetTask.id, angular.toJson(targetTask)).success(function(response, code) {
                $scope.targetTask._rev = response.rev;
            });
        }


    };
    $scope.rightclickHandler = function(e, p, storyId, newOnlyFlag, editTask) {
        $scope.showContext = true;
        $scope.contextMenu.left = p.x + "px";
        $scope.contextMenu.top = p.y + "px";

        $scope.newOnly = newOnlyFlag;
        if ($scope.newOnly) {
            $scope.currentTask = {story:storyId};
        } else {
            $scope.currentTask = editTask;
        }
    };
}
