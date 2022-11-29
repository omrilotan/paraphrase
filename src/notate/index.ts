/**
 * Resolve dot notation strings
 *
 * @param  {any} context Object to start notation search on (defaults to global scope)
 * @param  {string} [string=''] Dot notation representation
 * @return {any} Whatever it finds / undefined
 *
 * @example
 * const obj = {
 *   top_level: {
 *     nested: {
 *       value: 'My Value'
 *     }
 *   }
 * };
 *
 * notate(obj, 'top_level.nested.value');
 * // 'My Value'
 *
 * notate(obj, 'top_level.missing.value');
 * // undefined
 */
export function notate(source: any, string: string = ""): any {
  if (typeof string !== "string") {
    throw new TypeError(
      `Expected notation query to be a string, instead got ${typeof string} (${string})`
    );
  }
  return string
    .split(".")
    .reduce(
      (previous, current) =>
        typeof previous === "object" && previous ? previous[current] : previous,
      source
    );
}
