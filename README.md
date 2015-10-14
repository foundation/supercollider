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

## Setup

Before running the parser, call `Supercollider.config()` with an object of configuration settings. Refer to the [configuration](#configoptions) section below to see every option.

```js
var Super = require('supercollider');

Super.config({
  src: './pages/*.md',
  dest: './build',
  template: './template.html'
});
```

By default, Supercollider can parse Markdown into HTML for you. It also includes two built-in *adapters*, which hook into external documentation generators. The built-in adapters are called `sass` (SassDoc) and `js` (JSDoc). Enbale them with the `.adapter()` method.

```js
Super
  .adapter('sass')
  .adapter('js');
```

You can also create custom adapters by passing in a function as a second parameter. Refer to [adapter()](#adaptername-func) below.

## Usage

The plugin can be used standalone or with the [Gulp](https://github.com/gulpjs/gulp) build system.

To use the library standalone, call `Supercollider.init()` with the option `src` being a glob of files, and `dest` being an output folder.

```js
Super.init();
```

The `.init()` function returns a stream. You can listen to the `finish` event to know when the processing is done.

```
var stream = Super.init();
stream.on('finish', function() {
  // ...
});
```

You can also omit the `src` and `dest` settings, and use the same method in the middle of a Gulp stream (or any Node stream that happens to use [Vinyl](https://github.com/gulpjs/vinyl) files). The function takes in a glob of Markdown files, and transforms them into compiled HTML files.

```js
gulp.src('./pages/*.md')
  .pipe(Super.init())
  .pipe(gulp.dest('./build'));
```

## API

### config(options)

Sets configuration settings.

- **options** (Object):
  - **template** (String): path to the Handlebars template to use for each component.
  - **src** (String or Array): a glob of files to process. Each file is a component, and can be attached to zero or more adapters to documentation generators.
  - **dest** (String): file path to write the finished HTML to.
  - **marked** (Object): a custom instance of Marked to use when parsing the markdown of your documentation pages. This allows you to pass in custom rendering methods.
    - This value can also be `false`, which disables Markdown parsing on the page body altogether.
  - **handlebars** (Object): a custom instance of Handlebars to use when rendering the final HTML. This allows you to pass in custom helpers for use in your template.
  - **extension** (String): extension to change files to after processing. The default is `html`.

### init()

Parses and builds documentation. Returns a Node stream of Vinyl files.

### adapter(name, func)

Adds a adapter to parse documentation. Refer to [Custom Adapters](#custom-adapters) below to see how they work.

- **name** (String): the name of the adapter. These names are reserved and can't be used: `scss`, `js`, `docs`, `fileName`.
- **func** (Function): a function that accepts an input parameter and runs a callback with the parsed data.

### tree

An array containing all of the processed data from the last time Supercollider ran. Each item in the array is a page that was processed.

## Custom Adapters

An adapter is a function that hooks into a documentation generator to fetch data associated with a component. This data is passed to the Handlebars template used to render the component's documentation.

Adapters can have an optional configuration object (defined on `module.exports.config`), which can be used to allow developers to pass settings to the specific docs generator for that adapter.

An adapter function accepts three parameters:

- **value** (Mixed): page-specific configuration values. This could be any YAML-compatible value, but it's often a string.
- **config** (Object): global configuration values. This is the adapter's defaults, extended by the developer's own settings.
- **cb** (Function): a callback to run when parsing is finished. The function takes two parameters: an error (or `null` if there's no error), and the parsed data.

Supercollider has two built-in adapters: `sass`, which uses SassDoc, and `js`, which uses JSDoc. You can create your own by calling the `adapter()` method on Supercollider. An adapter is an asynchronous function that passes parsed data through a callback.

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

## Command Line Use

Supercollider can be installed globally and used from the command line. For now, only the `sass` and `js` adapters can be used.

```
  Usage: supercollider [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -s, --source <glob>      Glob of files to process
    -t, --template <file>    Handlebars template to use
    -a, --adapters <items>   Adapters to use
    -d, --dest <folder>      Folder to output HTML to
    -m, --marked <file>      Path to a Marked renderer instance
    -h, --handlebars <file>  Path to a Handlebars instance
```

## Building Locally

```
git clone https://github.com/gakimball/supercollider
cd supercollider
npm install
npm start
```
