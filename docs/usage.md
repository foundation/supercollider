# Usage

## Installation

```bash
npm install supercollider --save-dev
```

## Setup

Before running the parser, call `Supercollider.config()` with an object of configuration settings. Refer to the [full API](api.md) to see every option.

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

You can also create custom adapters by passing in a function as a second parameter. Refer to the [adapters](adapters.md) section of the docs to learn more.

## Initializing

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

You can also omit the `src` and `dest` settings when calling `.config()`, and use the same method in the middle of a Gulp stream (or any Node stream that happens to use [Vinyl](https://github.com/gulpjs/vinyl) files). The function takes in a glob of Markdown files, and transforms them into compiled HTML files.

```js
gulp.src('./pages/*.md')
  .pipe(Super.init())
  .pipe(gulp.dest('./build'));
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

## Next

[Read the full API documentation, which includes all configuration settings.](api.md)
