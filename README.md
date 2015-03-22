# Supercollider

A fancy documentation generator that can mash up documentation from multiple sources.

## How it Works

Supercollider parses a glob of Markdown files, pulls in relevant documentation from Sass and JavaScript files, and combines it all into one JSON object, which is passed to a Handlebars template that renders the final page.

A typical page will look like this:

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
  "fileName": "componentName"
  "docs": "<p>General documentation for your component.</p>",
  "sass": [],
  "js": []
}
```

## Usage

```js
var Super = require('supercollider');

Super.init('./pages/*.md', {
  template: './template.html',
  adapters: ['sass', 'js'],
  dest: './build'
});
```

## API

### init(files, options)

Parses, processes, and builds documentation all at once. The `scss` and `js` adapters are available by default.

- **files** (String): a glob of files to process. Each file is a component, and can be attached to zero or more adapters to documentation generators.
- **options** (Object):
  - **template** (String): path to the Handlebars template to use for each component.
  - **adapters** (Array): a list of strings that reference the adapters to use.
  - **dest** (String): file path to write the finished HTML to.

### adapter(name, methods)

Creates a custom adapter. Refer to "Custom Adapters" below to see how they work.

- **name** (String): the name of the adapter. These names are reserved and can't be used: `scss`, `js`, `title`, `description`, `fileName`.
- **methods** (Object): an object with two functions: `parse` and `process`.

### Super(options)

Creates a standalone instance of Supercollider, with no adapters loaded by default. With the standalone instance, you can run any of the three steps in the process separately.

#### parse(files, callback)

Parses a glob of files for documentation. The process is asynchronous so you need a callback to run as well.

- **files** (String or Array): a glob of files to parse.
- **callback** (Function): a function to run when the parsing is finished. The function has one parameter, `data`, which is an array of objects, each object being a component.

#### process(tree)

Processes the contents of a data tree created with `parse()`, using each adapter's `process` method. Returns a new array of objects with reworked formatting.

#### build(tree)

Creates HTML pages for each component and writes them to disk. The template specified in `options.template` is compiled for each component. All of the variables for that component are passed in as Handlebars data. The filename of the HTML will be the same as the filename of the original Markdown file, with the extension changed to `.html`.

#### adapter(use, methods)

Adds a custom adapter. Refer to the documentation for for `adapter()` farther up the page.

## Custom Adapters

An adapter is a set of functions that hook into a documentation generator to fetch data associated with a component. This data is passed to the Handlebars template used to render the component's documentation.

Supercollider has two built-in adapters: `sass`, which uses SassDoc, and `js`, which uses JSDoc. You can create your own by calling the `adapter()` method on an instance of Supercollider. An adapter is an object with two methods: `parse()` and `process()`.

- **Parsing** is the act of fetching the raw data from the documentation generator. The parsing function should accept two parameters:
  - **value** is the value entered into the component page's front matter. Typically this is a file path to be used by the documentation generator.
  - **cb** is a callback to be run when the data is ready. This allows you to parse files asynchronously if needed. The callback should return two parameters:
    - *error*, which can be an instance of an error, or `null` if there's no error.
    - *data*, the data parsed from the generator.
- **Processing** is the act of refining the data to make it easier to use in templates. Although an adapter needs a parse method, it's more or less optional, depending on how your data is initially formatted. Unlike parsing, processing must be done synchronously.
  - The processing function accepts one parameter, *tree*, which is the original object returned by the `parse()` function.
  - Within this function you can modify the data and `return` a new object, which will override the original.

Here's what the built-in SassDoc adapter looks like.

```js
var sassdoc = require('sassdoc');

module.exports = {
  // Parses documentation from the file path passed in through "value"
  parse: function(value, cb) {
    sassdoc.parse(value, {verbose: true}).then(function(data) {
      // When the parsing is done, the callback passes back the data as-is
      cb(null, data);
    });
  },

  // Processes the raw SassDoc data to organize it better
  process: function(tree) {
    var sass = {
      'variable': [],
      'mixin': [],
      'function': []
    }

    // The big array of objects is sorted by type into three arrays
    for (var i in tree) {
      var obj = tree[i];
      sass[obj.context.type].push(obj);
    }

    return sass;
  }
}
```

## Building Locally

```
git clone https://github.com/gakimball/supercollider
cd supercollider
npm install
npm start
```