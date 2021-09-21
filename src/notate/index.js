/**
 * Resolve dot notation strings
 *
 * @param  {Object} context Object to start notation search (defaults to global scope)
 * @param  {String} [string=''] Dot notation representation
 * @return {Any} Whatever it finds / undefined
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
export function notate (source, string = '') {
  if (typeof string !== 'string') {
    throw new TypeError(`Expected notation query to be a string, instead got ${typeof string} (${string})`)
  }
  return string
    .split('.')
    .reduce(
      (previous, current) => typeof previous === 'object' && previous
        ? previous[current]
        : previous,
      source
    )
}
