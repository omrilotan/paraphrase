# 3.1.2 2023-09-12

## Improvement

Optimise tree shaking: Omit "falvoured" variables if not used.

# 3.1.1 2023-01-26

## Enhancement

Add sourcemap files

# 3.1.0 2022-11-29

## Features

Add type definitions for TypeScript.

## Internal

Move to TypeScript.

# 3.0.0 2021-09-21

## Breaking change

- All exports are named.

```diff
- import paraphrase from "paraphrase";
+ import { paraphrase } from "paraphrase";
```

### Flavoured imports included

Flavoured pre-made versions should be imported from main entry and not from directory.

```diff
- import dollar from "paraphrase/dollar";
+ import { dollar } from "paraphrase";
```
