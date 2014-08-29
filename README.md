jQuery DatePicker
=================

An awesome, lightweight and customizable calendar!

##Installing

Download the required CSS and JS files, add them to your HTML file and you're done.

	<link rel="stylesheet" href="css/jquery.datepicker.css">
	<script type="text/javascript" src="js/jquery.datepicker.js"></script>


##Basic usage

###Automatic mode

Create an input, and add the `data-select="datepicker"` data attribute.

If you want to have a toggle button next to the input, wrap both elements into a common container and add the `data-toggle="datepicker"` data attribute to the button.

**HTML**

	<div class="input-group">
		<input type="text" class="form-control" name="date" id="date" data-select="datepicker">
		<span class="input-group-btn"><button type="button" class="btn btn-primary" data-toggle="datepicker"><i class="fa fa-calendar"></i></button></span>
	</div>

##Advanced usage

###Custom date formats

You can specify your own date formats if you want; to do so, you will have to override two functions, the one that formats the selected date and the one that parses the input value into a `Date` object.

The default implementation uses the `dd/mm/yyyy` format, with the following functions:

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
	}

As you can see, it's pretty straightforward to override them, but it's strongly recommended to use a date manipulation library such as moment.js to avoid localization/crossbrowser issues.

Just make sure to return a valid formatted date in `formatDate` and a valid `Date` object in `parseDate`

##Requirements

 - jQuery 1.8+
 - A recent/decent web browser (Firefox, Chrome or Opera suggested; IE8+ works too)
 - A valid HTML 5 DOCTYPE (strongly recommended)

###Licensing

This software is released under the MIT license.

Copyright © 2014 biohzrdmx

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

###Contributing

Fork the repo, add an interesting feature or fix a bug and send a pull request.

###Troubleshooting

The calendar works on almost every browser BUT it will visually break on IE7 and older (due to buggy CSS support). This is not a concern and will not be fixed.

##Credits

<strong>Lead coder:</strong> biohzrdmx (github.com/biohzrdmx)