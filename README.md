#multiSlide 0.2.1

##jQuery плагин для постраничного скроллинга

##Основные характеристики

###Поддержка браузеров:
* IE7+
* Firefox
* Chrome
* Safari,
* mobile browsers

###Поведение слайдера
* Если скроллить, находясь в области слайдов, слайды будут переключаться вверх-вниз соответственно
* Если скроллить вне области слайдов или в области пагинации - слайды переключаться не будут
* При клике на пагинацию происходит скроллирование к соответствующему слайду

##Установка

###Подключить требуемые файлы
```html
<!-- jQuery library -->
<script src="lib/jquery-1.10.2.min.js"></script>
<!--Animate Enhanced Plugin (http://playground.benbarnett.net/jquery-animate-enhanced/)-->
<script src="lib/jquery.animate-enhanced.js"></script>
<!--jQuery Easing Plugin (http://gsgd.co.uk/sandbox/jquery/easing/)-->
<script src="lib/jquery.easing.1.3.min.js"></script>
<!--jQuery Mousewheel Plugin (http://plugins.jquery.com/mousewheel/)-->
<script src="lib/jquery.mousewheel.js"></script>

<!-- MultiSlide css file -->
<link rel="stylesheet" href="multiSlide.css">
<!-- MultiSlide javascript file -->
<script src="multiSlide.js"></script>
```

###Создать HTML разметку
```html
<div class="viewport-block">
	<div class="view-slide active">slide1</div>
	<div class="view-slide">slide2</div>
	<div class="view-slide">slide3</div>
</div>
```

###Вызвать плагин
```javascript
$(document).ready(function(){
	$('.viewport-block').multiSlide();
});
```

##Параметры

###Базовые
**slideTime** - Время переключения слайдов
```
default: 700
```
```javascript
var multiSlide = $(".viewport-block").multiSlide({
    slideTime: 1000
});
```

**easingType** - тип анимации (или функция Безье)
```
default: 'easeOutExpo'
options: type or Bezier function
```
```javascript
var multiSlide = $(".viewport-block").multiSlide({
    easingType: 'easeOutExpo'
});
```

**activeSlideCss** - класс для активного слайда
```
default: 'active'
```
```javascript
var multiSlide = $(".viewport-block").multiSlide({
    activeSlideCss: 'active'
});
```

**paging** - разметка пагинации
```
default: '.lister li'
```
```javascript
var multiSlide = $(".viewport-block").multiSlide({
    paging: '.view-slide-nav .nav-item'
});
```

###CallBacks

**beforeShow** - срабатывает перед показом нового слайда
```javascript
var multiSlide = $(".viewport-block").multiSlide({
    beforeShow: function(currentSlide, newIndex){

    }
});
```

**afterShow** - срабатывает после показа нового слайда
```javascript
var multiSlide = $(".viewport-block").multiSlide({
    afterShow: function(newIndex){

    }
});
```

###Public methods
**switchSlideNext** - переключиться на следующий слайд
```javascript
var multiSlide = $(".viewport-block").multiSlide();
multiSlide.switchSlideNext();
```

**switchSlidePrev** - переключиться на предыдущий слайд
```javascript
var multiSlide = $(".viewport-block").multiSlide();
multiSlide.switchSlidePrev();
```

**switchSlideTo(n)** - переключиться к слайду под номером n (нумерация с 0)
```javascript
var multiSlide = $(".viewport-block").multiSlide();
multiSlide.switchSlideTo(0); //к первому слайду
```

**scrollOff** - отключить переключение слайдов по mousewheel и swipe (по умолчанию включено)
```javascript
var multiSlide = $(".viewport-block").multiSlide();
multiSlide.scrollOff();
```

**scrollOn** - переключение слайдов по mousewheel и swipe
```javascript
var multiSlide = $(".viewport-block").multiSlide();
multiSlide.scrollOn();
```