(function() {
    var extendDirective = {};
    var dragEffectNode;
    var currentlyDragged;
    var cachedShowVisualCues = null;

    var getAbsoluteLeft = function(obj) {
            var curleft = obj.offsetLeft;
            if (obj.offsetParent) {

                while (obj = obj.offsetParent) {
                    curleft += obj.offsetLeft - obj.scrollLeft;
                }
            }
            return curleft;
        };

    var getAbsoluteTop = function(node) {
            var obj = node;
            var positionArray = new Array();

            var curtop = obj.offsetTop;
            if (obj.offsetParent) {

                while (obj = obj.offsetParent) {
                    curtop += obj.offsetTop - obj.scrollTop;
                }
            }
            return curtop;
        };
    /*
     *drag effect node exist detection
     */

    function doesShowVisualCues(e) {
        if (cachedShowVisualCues == null) {
            cachedShowVisualCues = true;
            if (e.dataTransfer.setDragImage) {
                var chromeString = navigator.userAgent.match(/Chrome\/[0-9]\.[0-9]/);
                if (chromeString) {
                    var info = chromeString[0].split('/');

                    if (parseFloat(info[1]) < 5) {
                        cachedShowVisualCues = false;
                    }
                }
            } else {
                cachedShowVisualCues = false;
            }
        }
        return cachedShowVisualCues;
    }
    angular.element().ready(function() {
        //TODO: add ie detection
        document.oncontextmenu=function(e){return false;}   

        
        var body = document.getElementsByTagName('body')[0];
        angular.element(body).bind('drag', function(e) {
            if (!doesShowVisualCues(e)) {
                var nodeLeft = getAbsoluteLeft(currentlyDragged[0]);
                var nodeTop = getAbsoluteTop(currentlyDragged[0]);
                dragEffectNode[0].style.visibility = 'visible';
                dragEffectNode[0].style.left = (e.offsetX + nodeLeft) + 'px';
                dragEffectNode[0].style.top = (e.offsetY + nodeTop + 5) + 'px';
            }
        });

    });

    extendDirective['ngDraggable'] = function() {
        return function(scope, element, attr) {
            attr.$set("draggable", "true");
            element[0].style.cursor = 'move';

            /*
             * This block allows IE to drag any arbitrary object,
             * not just links and images.
             */
            if (element[0].dragDrop) {
                element.bind('mousemove', function(e) {
                    if (window.event.button == 1) {
                        element[0].dragDrop();
                    }
                });
            }
            element.bind('dragstart', function(e) {
                if (!doesShowVisualCues(e)) {
                    dragEffectNode = element.clone();

                    document.body.appendChild(dragEffectNode[0]);
                    dragEffectNode[0].style.position = 'absolute';
                    dragEffectNode[0].style.visibility = 'hidden';
                    //CSSHelpers.setOpacity(dragEffectNode, 50);
                    currentlyDragged = element;
                }
            });
            element.bind('dragend', function(e) {
                if (!doesShowVisualCues(e)) {
                    if (document.body.contains(dragEffectNode[0])) document.body.removeChild(dragEffectNode[0]);
                }
            });
        };
    };


    angular.forEach('Dragstart Dragend Dragover Dragleave Drop'.split(' '), function(name) {
        var directiveName = 'ng' + name;
        extendDirective[directiveName] = ['$parse', function($parse) {
            return function(scope, element, attr) {
                var fn = $parse(attr[directiveName]);
                element.bind(name.toLowerCase(), function(event) {

                    //Drop event AOP for dispose cloned ie drag node
                    if (name == "Drop") {
                        if (!doesShowVisualCues(event)) {
                            if (document.body.contains(dragEffectNode[0])) document.body.removeChild(dragEffectNode[0]);
                        }
                    }
                    //execute registed code behind event handler
                    scope.$apply(function() {
                        fn(scope, {
                            $event: event
                        });
                    });
                    //Drop event AOP for firefox drop event issue
                    //otherwise it will forward to unknown page
                    if (name == "Drop") {
                        event.preventDefault();
                    }

                });
            };
        }];
    });



    var ngRightclick = "ngRightclick";
    extendDirective[ngRightclick] = ['$parse', function($parse) {
        return function(scope, element, attr) {
            var fn = $parse(attr[ngRightclick]);

            angular.forEach('mousedown mouseup click dblclick contextmenu'.split(' '), function(name) {

                element.bind(name, function(event) {
                    var isRightButton = event.which == null ? (event.button >= 2 && event.button != 4) : (event.which > 2);
                    if (!isRightButton) {
                        return;
                    } else {
                        suppressBrowserMenu(event);
                        if (name == "mousedown") {
                            var posx = 0,
                                posy = 0;
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
                                    $position: {
                                        x: posx,
                                        y: posy
                                    }
                                });
                            });
                        }
                        
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
            e.cancelBubble = true 
            e.returnValue = false;
            /* Hack to suppress Operas default context menu */
            if (navigator.userAgent.indexOf('Opera') != -1) {
                window.blur();
                window.focus();
            }
            return false;

        };

    angular.module('scrumv1', []).directive(extendDirective);
})();
