/* version 0.2.1 */
/*
    зависимости
    jquery-1.10.2.min.js"
    jquery.animate-enhanced.js
    jquery.easing.1.3.min.js
    jquery.mousewheel.js
 */
/*

    Пример работы (html):
    <div class="viewport-block">
        <div class="view-slide active"></div>
        <div class="view-slide"></div>
        <div class="view-slide"></div>
    </div>

    var multiSlide = $(".viewport-block").multiSlide({
        slideTime: 700,							// время перекючения слайда
        easingType: "easeOutExpo",  			// или функцию Безье
        paging: ".view-slide-nav .nav-item",	// класс элемента навигации
        activeSlideCss: "active",				// CSS класс для активного слайда
        beforeShow: function(currentSlide, newIndex){
        },
        afterShow: function(newIndex){
        }
    });

    // METHODS
     multiSlide.switchSlideTo(0); 	// переключиться к первому слайду
     multiSlide.switchSlideNext();
     multiSlide.switchSlidePrev();
     multiSlide.scrollOff(); // отключить переключение слайдов по mousewheel и swipe
     multiSlide.scrollOn(); // включить переключение слайдов по mousewheel и swipe

*/
(function( $ ) {
    var defaults = {

        // GENERAL
        slideTime: 700,
        easingType: "easeOutExpo",
        activeSlideCss: "active",
        paging: ".lister li"

    };
    $.fn.swipeEvents = function() {
        // https://github.com/peachananr/onepage-scroll.git
        return this.each(function() {

            var startX,
                startY,
                $this = $(this);

            $this.bind('touchstart', touchstart);

            function touchstart(event) {
                var touches = event.originalEvent.touches;
                if (touches && touches.length) {
                    startX = touches[0].pageX;
                    startY = touches[0].pageY;
                    $this.bind('touchmove', touchmove);
                }
            }

            function touchmove(event) {
                var touches = event.originalEvent.touches;
                if (touches && touches.length) {
                    var deltaX = startX - touches[0].pageX;
                    var deltaY = startY - touches[0].pageY;

                    if (deltaX >= 15) {
                        $this.trigger("swipeLeft");
                    }
                    if (deltaX <= -15) {
                        $this.trigger("swipeRight");
                    }
                    if (deltaY >= 15) {
                        $this.trigger("swipeUp");
                    }
                    if (deltaY <= -15) {
                        $this.trigger("swipeDown");
                    }
                    if (Math.abs(deltaX) >= 15 || Math.abs(deltaY) >= 15) {
                        $this.unbind('touchmove', touchmove);
                    }
                }
            }
        });
    };
    $.fn.multiSlide = function(options) {

        if(this.length == 0) return this;

        var options = $.extend(defaults, options),

            elem = this,
            $slides = elem.children(),
            $w = $(window),

            stepSlideAnimate = $w.height(),
            currentSlide = 0,
            animation = false,
            unfreezTimer = 50,
            resizeTimer,
            newIndex,
            scrollOn = true,

            beforeShow = options.beforeShow,
            afterShow = options.afterShow,

            handlerElem = {
                /**
                 * Обработчик события mousewheel
                 * Скроллим вниз - вызывается функция _switchSlideNext,
                 * Скроллим вверх - вызывается функция _switchSlidePrev
                 * @param e  - объект события jquery event
                 */
                mousewheel: function(e){
                    if(scrollOn) {
                        if(Math.abs(e.deltaY)>100) {
                            unfreezTimer = 500;
                        }
                        if(e.deltaY < 0) {
                            _switchSlideNext();
                        } else {
                            _switchSlidePrev();
                        }
                        e.preventDefault();
                    }
                },

                /**
                 * Обработчик события touchmove
                 * отменить стандартное событие touchmove
                 * @param e  - объект события jquery event
                 */
                touchmove: function(e){
                    e.preventDefault();
                    return false;
                },

                /**
                 * доступен благодаря $.fn.swipeEvents
                 * Обработчик события swipeDown
                 * Свайпим вниз - вызывается функция _switchSlidePrev,
                 * @param e  - объект события jquery event
                 */
                swipeDown: function(e){
                    if(scrollOn) {
                        _switchSlidePrev();
                        e.preventDefault();
                        return false;
                    }
                },

                /**
                 * доступен благодаря $.fn.swipeEvents
                 * Обработчик события swipeUp
                 * Свайпим вверх - вызывается функция _switchSlideNext
                 * @param e  - объект события jquery event
                 */
                swipeUp: function(e){
                    if(scrollOn) {
                        _switchSlideNext();
                        e.preventDefault();
                        return false;
                    }
                }
            },
            handlerDoc = {
                /**
                 * Обработчик события keydown
                 * Переключение слайдов по кнопкам: Page Up, Arrow Up, Page Down, Arrow Down
                 * @param e  - объект события jquery event
                 * @returns {boolean}
                 */
                keydown: function(e){
                    var tag = e.target.tagName.toLowerCase();
                    switch(e.which) {
                        case 33:
                        case 38:
                            // Page Up, Arrow Up
                            if (tag != 'input' && tag != 'textarea') {
                                _switchSlidePrev();
                                return false;
                            }
                            break;

                        case 34:
                        case 40:
                            // Page Down, Arrow Down
                            if (tag != 'input' && tag != 'textarea') {
                                _switchSlideNext();
                                return false;
                            }
                            break;

                        default: return false;
                    }
                },

                /**
                 * Обработчик события click (на options.paging)
                 * Переключаем слайды по навигации
                 * @param e  - объект события jquery event
                 * @returns {boolean}
                 */
                click: function(e){
                    var clicked = $(e.target);

                    // click on pager element
                    if(clicked.is(options.paging) || clicked.parents().is(options.paging)) {
                        while(!clicked.is(options.paging)) {
                            clicked = clicked.parent();
                        }
                        _switchSlideTo(clicked.index());
                        e.preventDefault();
                    }
                }
            };

        // INIT
        _init();


        // HANDLERS
        $(elem).swipeEvents().on(handlerElem);
        $(document).on(handlerDoc);
        $w.on("resize",function(){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function(){
                _resize()
            }, 100);
        });


        // FUNCITONS
        function _init() {
            _resize();
        }

        function _resize() {
            stepSlideAnimate = elem.height();
            $slides.not("." + options.activeSlideCss).css({
                "top": stepSlideAnimate
            });
        }

        function _switchSlideTo(slideNumber) {
            if(animation || currentSlide == slideNumber) {
                return false;
            }

            _resize();

            newIndex = slideNumber;
            animation = true;
            if(beforeShow) {
                beforeShow(currentSlide, newIndex);
            }

            var position;

            if(currentSlide < slideNumber) {
                // show new from bottom
                position = stepSlideAnimate;
            } else if (currentSlide > slideNumber){
                // show new from top
                position = -stepSlideAnimate;
            } else {
                // try show current slide
                return false;
            }

            // set start slide position
            $slides.eq(slideNumber).css({
                "top": position
            });


            // show new
            $slides.eq(slideNumber).animate({
                "top": 0
                }, options.slideTime, options.easingType, function(){
                $slides.eq(slideNumber).addClass(options.activeSlideCss).siblings().removeClass(options.activeSlideCss);

                // animation end
                setTimeout(function(){
                    animation = false;
                },unfreezTimer);

                // if afterShow defined
                if(afterShow) {
                    afterShow(newIndex);
                }
                _resize();
            });

            // animate current slide
            $slides.filter("." + options.activeSlideCss).animate({
                "top": -position
            }, options.slideTime, options.easingType);

            // switch pager
            $(options.paging).eq(newIndex).addClass(options.activeSlideCss).siblings().removeClass(options.activeSlideCss);
            currentSlide = slideNumber;
        }

        function _switchSlideNext(){
            if(currentSlide != $slides.length - 1) {
                _switchSlideTo(currentSlide+1);
            } else {
                return false;
            }

        }

        function _switchSlidePrev(){
            if(currentSlide != 0) {
                _switchSlideTo(currentSlide-1);
            } else {
                return false;
            }

        }

        // METHODS
        elem.switchSlideTo = _switchSlideTo;
        elem.switchSlideNext = _switchSlideNext;
        elem.switchSlidePrev = _switchSlidePrev;
        elem.scrollOff = function(){
            scrollOn = false;
        };
        elem.scrollOn = function(){
            scrollOn = true;
        };


        // returns the current jQuery object
        return this;
    };
})(jQuery);