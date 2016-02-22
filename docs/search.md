## Search

Supercollider can generate a list of search results from the pages and documentation items it processes. This list is output as a JSON file, which can be fed to a search library like [Bloodhound](https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md).

To create the result list, Supercollider gives each *page* its own result item, and also every documented *item* within each page a result as well. So, for example, given a page `button.md` with two documented Sass variables, you'll get three total results: one for the button page itself, and two for each of the button's variables.

### Usage

Search result generation should only happen when Supercollider is done processing. You can listen to the `finish` event on the stream the plugin creates to know when it's ready.

```js
Super.init().on('finish', function() {
  Super.buildSearch('_build/data/search.json');
});
```

The `.buildSearch()` function takes two parameters: a path to the file to write, and an optional callback to run when the file is written to disk.

### Configuration

Search-specific settings are set with the `.searchConfig()` method. It takes an object of settings:

- **extra** (String): file path to a JSON or YML file with an array of search results. These will be loaded and added as-is to the search result list.
- **pageTypes** (Object): definitions for custom page types. Each key is a type label, and the value is a function that determines if the label should be applied to a page.
- **sort** (Array): an array of strings representing sort criteria. The results list can be sorted by the `type` property on each result.

```js
Super.searchConfig({
  // The contents of this file will be added to the final results
  extra: 'src/assets/search.yml',
  // Sort search results so pages always appear first in the list
  sort: ['page', 'component', 'sass variable', 'sass mixin', 'sass function']
})
```

### Result Format

The final search result file is an array of objects with this format:

```js
{
  // Title of the result (derived from the item's name)
  name: 'Button',
  // Result type (used for sorting)
  type: 'page',
  // Description (derived from the item's description field)
  description: 'Buttons are a swell UI component.',
  // Link to the item (should be used by a search plugin to direct the user)
  link: 'button.html',
  // Aliases for the page (can be used by a search plugin to fuzzy search)
  tags: ['btn']
}
```

All of these fields are generated from existing data. For example, given a Sass variable with this documentation:

```scss
/// Background color of a button.
/// @type Color
$button-background: dodgerblue;
```

We get a search result of this format:

```js
{
  name: '$button-background',
  type: 'sass variable',
  description: 'Background color of a button.',
  link: 'button.html#sass-variables'
}
```
