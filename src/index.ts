import { notate } from "./notate/index";
import { isObject } from "./isObject/index";
import { flavours } from "./flavours/index";

/**
 * Valid types of results for the interpolated string
 */
const VALID_RESULT_TYPES: ["string", "number"] = Object.seal([
  "string",
  "number",
]);

interface IParaphraseOptions {
  /**
   * Should continue to resolve result string until replacements have been exhausted
   */
  recursive?: boolean;
  /**
   * Should resolve dot notation within template
   */
  resolve?: boolean;
  /**
   * Should remove unmatched template instances
   */
  clean?: boolean;
}

interface Phraser {
  (
    /**
     * Template string to parse
     */
    string: string | undefined,
    /**
     * Data to use for interpolation, preferrably an object, but an array will work too, and a primitive values will be treated as an array of "...rest" arguments
     */
    ...data: (Record<string, any> | any)[]
  ): string;
  patterns: RegExp[];
}

/**
 * Create new paraphrase method instance
 * @param  {...RegExp[]} replacers[] One or more patterns to use for string replacement
 * @param  {IParaphraseOptions} [options] The last argument can be an options object
 * @returns {Phraser} phraser function instance
 *
 * @example const phraser = paraphrase(/\${([^{}]*)}/gm);
 *
 * phraser('Hello, ${name}', {name: 'Martin'})
 */
export function paraphrase(
  ...args: (RegExp | RegExp[] | IParaphraseOptions)[]
): Phraser {
  const options: IParaphraseOptions = {
    recursive: true,
    resolve: true,
    clean: false,
  };
  if (args.length && isObject(args[args.length - 1])) {
    Object.assign(options, args.pop() as IParaphraseOptions);
  }
  const patterns = args.flat().filter((arg) => arg instanceof RegExp);

  Object.freeze(patterns);

  /**
   * phraser description
   * @param  {string}                 string       Template
   * @param  {Object|(string|number)} data         Data for filling
   * @param  {...(string|number)}     replacements Replacement for filling
   * @return {string}                              Result
   */
  function phraser(
    string: string = "",
    data: string | number | Record<string, any>,
    ...replacements: (string | number)[]
  ): string {
    if (typeof string !== "string") {
      throw new TypeError(
        `paraphrase expects first argument to be a string, got a ${typeof string} (${string})`
      );
    }

    if (!data) {
      return string;
    }

    if (VALID_RESULT_TYPES.includes(typeof data as any)) {
      data = [data, ...replacements];
    }

    /**
     * Replace method build with internal reference to the passed in data structure
     * @param  {string} haystack The full string match
     * @param  {string} needle   The content to identify as data member
     * @return {string}         Found value
     */
    function replace(haystack: string, needle: string): string {
      const replacement = options.resolve
        ? notate(data, needle.trim())
        : data[needle.trim()];

      return VALID_RESULT_TYPES.includes(typeof replacement as any)
        ? replacement
        : options.clean
        ? ""
        : haystack;
    }

    const result = (patterns as RegExp[]).reduce(
      (string: string, pattern: RegExp): string =>
        string.replace(pattern, replace),
      string
    );

    return !options.recursive || string === result
      ? result
      : phraser(result, data, ...replacements);
  }

  Object.defineProperty(phraser, "patterns", {
    get: () => patterns,
  });

  return phraser as Phraser;
}

export const dollar = paraphrase(flavours.dollar);
export const double = paraphrase(flavours.double);
export const single = paraphrase(flavours.single);
export const percent = paraphrase(flavours.percent);
export const hash = paraphrase(flavours.hash);
export const loose = paraphrase(
  flavours.dollar,
  flavours.double,
  flavours.percent,
  flavours.hash,
  flavours.single
);
