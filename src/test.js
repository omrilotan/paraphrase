/* eslint-env mocha */
/* eslint-disable no-template-curly-in-string */

import { expect } from 'chai'
import {
  paraphrase,
  loose,
  dollar,
  double,
  single,
  hash,
  percent
} from './index.js'

const flavours = [
  [dollar, 'Hello, ${name} ${ last }'],
  [double, 'Hello, {{name}} {{ last }}'],
  [single, 'Hello, {name} { last }'],
  [percent, 'Hello, %{name} %{ last }'],
  [hash, 'Hello, #{name} #{ last }']
]

describe('paraphrase', () => {
  describe('paraphrase basic functionality', () => {
    const phrase = paraphrase(/\${([^{}]*)}/g)
    it('instance can process string', () => expect(phrase.bind(null, '')).to.not.throw(TypeError))
    it('instance can not process non string', () => expect(phrase.bind(null, {})).to.throw(TypeError))
  })

  describe('paraphrase replacers', () => {
    it('multiple and similar replacement values', () => {
      const phrase = paraphrase(/\${([^{}]*)}/g)
      const first = 'Martin'
      const last = 'Prince'

      const res = phrase('Hello, ${ first } ${ first } ${ last }', { first, last })
      expect(phrase(res)).to.equal(`Hello, ${first} ${first} ${last}`)
    })

    it('multiple replacers', () => {
      const phrase = paraphrase(
        /\${([^{}]*)}/g,
        /%{([^{}]*)}/g,
        /{{([^{}]*)}}/g
      )
      const first = 'Martin'
      const last = 'Prince'
      const res = phrase('Hello, ${ first } %{ first } {{ last }}', { first, last })
      expect(phrase(res)).to.equal(`Hello, ${first} ${first} ${last}`)
    })

    it('Should expose its replacers', () => {
      const patterns = [
        /\${([^{}]*)}/g,
        /%{([^{}]*)}/g,
        /{{([^{}]*)}}/g
      ]
      const phrase = paraphrase(...patterns)
      expect(phrase.patterns).to.be.an('array')
      expect(
        phrase.patterns.every(pattern => pattern instanceof RegExp)
      ).to.equal(true)
      expect(phrase.patterns[0]).to.equal(patterns[0])
    })

    it('patterns array mutations does not affect the instance', () => {
      const patterns = [/{{([^{}]*)}}/g]
      const phrase = paraphrase(...patterns)
      patterns.pop()
      expect(phrase('{{ key }}', { key: 'value' })).equal('value')
      expect(patterns).to.have.lengthOf(0)
      expect(phrase.patterns).to.have.lengthOf(1)
    })
  })

  describe('works with spread arguments', () => {
    const phrase = paraphrase(/\${([^{}]*)}/g)

    it('Uses string arguments', () => {
      const string = 'Hello, ${0} ${1}'

      expect(phrase(string, 'Martin', 'Prince')).to.equal('Hello, Martin Prince')
    })

    it('Uses number arguments', () => {
      const string = 'Hello, ${0} ${1}'

      expect(phrase(string, 4, 6)).to.equal('Hello, 4 6')
    })
  })

  describe('recursive replacements', () => {
    const phrase = paraphrase(/\${([^{}]*)}/g)

    it('Should replace recursively', () => {
      const string = 'Hello, ${full_name}'
      const data = {
        full_name: '${first_name} ${last_name}',
        first_name: 'Martin',
        last_name: 'Prince'
      }
      expect(phrase(string, data)).to.equal('Hello, Martin Prince')
    })
  })

  describe('options', () => {
    describe('resolve nested data', () => {
      const phrase = paraphrase(/\${([^{}]*)}/g)
      const phraseNoResolve = paraphrase(/\${([^{}]*)}/g, { resolve: false })
      const phraseNoRecursive = paraphrase(/\${([^{}]*)}/g, { recursive: false })

      it('resolves dot notation', () => {
        const string = 'Hello, ${name.first} ${name.last}'
        const data = {
          name: {
            first: 'Martin',
            last: 'Prince'
          }
        }

        expect(phrase(string, data)).to.equal('Hello, Martin Prince')
      })

      it('resolves arrays', () => {
        const string = 'Hello, ${0} ${1}'
        const name = [
          'Martin',
          'Prince'
        ]

        expect(phrase(string, name)).to.equal('Hello, Martin Prince')
      })

      it('misses keys with dots', () => {
        const string = 'Hello, ${name.first} ${name.last}'
        const data = {
          'name.first': 'Martin',
          'name.last': 'Prince'
        }

        expect(phrase(string, data)).to.equal('Hello, ${name.first} ${name.last}')
      })

      it('does not resolve dot notation (explicit)', () => {
        const string = 'Hello, ${name.first} ${name.last}'
        const data = {
          'name.first': 'Martin',
          'name.last': 'Prince'
        }

        expect(phraseNoResolve(string, data)).to.equal('Hello, Martin Prince')
      })

      it('Should not replace pattern recursively', () => {
        const string = 'Hello, ${full_name}'
        const data = {
          full_name: '${first_name} ${last_name}',
          first_name: 'Martin',
          last_name: 'Prince'
        }
        expect(phraseNoRecursive(string, data)).to.equal('Hello, ${first_name} ${last_name}')
      })
    })

    describe('clean parsing', () => {
      it('Should leave unmatched template combinations', () => {
        const parser = paraphrase(/\${([^{}]*)}/g, { clean: false })
        const string = 'Hello, ${name.first} ${name.last}'
        const data = {}

        expect(parser(string, data)).to.equal('Hello, ${name.first} ${name.last}')
      })
      it('Should remove unmatched template combinations', () => {
        const parser = paraphrase(/\${([^{}]*)}/g, { clean: true })
        const string = 'Hello, ${name.first} ${name.last}'
        const data = {}

        expect(parser(string, data)).to.equal('Hello,  ')
      })
    })
  })

  describe('flavours', () => {
    flavours.forEach(([fn, template]) => {
      it(template, () => {
        expect(
          fn(template, { name: 'Martin', last: 'King' })
        ).to.equal(
          'Hello, Martin King'
        )
      })
    })
    flavours.forEach(([, template]) => {
      it(`"loose" can parse ${template}`, () => {
        expect(
          loose(template, { name: 'Martin', last: 'King' })
        ).to.equal(
          'Hello, Martin King'
        )
      })
    })
  })
})
