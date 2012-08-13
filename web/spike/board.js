function BoardCtrl($scope) {
    $scope.tasks = [];
    initDragContext();
}
function initDragContext(){
	DragDropHelpers.fixVisualCues=true;
    var taskNodes, taskContainers, currentlyDraggedNode;
    taskNodes = cssQuery('[draggable=true]');
    for (var i = 0; i < taskNodes.length; i++) {
        EventHelpers.addEvent(taskNodes[i], 'dragstart', dragStartHandler);
        EventHelpers.addEvent(taskNodes[i], 'dragend', dragEndHandler);
    };

    taskContainers = cssQuery('.taskContainer');
    for (var i = 0; i < taskContainers.length; i++) {
        EventHelpers.addEvent(taskContainers[i], 'dragover', dragOverHandler);
        EventHelpers.addEvent(taskContainers[i], 'dragleave', dragLeaveHandler);
        EventHelpers.addEvent(taskContainers[i], 'drop', dropHandler);
    };
}
function dragStartHandler(e) {
    e.dataTransfer.setData("Text", "draggedUser: " + this.innerHTML);
    currentlyDraggedNode = this;
}

function dragEndHandler(e) {

}


function dragLeaveHandler(e) {}

function dropHandler(e) {
    var data = e.dataTransfer.getData("Text");
    if (data.indexOf("draggedUser: ") != 0) {
        alert("Only users within this page are draggable.")
    }

    currentlyDraggedNode.parentNode.removeChild(currentlyDraggedNode);
    this.appendChild(currentlyDraggedNode);
    taskDragEndEvent(e);
}

function dragOverHandler(e) {

    EventHelpers.preventDefault(e);
}
