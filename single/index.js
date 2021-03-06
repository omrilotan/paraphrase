/**
 * @module single
 * @since 1.5.0
 */

/**
 * A paraphraser: Replace method build with internal reference to the passed in data structure
 * @param  {String} haystack The full string match
 * @param  {String} needle   The content to identify as data member
 * @return {String}          Found value
 *
 * @example
 * double('Hello, {name}', {name: 'Martin'}) // 'Hello, Martin'
 */
module.exports = require('../')(/{([^{}]*)}/gm);
