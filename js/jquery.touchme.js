/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad
 * Common usage: wipe images (left and right to show the previous or next image)
 * 
 * @author Demsond Liang
 * desmondliang.com
 * 
 * Demo and usage: http://www.desmondliang.com/content/touchme-jquery-plugin-ipad-web-apps
 *
 * EDITED BY HighJinx to actually work (Sept, 6th 2011)
 * Based on @version 1.0 (Sept, 15th 2010)
 * 
 */
/*
 * 
 * @param {Object} settings
 * isDetectHorizontalMovement: enable/disable horizontal touch movement. options: true(default)/false
 * isDetectVecticalMovement: enable/disable vertical touch movement. options: true(default)/false
 * isDetectDiagonalMovement: enable/disable diagonal movement. options: true/false(default)
 * 
 * wipeLeft: left wipe movement handler
 * wipeRight: right wipe movement handler 
 * wipeUp: up wipe movement handler
 * wipeDown: down wipe movement handler
 * wipeDownRight:down right wipe movement handler
 * wipeUpLeft: up left wipe movement handler
 * wipeUpRight: up right wipe movement handler
 * wipeDownLeft: down left wipe movement handler
 * 
 */
(function ($) {
    $.fn.touchme = function (settings) {
        var config = {
            min_move_x: 20,
            min_move_y: 20,
            swipeLeft: function (target) {},
            swipeRight: function (target) {},
            swipeUp: function (target) {},
            swipeDown: function (target) {},
            swipeDownRight: function (target) {},
            swipeUpLeft: function (target) {},
            swipeUpRight: function (target) {},
            swipeDownLeft: function (target) {},
            gestureChange: function (event) {},
            onGestureEnd: function (event) {},
            onDragStart: function (event) {},
            onDrag: function (event) {},
            onDragEnd: function (event) {},
            inMotion: function (event) {},
            expand: function (event) {},
            pinch: function (event) {},
            rotate: function (event) {},
            preventDefaultEvents: true,
            detect: {
                horizontal: false,
                vertical: false,
                diagonal: false,
                longPress: false,
                pinch: false,
                expand: false,
                drag: false,
                rotate: false
            }
        };

        if (settings) {
            $.extend(config, settings);
        }


        this.each(function () {
            var startX, startY, isMoving = false;

            function cancelTouch() {
                this.removeEventListener('touchmove', onTouchMove);
                startX = null;
                startY = null;
                isMoving = false;
            }
            
            function onDragEnd (e) {
                cancelTouch();
                this.removeEventListener('touchend', onDragEnd);
                config.onDragEnd(e.target);
            }

            function onTouchMove (e) {

                if (config.preventDefaultEvents) {
                    e.preventDefault();
                }
                
                if (isMoving) {
                    config.inMotion(e);

                    var x = e.touches[0].pageX;
                    var y = e.touches[0].pageY;

                    var dx = startX - x;
                    var dy = startY - y;

                    if (config.detect.longPress) {

                    }
                    
                    if (config.detect.drag) {
                        var element = $(e.target),
                            origX = element.data('startX'),
                            origY = element.data('startY'),
                            dX = x - origX,
                            dY = y - origY;
                            
                        element.css({
                            top: element.data('startT') + dY + "px",
                            left: element.data('startL') + dX + "px"
                        })
                            
                        this.addEventListener("touchend", onDragEnd, false);
                    }

                    if (config.detect.diagonal) {
                        if ((Math.abs(dx) >= config.min_move_x) && (Math.abs(dy) >= config.min_move_y)) {
                            cancelTouch();
                            if ((dy > 0) && (dx > 0)) {
                                config.swipeUpLeft(e.target);
                            } else if ((dx < 0) && (dy < 0)) {
                                config.swipeDownRight(e.target);

                            } else if ((dx > 0) && (dy < 0)) {
                                config.swipeDownLeft(e.target);

                            } else if ((dx < 0) && (dy > 0)) {
                                config.swipeUpRight(e.target);

                            }
                        }
                    }

                    if (config.detect.horizontal) {
                        if (Math.abs(dx) >= config.min_move_x) {
                            cancelTouch();

                            if (dx > 0) {
                                config.swipeLeft(e.target);
                            } else {
                                config.swipeRight(e.target);
                            }
                        }
                    }

                    if (config.detect.vertical) {
                        if (Math.abs(dy) >= config.min_move_y) {
                            cancelTouch();

                            if (dy > 0) {
                                config.swipeUp(e.target);
                            } else {
                                config.swipeDown(e.target);
                            }
                        }
                    }

                }
            }

            function onGestureChange(e) {
                cancelTouch();
                // config.gestureChange(e);
            }

            function onGestureEnd(e) {
                config.onGestureEnd(e);
                if (config.detect.pinch || config.detect.expand) {
                    if (Math.floor(e.scale) <= 0) { // pinch
                        config.pinch(e);
                    } else { // expand
                        config.expand(e);
                    }
                } else if (config.detect.rotate) {
                    config.rotate(e);
                }
            }

            function onTouchStart(e) {
                if (e.touches.length <= 1) {
                    $(e.target).data({
                        "startT": $(e.target).position().top,
                        "startL": $(e.target).position().left,
                        "startY": e.touches[0].pageY,
                        "startX": e.touches[0].pageX
                    });
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                    isMoving = true;
                    this.addEventListener('touchmove', onTouchMove, false);

                } else if (e.touches.length >= 2) { //gesture
                    isMoving = true;
                    this.addEventListener('gesturechange', onGestureChange, false);
                    this.addEventListener("gestureend", onGestureEnd, false);
                }
            }

            this.addEventListener('touchstart', onTouchStart, false);

        });

        return this;
    };

})(jQuery);