/**
* jQuery DatePicker
* @author biohzrdmx <github.com/biohzrdmx>
* @version 1.0
* @requires jQuery 1.8+
* @license MIT
*/
;(function($) {
	//
	$.datePicker = {
		strings: {
			monthsFull: ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			daysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			daysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			messageLocked: 'The day you have just selected is not available'
		},
		defaults: {
			formatDate: function(date) {
				var formatted = $.datePicker.utils.pad(date.getDate(), 2) + '/' + $.datePicker.utils.pad(date.getMonth() + 1, 2) + '/' + date.getFullYear();
				return formatted;
			},
			parseDate: function(string) {
				var date = new Date();
				var parts = string.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
				if ( parts && parts.length == 4 ) {
					date = new Date( parts[3], parts[2] - 1, parts[1] );
				}
				return date;
			},
			selectDate: function(date) {
				return true;
			},
			limitCenturies: true,
			closeOnPick: true,
			appendTo: null
		},
		utils: {
			firstDay: function(year, month) {
				return new Date(year, month, 1).getDay();
			},
			daysInMonth: function(year, month) {
				return new Date(year, ++month, 0).getDate();
			},
			buildDecadePicker: function(century, year) {
				var obj = $.datePicker,
					decades = $('<div class="decades"></div>'),
					firstDecade = (Math.floor(century/100) * 100) - 10,
					limit = $.datePicker.defaults.limitCenturies;
				// Decade header
				var header = '<div class="row header">'+
								'<a href="#" class="prev'+(limit && firstDecade < 1900 ? ' disabled' : '')+'"><span class="arrow"></span></a>'+
								'<a href="#" class="century" data-century="'+(firstDecade+10)+'">'+(firstDecade + 1)+'-'+(firstDecade + 100)+'</a>'+
								'<a href="#" class="next'+(limit && firstDecade == 1990 ? ' disabled' : '')+'"><span class="arrow"></span></a>'+
							 '</div>';
				decades.append(header);
				//
				var n = 0;
				var type = '';
				var num = 0;
				for (var i = 0; i < 3; i++) {
					var row = $('<div class="row"></div>');
					for (var j = 0; j < 4; j++) {
						n = j + (i * 4);
						type = n == 0 ? ' grayed prev' : (n == 11 ? ' grayed next' : '');
						num = firstDecade + (n * 10);
						if ( limit && (num < 1900 || num > 2090) ) {
							var item = $('<a href="" class="cell large double decade blank">&nbsp;</a>');
							row.append(item);
							continue;
						}
						if ( year >= num && year <= (num + 9)) {
							type += ' selected';
						}
						var item = $('<a href="#" data-year="'+num+'" class="cell large double decade'+type+'"><span>'+num+'- '+(num + 9)+'</span></a>');
						row.append(item);
					};
					decades.append(row);
				};
				return decades;
			},
			buildYearPicker: function(decade, year) {
				var obj = $.datePicker,
					years = $('<div class="years"></div>'),
					firstYear = (Math.floor(decade/10) * 10) - 1,
					limit = $.datePicker.defaults.limitCenturies;
				// Year header
				var header = '<div class="row header">'+
								'<a href="#" class="prev'+(limit && firstYear == 1899 ? ' disabled' : '')+'"><span class="arrow"></span></a>'+
								'<a href="#" class="decade" data-decade="'+(firstYear + 1)+'">'+(firstYear + 1)+'-'+(firstYear + 10)+'</a>'+
								'<a href="#" class="next'+(limit && firstYear == 2089 ? ' disabled' : '')+'"><span class="arrow"></span></a>'+
							 '</div>';
				years.append(header);
				//
				var n = 0;
				var type = '';
				var num = 0;
				for (var i = 0; i < 3; i++) {
					var row = $('<div class="row"></div>');
					for (var j = 0; j < 4; j++) {
						n = j + (i*4);
						type = n == 0 ? ' grayed prev' : (n == 11 ? ' grayed next' : '');
						num = firstYear + n;
						if ( limit && (num < 1900 || num > 2099) ) {
							var item = $('<a href="" class="cell large year blank">&nbsp;</a>');
							row.append(item);
							continue;
						}
						if ( num == year ) {
							type += ' selected';
						}
						var item = $('<a href="#" data-year="'+num+'" class="cell large year'+type+'">'+num+'</a>');
						row.append(item);
					};
					years.append(row);
				};
				return years;
			},
			buildMonthPicker: function(year, month) {
				var obj = $.datePicker,
					months = $('<div class="months"></div>'),
					limit = $.datePicker.defaults.limitCenturies;
				// Year header
				var header = '<div class="row header">'+
								'<a href="#" class="prev'+(limit && year == 1900 ? ' disabled' : '')+'"><span class="arrow"></span></a>'+
								'<a href="#" class="year" data-year="'+year+'">'+year+'</a>'+
								'<a href="#" class="next'+(limit && year == 2099 ? ' disabled' : '')+'"><span class="arrow"></span></a>'+
							 '</div>';
				months.append(header);
				//
				var n = 0;
				var type = '';
				for (var i = 0; i < 3; i++) {
					var row = $('<div class="row"></div>');
					for (var j = 0; j < 4; j++) {
						n = j + (i*4);
						type = '';
						if ( n == month ) {
							type += ' selected';
						}
						var item = $('<a href="#" data-year="'+year+'" data-month="'+n+'" class="cell large month'+type+'">'+obj.strings.monthsShort[ n ]+'</a>');
						row.append(item);
					};
					months.append(row);
				};
				return months;
			},
			buildCalendar: function(year, month, selected) {
				var obj = $.datePicker,
					calendar = $('<div class="calendar"></div>'),
					date = new Date(),
					year = year || date.getFullYear(),
					month = month >= 0 ? month : date.getMonth(),
					temp = new Date(year, month, 1),
					limit = $.datePicker.defaults.limitCenturies;
				temp.setDate( temp.getDate() - 1 );
				var lastPrev = temp.getDate(),
					lastCur = this.daysInMonth(year, month),
					offset = this.firstDay(year, month),
					numbering = 1 - offset;
				if (offset == 0) {
					numbering -= 7;
				}
				// Month/Year header
				var header = '<div class="row header">'+
								'<a href="#" class="prev'+(limit && year == 1900 && month == 0 ? ' disabled' : '')+'"><span class="arrow"></span></a>'+
								'<a href="#" class="month" data-year="'+year+'" data-month="'+month+'">'+obj.strings.monthsFull[month]+' '+year+'</a>'+
								'<a href="#" class="next'+(limit && year == 2099 && month == 11 ? ' disabled' : '')+'"><span class="arrow"></span></a>'+
							 '</div>';
				calendar.append(header);
				// Days header
				var days = $('<div class="row days"></div>');
				for (var w = 0; w < 7; w++) {
					days.append('<div class="cell">'+obj.strings.daysShort[w]+'</div>');
				}
				calendar.append(days);
				// Weeks
				for (var w = 0; w < 6; w++) {
					var week = $('<div class="row week"></div>');
					for (var d = 0; d < 7; d++) {
						var num = numbering <= 0 ? lastPrev + numbering : ( numbering > lastCur ? numbering - lastCur : numbering ),
							type = numbering <= 0 ? ' grayed prev' : ( numbering > lastCur ? ' grayed next' : '' );
						if ( limit && ( year == 1900 && month == 0 && numbering < 1 || year == 2099 && month == 11 && numbering > lastCur ) ) {
							week.append('<a href="#" class="cell day blank">&nbsp;</a>');
							numbering++;
							continue;
						}
						if (numbering == date.getDate() && month == date.getMonth() && year == date.getFullYear()) {
							type += ' today';
						}
						if (numbering == selected.getDate() && month == selected.getMonth() && year == selected.getFullYear()) {
							type += ' selected';
						}
						week.append('<a href="#" class="cell day'+type+'">'+num+'</a>');
						numbering++;
					}
					calendar.append(week);
				};
				return calendar;
			},
			pad: function(num, size) {
				var s = num+"";
				while (s.length < size) s = "0" + s;
				return s;
			}
		},
		show: function(options) {
			var opts = $.extend(true, {}, $.datePicker.defaults, options);
			var datePicker = null,
				date = new Date();
			// Initialize value
			if (opts.element) {
				if ( typeof opts.element == 'string' ) {
					opts.element = $(opts.element);
				}
				date = opts.parseDate( opts.element.val() );
			}
			var selected = {
					day: date.getDate(),
					month: date.getMonth(),
					year: date.getFullYear(),
					decade: date.getFullYear()
				};
			var calendar = $.datePicker.utils.buildCalendar(selected.year, selected.month, date),
				months = $.datePicker.utils.buildMonthPicker(selected.year, selected.month),
				years = $.datePicker.utils.buildYearPicker(selected.year, selected.year),
				decades = $.datePicker.utils.buildDecadePicker(selected.year, selected.year),
				datePicker = $('<div class="datepicker"><span class="tip"></span></div>');
			// Create the markup elements
			datePicker.append(calendar);
			datePicker.append(months);
			datePicker.append(years);
			datePicker.append(decades);
			$.datePicker.hide(true);
			// Position
			if (opts.element && ! opts.appendTo) {
				var offset = opts.element.offset();
				//
				datePicker.css({
					left: offset.left + 'px',
					top: offset.top + opts.element.outerHeight(true) + 15 + 'px'
				});
			}
			// Add to DOM
			datePicker.hide();
			$(opts.appendTo || 'body').append(datePicker);
			datePicker.fadeIn(150);
			// Calendar events
			datePicker.on('click', '.calendar .day', function(e) {
				e.preventDefault();
				var el = $(this),
					calendar = el.closest('.calendar');
				if ( el.hasClass('blank') ) {
					return;
				}
				//
				calendar.find('.selected').removeClass('selected');
				el.addClass('selected');
				//
				selected.day = parseInt( el.text() ) || 1;
				if ( el.hasClass('grayed') ) {
					if ( el.hasClass('prev') ) {
						selected.year -= selected.month == 0 ? 1 : 0;
						selected.month = selected.month > 0 ? selected.month - 1 : 11;
					} else if ( el.hasClass('next') ) {
						selected.year += selected.month == 11 ? 1 : 0;
						selected.month = selected.month < 11 ? selected.month + 1 : 0;
					}
				}
				var test = new Date();
				test.setFullYear(selected.year, selected.month, selected.day);
				//
				if ( opts.selectDate( test ) ) {
					date.setFullYear(selected.year, selected.month, selected.day);
					var formatted = opts.formatDate(date);
					$(opts.element).val(formatted);
					if ( opts.closeOnPick && !el.hasClass('grayed') ) {
						$.datePicker.hide();
					}
				}
			});
			datePicker.on('click', '.calendar .month', function(e) {
				e.preventDefault();
				var el = $(this),
					calendar = el.closest('.calendar'),
					months = datePicker.children('.months'),
					picker = $.datePicker.utils.buildMonthPicker(selected.year, selected.month);
				// Rebuild picker
				months.replaceWith(picker);
				months = picker;
				// Animate
				calendar.fadeOut(150, function() {
					months.fadeIn(150);
				});
			});
			datePicker.on('click', '.calendar .prev', function(e) {
				e.preventDefault();
				var el = $(this),
					calendar = el.closest('.calendar'),
					current = calendar.find('.month'),
					month = current.data('month'),
					year = current.data('year');
				if ( el.hasClass('disabled') ) {
					return;
				}
				// Replace
				month = month - 1;
				if (month < 0) {
					month = 11;
					year--;
				}
				// Change current selection
				selected.month = month;
				selected.year = year;
				// Replace
				replacement = $.datePicker.utils.buildCalendar(year, month, date);
				replacement.hide();
				calendar.after(replacement);
				calendar.fadeOut(150, function() {
					calendar.detach();
					replacement.fadeIn(150);
				});
			});
			datePicker.on('click', '.calendar .next', function(e) {
				e.preventDefault();
				var el = $(this),
					calendar = el.closest('.calendar'),
					current = calendar.find('.month'),
					month = current.data('month'),
					year = current.data('year');
				if ( el.hasClass('disabled') ) {
					return;
				}
				// Replace
				month = month + 1;
				if (month > 11) {
					month = 0;
					year++;
				}
				// Change current selection
				selected.month = month;
				selected.year = year;
				// Replace
				replacement = $.datePicker.utils.buildCalendar(year, month, date);
				replacement.hide();
				calendar.after(replacement);
				calendar.fadeOut(150, function() {
					calendar.detach();
					replacement.fadeIn(150);
				});
			});
			// Month-picker events
			datePicker.on('click', '.months .month', function(e) {
				e.preventDefault();
				var el = $(this),
					months = el.closest('.months'),
					month = el.data('month'),
					year = el.data('year'),
					calendar = datePicker.children('.calendar'),
					replacement = null;
				if ( el.hasClass('blank') ) {
					return;
				}
				months.find('.selected').removeClass('selected');
				el.addClass('selected');
				// Change current selection
				selected.month = month;
				// Replace
				replacement = $.datePicker.utils.buildCalendar(year, month, date);
				replacement.hide();
				calendar.replaceWith(replacement);
				// Animate
				months.fadeOut(150, function() {
					replacement.fadeIn(150);
				});
			});
			datePicker.on('click', '.months .prev', function(e) {
				e.preventDefault();
				var el = $(this),
					months = el.closest('.months'),
					current = months.find('.year'),
					year = current.data('year');
				if ( el.hasClass('disabled') ) {
					return;
				}
				// Replace
				year -= 1;
				// Change current selection
				selected.year = year;
				// Replace
				replacement = $.datePicker.utils.buildMonthPicker(year, selected.month);
				replacement.hide();
				months.after(replacement);
				months.fadeOut(150, function() {
					months.detach();
					replacement.fadeIn(150);
				});
			});
			datePicker.on('click', '.months .next', function(e) {
				e.preventDefault();
				var el = $(this),
					months = el.closest('.months'),
					current = months.find('.year'),
					year = current.data('year');
				if ( el.hasClass('disabled') ) {
					return;
				}
				// Replace
				year += 1;
				// Change current selection
				selected.year = year;
				// Replace
				replacement = $.datePicker.utils.buildMonthPicker(year, selected.month);
				replacement.hide();
				months.after(replacement);
				months.fadeOut(150, function() {
					months.detach();
					replacement.fadeIn(150);
				});
			});
			datePicker.on('click', '.months .year', function(e) {
				e.preventDefault();
				var el = $(this),
					months = el.closest('.months'),
					years = datePicker.children('.years'),
					picker = $.datePicker.utils.buildYearPicker(selected.decade, selected.year);
				// Rebuild picker
				years.replaceWith(picker);
				years = picker;
				// Animate
				months.fadeOut(150, function() {
					years.fadeIn(150);
				});
			});
			// Year-picker events
			datePicker.on('click', '.years .year', function(e) {
				e.preventDefault();
				var el = $(this),
					years = el.closest('.years'),
					year = el.data('year'),
					months = datePicker.children('.months'),
					replacement = null;
				if ( el.hasClass('blank') ) {
					return;
				} else if ( el.hasClass('next') || el.hasClass('prev') ) {
					return;
				}
				years.find('.selected').removeClass('selected');
				el.addClass('selected');
				// Change current selection
				selected.year = year;
				selected.decade = year;
				// Replace
				replacement = $.datePicker.utils.buildMonthPicker(year, selected.month);
				replacement.hide();
				months.replaceWith(replacement);
				// Animate
				years.fadeOut(150, function() {
					replacement.fadeIn(150);
				});
			});
			datePicker.on('click', '.years .prev', function(e) {
				e.preventDefault();
				var el = $(this),
					years = el.closest('.years'),
					current = years.find('.decade'),
					decade = current.data('decade');
				if ( el.hasClass('disabled') ) {
					return;
				}
				// Replace
				decade -= 10;
				// Change current selection
				selected.decade = decade;
				// Replace
				replacement = $.datePicker.utils.buildYearPicker(decade, selected.year);
				replacement.hide();
				years.after(replacement);
				years.fadeOut(150, function() {
					years.detach();
					replacement.fadeIn(150);
				});
			});
			datePicker.on('click', '.years .next', function(e) {
				e.preventDefault();
				var el = $(this),
					years = el.closest('.years'),
					current = years.find('.decade'),
					decade = current.data('decade');
				if ( el.hasClass('disabled') ) {
					return;
				}
				// Replace
				decade += 10;
				// Change current selection
				selected.decade = decade;
				// Replace
				replacement = $.datePicker.utils.buildYearPicker(decade, selected.year);
				replacement.hide();
				years.after(replacement);
				years.fadeOut(150, function() {
					years.detach();
					replacement.fadeIn(150);
				});
			});
			datePicker.on('click', '.years .decade', function(e) {
				e.preventDefault();
				var el = $(this),
					years = el.closest('.years'),
					decades = datePicker.children('.decades');
				// Animate
				years.fadeOut(150, function() {
					decades.fadeIn(150);
				});
			});
			// Decade-picker events
			datePicker.on('click', '.decades .decade', function(e) {
				e.preventDefault();
				var el = $(this),
					decade = el.data('year'),
					decades = el.closest('.decades'),
					years = datePicker.children('.years'),
					replacement = null;
				if ( el.hasClass('blank') ) {
					return;
				} else if ( el.hasClass('next') || el.hasClass('prev') ) {
					return;
				}
				decades.find('.selected').removeClass('selected');
				el.addClass('selected');
				// Replace
				replacement = $.datePicker.utils.buildYearPicker(decade, selected.year);
				replacement.hide();
				years.replaceWith(replacement);
				// Animate
				decades.fadeOut(150, function() {
					replacement.fadeIn(150);
				});
			});
			datePicker.on('click', '.decades .prev', function(e) {
				e.preventDefault();
				var el = $(this),
					decades = el.closest('.decades'),
					current = decades.find('.century'),
					century = current.data('century');
				if ( el.hasClass('disabled') ) {
					return;
				}
				// Replace
				century -= 100;
				// Replace
				replacement = $.datePicker.utils.buildDecadePicker(century, selected.decade);
				replacement.hide();
				decades.after(replacement);
				decades.fadeOut(150, function() {
					decades.detach();
					replacement.fadeIn(150);
				});
			});
			datePicker.on('click', '.decades .next', function(e) {
				e.preventDefault();
				var el = $(this),
					decades = el.closest('.decades'),
					current = decades.find('.century'),
					century = current.data('century');
				if ( el.hasClass('disabled') ) {
					return;
				}
				// Replace
				century += 100;
				// Replace
				replacement = $.datePicker.utils.buildDecadePicker(century, selected.decade);
				replacement.hide();
				decades.after(replacement);
				decades.fadeOut(150, function() {
					decades.detach();
					replacement.fadeIn(150);
				});
			});
			datePicker.on('click', '.decades .century', function(e) {
				e.preventDefault();
				// Let's pick millenium! Bad idea, dropping it
			});
			$(document).on('mouseup', function (e) {
				if (!datePicker.is(e.target) // if the target of the click isn't the container...
					&& datePicker.has(e.target).length === 0) // ... nor a descendant of the container
				{
					$(document).off('mouseup');
					$.datePicker.hide();
				}
			});
		},
		hide: function(force) {
			var force = force || false,
				el = $('.datepicker');
			if (force) {
				el.remove();
			} else {
				el.fadeOut(150, el.remove);
			}
		}
	};
	//
	// Manual binding
	$.fn.datePicker = function(options) {
		if (!this.length) { return this; }
		var opts = $.extend(true, {}, $.datePicker.defaults, options);
		this.each(function() {
			var el = $(this),
				parent = el.parent(),
				button = parent.find('[data-toggle=datepicker]'),
				locked = el.data('locked');
			locked = locked ? locked.split(';') : false;
			var callback = function(date) {
				var ret = true,
					selected = $.datePicker.utils.pad(date.getDate(), 2) + '/' + $.datePicker.utils.pad(date.getMonth() + 1, 2) + '/' + date.getFullYear();
				if (locked.length) {
					for (var i = 0; i < locked.length; i++) {
						if (locked[i] == selected) {
							if ( typeof $.alert === 'function' ) {
								$.alert = $.datePicker.strings.messageLocked;
							} else {
								alert($.datePicker.strings.messageLocked);
							}
						 	ret = false;
						 	break;
						}
					};
				}
				return ret;
			};
			if (! button.length ) {
				// Bind to the element itself
				el.on('click', function() {
					$.datePicker.show({
						element: el,
						selectDate: callback
					});
				});
			} else {
				// Does it have a button?
				button.on('click', function(e) {
					e.preventDefault();
					if ( $('.datepicker:visible').length ) {
						$.datePicker.hide();
					} else {
						$.datePicker.show({
							element: el,
							selectDate: callback
						});
					}
				});
			}
		});
		return this;
	};
	// Data support
	$('[data-select=datepicker]').each(function() {
		var el = $(this);
		el.datePicker();
	});
})(jQuery);
