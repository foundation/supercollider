## API Reference

### config(options)

Sets configuration settings.

- **options** (Object):
  - **template** (String): path to the Handlebars template to use for each component.
  - **src** (String or Array): a glob of files to process. Each file is a component, and can be attached to zero or more adapters to documentation generators.
  - **dest** (String): file path to write the finished HTML to.
  - **marked** (Object): a custom instance of Marked to use when parsing the markdown of your documentation pages. This allows you to pass in custom rendering methods.
    - This value can also be `false`, which disables Markdown parsing on the page body altogether. Use this to create Markdown-based documentation instead of HTML-based.
  - **handlebars** (Object): a custom instance of Handlebars to use when rendering the final HTML. This allows you to pass in custom helpers for use in your template.
  - **extension** (String): extension to change files to after processing. The default is `html`.
  - **silent** (Boolean): enable/disable console logging as pages are processed. The default is `true`.
  - **pageRoot** (String): path to the common folder that every source page sits in. This is only necessary if you're generating [search results](search.md).
  - **data** (Object): extra data to add to the Handlebars instance.

### init()

Parses and builds documentation. Returns a Node stream of Vinyl files.

### adapter(name, func)

Adds a adapter to parse documentation. Refer to [Custom Adapters](#custom-adapters) below to see how they work.

- **name** (String): the name of the adapter. These names are reserved and can't be used: `scss`, `js`, `docs`, `fileName`.
- **func** (Function): a function that accepts an input parameter and runs a callback with the parsed data.

### searchConfig(options)

Sets search-specific settings.

- **options** (Object):
  - **extra** (String): file path to a JSON or YML file with an array of search results. These will be loaded and added as-is to the search result list.
  - **sort** (Array): an array of strings representing sort criteria. The results list can be sorted by the `type` property on each result.

### buildSearch(outFile, cb)

Generates a JSON file of search results using the current set of parsed data.

- **outFile** (String): location to write to disk.
- **cb** (Function): callback to run when the file is written to disk.

### tree

An array containing all of the processed data from the last time Supercollider ran. Each item in the array is a page that was processed.

## Next

- [Read how documentation adapters work, and how to write your own.](adapters.md)
- [Read how to generate a search result list from processed data.](search.md)
