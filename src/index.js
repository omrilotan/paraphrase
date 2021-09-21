import { notate } from './notate/index.js'
import { isObject } from './isObject/index.js'
import { flavours } from './flavours/index.js'

/**
 * Valid types of results for the interpolated string
 * @private
 * @type {Array}
 * @member {String|Number}
 */
const VALID_RESULT_TYPES = Object.seal(['string', 'number'])

/**
  * Create new paraphrase method instance
  * @param  {...RegExp[]} replacers
  * @param  {Boolean}     [options.resolve=true] Should resolve dot notation within template
  * @param  {Boolean}     [options.clean=false]  Should remove unmatched template instances
  * @returns {Function} phraser function instance
  *
  * @example const phraser = paraphrase(/\${([^{}]*)}/gm);
  *
  * phraser('Hello, ${name}', {name: 'Martin'})
  */

export function paraphrase (...replacers) {
  const options = {
    recursive: true,
    resolve: true,
    clean: false
  }
  if (replacers.length && isObject(replacers[replacers.length - 1])) {
    Object.assign(options, replacers.pop())
  }

  Object.freeze(replacers)

  /**
    * phraser description
    * @param  {String}                 string       Template
    * @param  {Object|(String|number)} data         Data for filling
    * @param  {...(String|number)}     replacements Replacement for filling
    * @return {String}                              Result
    */
  function phraser (string = '', data, ...replacements) {
    if (typeof string !== 'string') {
      throw new TypeError(`paraphrase expects first argument to be a string, got a ${typeof string} (${string})`)
    }

    if (!data) {
      return string
    }

    if (VALID_RESULT_TYPES.includes(typeof data)) {
      data = [data, ...replacements]
    }

    /**
      * Replace method build with internal reference to the passed in data structure
      * @param  {String} haystack The full string match
      * @param  {String} needle   The content to identify as data member
      * @return {String}         Found value
      */
    function replace (haystack, needle) {
      const replacement = options.resolve ? notate(data, needle.trim()) : data[needle.trim()]

      return VALID_RESULT_TYPES.includes(typeof replacement) ? replacement : options.clean ? '' : haystack
    }

    const result = replacers.reduce((string, replacer) => string.replace(replacer, replace), string)

    return !options.recursive || string === result
      ? result
      : phraser(result, data, ...replacements)
  }

  Object.defineProperty(
    phraser,
    'patterns',
    {
      get: () => replacers
    }
  )

  return phraser
}

export const dollar = paraphrase(flavours.dollar)
export const double = paraphrase(flavours.double)
export const single = paraphrase(flavours.single)
export const percent = paraphrase(flavours.percent)
export const hash = paraphrase(flavours.hash)
export const loose = paraphrase(
  flavours.dollar,
  flavours.double,
  flavours.percent,
  flavours.hash,
  flavours.single
)
