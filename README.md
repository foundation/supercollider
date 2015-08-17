# Supercollider

A fancy documentation generator that can mash up documentation from multiple sources.

## How it Works

Supercollider parses a glob of Markdown files, pulls in relevant documentation from Sass and JavaScript files, and combines it all into one JSON object, which is passed to a Handlebars template that renders the final HTML page.

A typical documentation page will look like this:

```markdown
---
title: Component Name
description: Description of the component.
sass: path/to/sass.scss
js: path/to/js.js
---

General documentation for your component.
```

The Markdown, as well as any documentation parsed by SassDoc or JSDoc, is converted into a JSON object that looks like this:

```json
{
  "title": "Component Name",
  "description": "Description of the component",
  "fileName": "componentName.html",
  "docs": "<p>General documentation for your component.</p>",
  "sass": [],
  "js": []
}
```

Finally, this data is passed to a Handlebars template and used to build new HTML pages, designed by *you*! Supercollider doesn't include any templates or themes; it just gives you the big JavaScript object you need to write a template.

## Usage

The plugin can be used standalone or with the Gulp build system. To use it standalone, call `supercollider.init()` with `src` being a glob of files, and `dest` being an output folder.

```js
var Super = require('supercollider');

Super.init({
  src: './pages/*.md',
  dest: './build',
  template: './template.html',
  adapters: ['sass', 'js']
});
```

You can also omit the source and destination settings, and use the same method in the middle of a Gulp stream (or any Node stream that happens to use Vinyl files). The function takes in a glob of Markdown files, and transforms them into compiled HTML files.

```js
gulp.src('./pages/*.md')
  .pipe(Super.init({
    template: './template.html',
    adapters: ['sass', 'js']
  }))
  .pipe(gulp.dest('./build'));
```

## API

### init(options)

Parses, processes, and builds documentation all at once. The built-in `scss` and `js` adapters are available by default.

- **options** (Object):
  - **src** (String or Array): a glob of files to process. Each file is a component, and can be attached to zero or more adapters to documentation generators.
  - **template** (String): path to the Handlebars template to use for each component.
  - **adapters** (Array<String>): adapters to use.
  - **dest** (String): file path to write the finished HTML to.
  - **marked** (Object): a custom instance of Marked to use when parsing the markdown of your documentation pages. This allows you to pass in custom rendering methods.
  - **handlebars** (Object): a custom instance of Handlebars to use when rendering the final HTML. This allows you to pass in custom helpers for use in your template.

### adapter(name, func)

Adds a custom adapter to parse documentation. Refer to "Custom Adapters" below to see how they work.

- **name** (String): the name of the adapter. These names are reserved and can't be used: `scss`, `js`, `docs`, `fileName`.
- **func** (Object): a function that accepts an input parameter and runs a callback with the parsed data.

### tree

An array containing all of the processed data from the last time Supercollider ran.

### Super(options)

Creates a standalone instance of Supercollider, with no adapters loaded by default.

```js
var Super = require('supercollider');
var s = new Super.Super();
```

#### tree

An array containing the data for every file parsed so far.

#### parse(file, callback)

Parse a Vinyl file to get the documentation. The data is added to the `tree` property of the Supercollider instance.

- **file** (Object): Vinyl file to parse.
- **callback** (Function): a function to run when the parsing is finished. The function has two parameters: `error` and `data`.

No return value.

#### build(data)

Creates an HTML page for a component, using the template specified by `options.template`, with the value of `data` used as Handlebars data.

- **data** (Object): component object to convert to HTML.

Returns a String of HTML.

#### adapter(name, func)

Adds a custom adapter to parse documentation. Refer to "Custom Adapters" below to see how they work.

- **name** (String): the name of the adapter. These names are reserved and can't be used: `scss`, `js`, `docs`, `fileName`.
- **func** (Object): a function that accepts an input parameter and runs a callback with the parsed data.

No return value.

## Custom Adapters

An adapter is a function that hooks into a documentation generator to fetch data associated with a component. This data is passed to the Handlebars template used to render the component's documentation.

Adapters can have an optional configuration object (defined on `module.exports.config`) which allows developers to pass settings to the specific docs generator for that adapter.

An adapter function accepts three parameters:

- **value** (Mixed): page-specific configuration values. This could be any YAML-compatible value, but it's often a string.
- **config** (Object): global configuration values. This is an object that is extended by the developer's config settings.
- **cb** (Function): a callback to run when parsing is finished. The function takes two parameters: an error (or `null` if there's no error), and the parsed data.

Supercollider has two built-in adapters: `sass`, which uses SassDoc, and `js`, which uses JSDoc. You can create your own by calling the `adapter()` method on an instance of Supercollider. An adapter is an asynchronous function that passes parsed data through a callback.

Here's what the built-in SassDoc adapter looks like.

```js
var sassdoc = require('sassdoc');

module.exports = function(value, config, cb) {
  sassdoc.parse(value, config).then(function(data) {
    cb(null, processTree(data));
  });
}

module.exports.config = {
  verbose: false
}

function processTree(tree) {
  var sass = {};

  for (var i in tree) {
    var obj = tree[i];
    var group = obj.context.type

    if (!sass[group]) sass[group] = [];
    sass[group].push(obj);
  }

  return sass;
}
```

## Building Locally

```
git clone https://github.com/gakimball/supercollider
cd supercollider
npm install
npm start
```
