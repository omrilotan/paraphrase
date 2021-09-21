# 3.0.0 2021-09-21

## Breaking change

### All exports are named
```js
import { paraphrase } from 'paraphrase'
```

### Flavoured imports included
Flavoured pre-made versions should be imported from main entry and not from directory.
```js
import { dollar } from 'paraphrase'
```

# 2.0.0 2021-05-11

## Breaking change

### Remove compiled version.
If you are using a bundler with babel, make sure you transpile this package to your liking
