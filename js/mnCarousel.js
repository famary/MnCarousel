
var originalCarousel = $("#carousel").html(), timers = new Array();
	
$.fn.extend({
	mnCarousel: function(settings) {
		settings = $.extend({
			index: 0, auto: !0, time: 3000, indicators: !0, buttons: !0 
		}, settings);
		
		var index,
			carousel = this,
			wraper,
			item,
			itemCount;
		
		init();
		
		function init() {
			
			clearAllInterval();
			carousel.html(originalCarousel);
			wraper = carousel.find(".carousel-inner");
			item = wraper.find(".carousel-item");
			itemCount = item.length;
			index = settings.index < 0 || settings.index > itemCount - 1 ? 0 : settings.index;
			
			render();
			eventBind();
			settings.auto && loop();
		}
		
		function render() {
			renCas();
			settings.indicators && renIns();
			settings.buttons && renBtns();
		}
		
		function renCas() {
			var o = carousel.width();
				item.width(o);
			var	e = item.eq(itemCount - 1).clone(),
				s = item.eq(0).clone();
			wraper.width((itemCount + 2) * o).prepend(e).append(s).css("left", (index + 1) * -o);
		}
		
		function renIns() {
			var ins = '<div class="carousel-indicators">';
			for (var i = 0; i < itemCount; i++) {
				ins += '<span data-index="' + i + '"></span>';
			}
			ins += '</div>';
			carousel.append(ins).find(".carousel-indicators span").eq(index).addClass("active");
		}
		
		function renBtns() {
			carousel.append('<span class="carousel-btn carousel-prev-btn"></span><span class="carousel-btn carousel-next-btn"></span>');
		}
		
		function animate(x) {
			var e = carousel.width();
			wraper.stop(!0, !0).animate({left: wraper.position().left + x}, function() {
				var o = wraper.position().left;
				x < 0 && o < -e * itemCount && wraper.css("left", - e),
				x > 0 && o > -e && wraper.css("left", -e * itemCount),
				index = wraper.position().left / - e - 1,
				settings.buttons && showBtn();
			});
		}
		
		function showBtn() {
			carousel.find(".carousel-indicators span").removeClass("active").eq(index).addClass("active")
		}
		
		function loop() {
			 var timer = setInterval(function() { carousel.find(".carousel-next-btn").trigger("click"); }, settings.time);
			 timers.push(timer);
		}
		
		function eventBind() {
			var prev = carousel.find(".carousel-prev-btn"),
				next = carousel.find(".carousel-next-btn"),
				ins = carousel.find(".carousel-indicators"),
				offset = carousel.width();
			prev.on("click", function() {
				animate(offset); 
			});
			next.on("click", function() { 
				animate(-offset);
			});
			ins.on("click", "span", function() { 
				animate(($(this).data("index") - index) * -offset); 
			}); 
			(item.length && settings.auto) && carousel.hover(function() { clearAllInterval(); }, function() { loop(); });
		}
		
		function clearAllInterval() {
			for (var i = 0; i < timers.length; i++) {
				clearInterval(timers[i]);
			}
		}
	}
});

/**
 * 加载轮播图
 */
$(function() {
	
	/**
	 * 获取滚动条宽度
	 * @returns {Number}
	 */
	function getScrollbarWidth() {
		var oP = document.createElement('p'),
			styles = {
				width: '100px',
				height: '100px'
			}, i, clientWidth1, clientWidth2, scrollbarWidth;
		for (i in styles) oP.style[i] = styles[i];
		document.body.appendChild(oP);
		clientWidth1 = oP.clientWidth;
		oP.style.overflowY = 'scroll';
		clientWidth2 = oP.clientWidth;
		scrollbarWidth = clientWidth1 - clientWidth2;
		oP.remove();
		return scrollbarWidth;
	}
	
	function loadMnCarousel() {
		var innerWidth = window.innerWidth, 
			scrollBarWidth = getScrollbarWidth(),
			carousel = $("#carousel");
		carousel.width(innerWidth - scrollBarWidth).mnCarousel();
	}
	
	/**
	 * 在指定时间间隔后执行某一操作
	 */
	function debounce(func, threshold) { 
		var timeout; 
		return function debounced () { 
			var obj = this, args = arguments; 
			function delayed() {
				func.apply(obj, args); 
				timeout = null; 
			}
			if (timeout) { 
				clearTimeout(timeout);
			}	
			timeout = setTimeout(delayed, threshold || 100);
		};
	}
	
	loadMnCarousel();
	
	window.onresize = debounce(function() {
		loadMnCarousel();
	}, 100);
});