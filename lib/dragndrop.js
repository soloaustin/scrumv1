var dragndropDirective = {};
angular.forEach('Dragstart Dragend Dragover Dragleave Drop'.split(' '), function(name) {
  var directiveName = 'ng' + name;
  dragndropDirective[directiveName] = ['$parse', function($parse) {
    return function(scope, element, attr) {

      if (element.dragDrop) {
          element.bind('mousemove', function(e){
            if (window.event.button == 1) {
                e.srcElement.dragDrop();
            }
          });
        }

      var fn = $parse(attr[directiveName]);
      element.bind(name.toLowerCase(), function(event) {
        scope.$apply(function() {
          fn(scope, {
            $event: event
          });
        });
      });
    };
  }];
});
var ngRightClick = "ngRightClick";
dragndropDirective[ngRightClick] = ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr[ngRightClick]);

  angular.forEach('mousedown mouseup click dblclick contextmenu'.split(' '), function(name) {

      element.bind(name, function(event) {
        var isRightButton = event.which == null ? (event.button>2&&event.button!=4) : (event.which>2);
        if (!isRightButton) {
          return;
        } else {
          if(name=="mousedown"){
            var posx = 0 ,posy = 0;
            if (event.pageX || event.pageY) {
              posx = event.pageX;
              posy = event.pageY;
            } else if (event.clientX || event.clientY) {
              posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
              posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            scope.$apply(function() {
              fn(scope, {
                $event: event,
                $position:{x:posx,y:posx}
              });
            });
          }
          suppressBrowserMenu(event);
        }
      });
  });


  };
}];

var suppressBrowserMenu = function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }

    /* Hack to suppress Operas default context menu */
    if (navigator.userAgent.indexOf('Opera') != -1) {
      window.blur();
      window.focus();
    }
    return false;

  };

angular.module('scrumv1', []).directive(dragndropDirective);