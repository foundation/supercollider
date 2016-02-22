## Overview

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

## Next

[Read how to use Supercollider standalone, as a Gulp plugin, or from the command line.](usage.md)
