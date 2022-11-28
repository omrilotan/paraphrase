# paraphrase [![](https://img.shields.io/npm/v/paraphrase.svg)](https://www.npmjs.com/package/paraphrase)

## 🧩 Create flavoured string template interpolation

[![](https://github.com/omrilotan/paraphrase/workflows/Publish/badge.svg)](https://github.com/omrilotan/paraphrase/actions) [![](https://badge.runkitcdn.com/paraphrase.svg)](https://runkit.com/omrilotan/paraphrase) [![](https://badgen.net/bundlephobia/minzip/paraphrase)](https://bundlephobia.com/result?p=paraphrase)

```
npm i paraphrase
```

Creates new paraphrase method instance

```js
import { paraphrase } from "paraphrase";
const phrase = paraphrase(/\${([^{}]*)}/gm); // Create a new phrase function using a RegExp match

phrase("Hello, ${name}", { name: "Martin" }); // Hello, Martin
```

Acceptable replacements (values) are strings and numbers

### Arguments and Options

One or more RegExp replacers, an optional options object at the end

| option    | meaning                                                                         | type      | default |
| --------- | ------------------------------------------------------------------------------- | --------- | ------- |
| recursive | Should continue to resolve result string until replacements have been exhausted | `Boolean` | `true`  |
| resolve   | Should resolve dot notations within the template                                | `Boolean` | `true`  |
| clean     | Should remove unmatched template instances                                      | `Boolean` | `false` |

##### Multiple replacers

```js
const phrase = paraphrase(/\${([^{}]*)}/gm, /\{{([^{}]*)}}/gm);

phrase("Hello, ${firstname} {{lastname}}", {
  firstname: "Martin",
  lastname: "Prince",
}); // Hello, Martin Prince
```

##### Dot notation resolve

Treat dots as part of the key instead of notation marks

```js
const phrase = paraphrase(/\${([^{}]*)}/gm, { resolve: false });

phrase("Hello, ${name} ${last.name}", {
  name: "Martin",
  "last.name": "Prince",
}); // Hello, Martin Prince
```

##### Unmatched cleanup

Remove unmatched template instances from the result string

```js
const phrase = paraphrase(/\${([^{}]*)}/gm, { clean: true });

phrase("Hello, ${firstname} ${lastname}", { firstname: "Martin" }); // Hello, Martin
```

## Examples

### Objects

```js
phrase("Hello, ${name}", { name: "Martin" }); // Hello, Martin
```

### Objects with dot notation

```js
const user = {
  name: { first: "Martin", last: "Prince" },
};
phrase("Hello, ${name.first} ${name.last}", user); // Hello, Martin Prince
```

### Arrays

```js
phrase("Hello, ${0} ${1}", ["Martin", "Prince"]); // Hello, Martin Prince
```

### Spread arguments

```js
phrase("Hello, ${0} ${1}", "Martin", "Prince"); // Hello, Martin Prince
```

## Premade

### dollar `${...}`

```js
import { dollar as phrase } from "paraphrase";

phrase("Hello, ${name}", { name: "Martin" }); // Hello, Martin
```

### double `{{...}}`

```js
import { double as phrase } from "paraphrase";

phrase("Hello, {{name}}", { name: "Martin" }); // Hello, Martin
```

### single `{...}`

```js
import { single as phrase } from "paraphrase";

phrase("Hello, {name}", { name: "Martin" }); // Hello, Martin
```

### percent `%{...}` (i18n style)

```js
import { percent as phrase } from "paraphrase";

phrase("Hello, %{name}", { name: "Martin" }); // Hello, Martin
```

### hash `#{...}` (ruby style)

```js
import { hash as phrase } from "paraphrase";

phrase("Hello, #{name}", { name: "Martin" }); // Hello, Martin
```

### loose. Accommodate all of the above

```js
import { loose as phrase } from 'paraphrase';

phrase('Hello, #{name.first} {name.last}', {name: { first: 'Martin', last: 'Prince' }); // Hello, Martin Prince
```

## patterns

A paraphrase instance exposes view to its patterns array (immutable)

```js
import { hash as phrase } from "paraphrase";

phrase.patterns; // [ /#{([^{}]*)}/gm ]
```
