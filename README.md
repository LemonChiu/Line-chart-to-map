# Line-chart-to-map
P5.js interactive line chart, which turns into a map.

Two files can be customized with your data. At some point, this will become a simpler process. For now, there is some customization required:

**init.js** — the only thing you must customize to make this work is the universal variable "years" which holds an array of column names that you want to read in from your data. In the default case, it is year ranges.

**data.js** — it holds an array of objects. The easiest way to create this is to go from a standard spreadsheet and turn it into a JSON with properties. I like to use [Mr. Data Converter](http://shancarter.github.io/mr-data-converter/).

 