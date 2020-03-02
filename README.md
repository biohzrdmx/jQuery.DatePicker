jQuery DatePicker
=================

An awesome, lightweight and customizable calendar! (Now with more awesomeness!)

This new version brings an updated API, more customization and a better user experience.

## Requirements

 - jQuery 1.8+
 - A recent/decent web browser (Firefox, Chrome or Opera suggested)
 - A valid HTML 5 DOCTYPE (strongly recommended)

## Installing

Download the required CSS and JS files, add them to your HTML file and you're done.

```html
  <link rel="stylesheet" href="css/jquery.datepicker2.css">
  <script type="text/javascript" src="js/jquery.datepicker2.js"></script>
```

## Basic usage

### Automatic mode

Create an input, and add the `data-select="datepicker"` data attribute.

```html
  <input type="text" class="form-control" name="date" id="date" data-select="datepicker">
```

## Advanced usage

### Options

In this version there are a handful of customization options, available through the `$.datePicker.defaults` option; you may pass an options object if you call the API directly or by overriding the defaults object.

The options are:

- `container` - Selector for the element that will contain the generated markup, defaults to `body`
- `mode` - The display mode of the widget, can be either `popup` or `inline`, defaults to `popup`.
- `select` - Selection mode, either `single` or `multiple`, defaults to `single`
- `theme` - Visual theme, can be either `theme-light` or `theme-dark`, defaults to `theme-light`
- `show` - Which view to show by default, can be `decade`, `year` or `month`, defaults to `month`
- `doubleSize` - Whether to enable double-size mode or not, defaults to `false`
- `restrictDates` - Quick date-restriction mode specifier, can be `past`, `future` or `custom`, defaults to `false`. More on this below
- `disableAnimations` - Whether to disable animations or not, defaults to `false`
- `strings` - An object with two dictionaries: `months` and `days`, used to localize your calendar
- `view` - Contains three objects with several options each, more details below
- `templates` - This contains the templates for the widget and some elements,
- `callbacks` - The callbacks object, more on this below
- `animate` - The animation object, currently is not advised to modify this
- `dateFormat` - Function to format dates, more info below
- `dateParse` - Function to parse dates, more info below

### Restrict date selection

By default, the calendar will let you select any valid date for the current month, but you may change this behaviour easily by using the `restrictDates` option, which can take one of the following values:

- `past` - Only allow past dates
- `future` - Only allow future dates
- `custom` - Use a callback to check if the date should be allowed or not

The `custom` value will trigger the following callback from the `callbacks` object:

```javascript
  onCheckCell: function(cell, date, type) {
    return true;
  }
```

That way you may restrict specific dates, weekdays, weekends, etc. Just return either `true` or `false` for each cell on the current month.

_Just a quick heads up: as this callback will be fired for each day of the currently visible month, is not advised to do any lenghty process and/or web requests as you may block the UI and/or generate an empty state. It is best to get your data beforehand (into a JSON object for example) and load it to the calendar using the appropiate callback methods._

### Customizing the views

The `defaults` object contains a `views` object which in turn contains three option objects (`decade`, `year`, `month`), one for each calendar view.

All the three contain a `show` item, which determines which date will be shown on the view. This can be a parseable date or a `Date` object.

The `month` object also contains the following options:

- `selected` - An array with the selected date(s), depending on the selection mode
- `disabled` - An array with disabled (grayed) dates, these are not selectable
- `forbidden` - An array with disabled (red) dates, these are not selectable
- `enabled` - An array with enabled (not grayed) dates, these are the only selectable
- `marked` - An array with marked (yellow) dates, these are selectable
- `firstDayOfWeek` - Which day of the week to use as the start of the week (0: Sunday to 6: Saturday)

The arrays can contain either parseable dates or `Date` objects.

If you specify `disabled` dates, these dates will be disabled on the calendar; on the other hand, if you specify `enabled` dates, only those dates will be enabled on the entire calendar.

If you'd like a simpler approach, check the `restrictDates` option as it may be a better fit to your requirements.

### Callbacks

The `callbacks` object provides a powerful way to interact with the control.

You can control the appearance, behaviour and funcionality if you know where to hook into.

The available callbacks are:

- `onCreate: function(calendar)` - Called when the widget is created
- `onShow: function(calendar)` - Called when the widget is shown
- `onViewDecade: function(calendar, date)` - Called when showing the Decade view. It must return `true` or `false` to show or not the view
- `onViewYear: function(calendar, date)` - Called when showing the Year view. It must return `true` or `false` to show or not the view
- `onViewMonth: function(calendar, date)` - Called when showing the Month view. It must return `true` or `false` to show or not the view
- `onChangeDecade: function(calendar, date, direction)` - Called when changing the Decade. It must return `true` or `false` to allow or deny the change
- `onChangeYear: function(calendar, date, direction)` - Called when changing the Year. It must return `true` or `false` to allow or deny the change
- `onChangeMonth: function(calendar, date, direction)` - Called when changing the Month. It must return `true` or `false` to allow or deny the change
- `onChangeDay: function(calendar, date, direction)` - Called when changing the Day. It must return `true` or `false` to allow or deny the change
- `onCheckCell: function(cell, date, type)` - When using the `custom` value on the `restrictDates` option this will be called for each day of the currently visible month to enable or disable the cell. Return `true` or `false` to do so, defaults to `false`
- `onRenderCell: function(cell, date, type)` - Called when a cell is rendered
- `onHide: function(calendar)` - Called when the widget is hidden

### Custom date formats

You can specify your own date formats if you want; to do so, you will have to override two functions, the one that formats the selected date and the one that parses the input value into a `Date` object.

The default implementation uses the `mm-dd-yyyy` format, with the following functions:

```javascript
  dateFormat: function(date) {
    return $.datePicker.defaults.pad(date.getMonth() + 1, 2) + '-' + $.datePicker.defaults.pad(date.getDate(), 2) + '-' + date.getFullYear();
  },
  dateParse: function(string) {
    var date = new Date();
    if (string instanceof Date) {
      date = new Date(string);
    } else {
      var parts = string.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
      if ( parts && parts.length == 4 ) {
        date = new Date( parts[3], parts[1] - 1, parts[2] );
      }
    }
    return date;
  }
```

For example, to change the format to `dd/mm/YYYY` you will do:

```javascript
  dateFormat: function(date) {
    return $.datePicker.defaults.pad(date.getDate(), 2) + '/' + $.datePicker.defaults.pad(date.getMonth() + 1, 2) + '/' + date.getFullYear();
  },
  dateParse: function(string) {
    var date = new Date();
    if (string instanceof Date) {
      date = new Date(string);
    } else {
      var parts = string.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if ( parts && parts.length == 4 ) {
        date = new Date( parts[3], parts[2] - 1, parts[1] );
      }
    }
    return date;
  }
```

As you can see, it's pretty straightforward to override them, but it's strongly recommended to use a date manipulation library such as moment.js to avoid localization/crossbrowser issues.

Just make sure to return a valid formatted date in `dateFormat` and a valid `Date` object in `dateParse`

### More customization

You may change the `strings` object to localize your calendar, for example:

```javascript
  $.extend(true, $.datePicker.defaults.strings, {
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  });
```

Will render the calendar using spanish month and day names.

You may also mess with the templates or event the animation functions, but for now is not advised to do so as they are not documented and/or even finished yet.

### Licensing

This software is released under the MIT license.

Copyright &copy; 2019 biohzrdmx

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Contributing

Fork the repo, add an interesting feature or fix a bug and send a pull request.

### Troubleshooting

The calendar works on almost every modern browser but MAY NOT WORK on IE/Edge. This is not a concern and will not be fixed.

## Credits

<strong>Lead coder:</strong> biohzrdmx (github.com/biohzrdmx)