# Supercollider

A fancy documentation generator that can mash up documentation from multiple sources, such as [SassDoc](http://sassdoc.com/) and [JSDoc](http://usejsdoc.org/). Used by the [Foundation](https://github.com/zurb/foundation-sites) family of frameworks.

## Features

- Combines [Markdown, SassDoc data, and JSDoc data](overview.md) into compiled HTML pages.
- Supports [custom Markdown and Handlebars](api.md) instances.
- Can generate a [search result list](search.md) out of documentation items.
- Can be [extended](adapters.md) to support other documentation generators.

## Documentation

Read the [overview section](docs/overview.md) of the documentation to get an overview of how Supercollider works. Then check out the [full documentation](docs).

## Local Development

```
git clone https://github.com/gakimball/supercollider
cd supercollider
npm install
npm test
```
