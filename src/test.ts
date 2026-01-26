import { describe, test } from "node:test";
import assert from "node:assert";
import {
  paraphrase,
  loose,
  dollar,
  double,
  single,
  hash,
  percent,
} from "./index.ts";

const flavours: [Function, string][] = [
  [dollar, "Hello, ${name} ${ last }"],
  [double, "Hello, {{name}} {{ last }}"],
  [single, "Hello, {name} { last }"],
  [percent, "Hello, %{name} %{ last }"],
  [hash, "Hello, #{name} #{ last }"],
];

describe("paraphrase", (): void => {
  describe("paraphrase basic functionality", (): void => {
    const phrase = paraphrase(/\${([^{}]*)}/g);
    test("instance can process string", (): void =>
      assert.doesNotThrow(() => phrase.bind(null, "")));
    test("instance can not process non string", (): void =>
      assert.throws(() => phrase({} as any, {}), TypeError));
  });

  describe("paraphrase replacers", () => {
    test("multiple and similar replacement values", (): void => {
      const phrase = paraphrase(/\${([^{}]*)}/g);
      const first = "Martin";
      const last = "Prince";

      const res = phrase("Hello, ${ first } ${ first } ${ last }", {
        first,
        last,
      });
      assert.strictEqual(phrase(res), `Hello, ${first} ${first} ${last}`);
    });

    test("multiple replacers", (): void => {
      const phrase = paraphrase(
        /\${([^{}]*)}/g,
        /%{([^{}]*)}/g,
        /{{([^{}]*)}}/g,
      );
      const first = "Martin";
      const last = "Prince";
      const res = phrase("Hello, ${ first } %{ first } {{ last }}", {
        first,
        last,
      });
      assert.strictEqual(phrase(res), `Hello, ${first} ${first} ${last}`);
    });

    test("multiple replacers passed as an array", (): void => {
      const phrase = paraphrase([
        /\${([^{}]*)}/g,
        /%{([^{}]*)}/g,
        /{{([^{}]*)}}/g,
      ]);
      const first = "Martin";
      const last = "Prince";
      const res = phrase("Hello, ${ first } %{ first } {{ last }}", {
        first,
        last,
      });
      assert.strictEqual(phrase(res), `Hello, ${first} ${first} ${last}`);
    });

    test("a mixed bag of compliant and non compliant arguments", (): void => {
      const phrase = paraphrase(
        "{{([^{}]*)}}" as any,
        null as any,
        /\${([^{}]*)}/g,
        [/%{([^{}]*)}/g],
        { recursive: false },
      );
      const first = "Martin";
      const last = "Prince";
      const res = phrase("Hello, ${ first } %{ first } {{ last }}", {
        first,
        last,
      });
      assert.strictEqual(phrase(res), `Hello, ${first} ${first} {{ last }}`);
    });

    test("expose its replacers", (): void => {
      const patterns = [/\${([^{}]*)}/g, /%{([^{}]*)}/g, /{{([^{}]*)}}/g];
      const phrase = paraphrase(...patterns);
      assert.ok(Array.isArray(phrase.patterns));
      assert.ok(phrase.patterns.every((pattern) => pattern instanceof RegExp));
      assert.strictEqual(phrase.patterns[0], patterns[0]);
    });

    test("patterns array mutations does not affect the instance", (): void => {
      const patterns = [/{{([^{}]*)}}/g];
      const phrase = paraphrase(...patterns);
      patterns.pop();
      assert.strictEqual(phrase("{{ key }}", { key: "value" }), "value");
      assert.strictEqual(patterns.length, 0);
      assert.strictEqual(phrase.patterns.length, 1);
    });
  });

  describe("works with spread arguments", (): void => {
    const phrase = paraphrase(/\${([^{}]*)}/g);

    test("Uses string arguments", (): void => {
      const string = "Hello, ${0} ${1}";

      assert.strictEqual(
        phrase(string, "Martin", "Prince"),
        "Hello, Martin Prince",
      );
    });

    test("Uses number arguments", (): void => {
      const string = "Hello, ${0} ${1}";

      assert.strictEqual(phrase(string, 4, 6), "Hello, 4 6");
    });
  });

  describe("recursive replacements", (): void => {
    const phrase = paraphrase(/\${([^{}]*)}/g);

    test("Should replace recursively", (): void => {
      const string = "Hello, ${full_name}";
      const data = {
        full_name: "${first_name} ${last_name}",
        first_name: "Martin",
        last_name: "Prince",
      };
      assert.strictEqual(phrase(string, data), "Hello, Martin Prince");
    });
  });

  describe("options", (): void => {
    describe("resolve nested data", (): void => {
      const phrase = paraphrase(/\${([^{}]*)}/g);
      const phraseNoResolve = paraphrase(/\${([^{}]*)}/g, { resolve: false });
      const phraseNoRecursive = paraphrase(/\${([^{}]*)}/g, {
        recursive: false,
      });

      test("resolves dot notation", (): void => {
        const string = "Hello, ${name.first} ${name.last}";
        const data = {
          name: {
            first: "Martin",
            last: "Prince",
          },
        };

        assert.strictEqual(phrase(string, data), "Hello, Martin Prince");
      });

      test("resolves arrays", (): void => {
        const string = "Hello, ${0} ${1}";
        const name = ["Martin", "Prince"];

        assert.strictEqual(phrase(string, name), "Hello, Martin Prince");
      });

      const resolveTestCases = [
        ["Prince", "Prince"],
        [Infinity, "Infinity"],
        [null, "${1}"],
        [[1, 2, 3], "${1}"],
        [{ key: "Balue", toString: () => "A String" }, "${1}"],
      ];

      for (const [arg, expected] of resolveTestCases) {
        test(`resolve ${JSON.stringify(arg)} to ${expected}`, (): void => {
          assert.strictEqual(
            phrase("Hello, ${0} ${1}", "Martin", arg),
            `Hello, Martin ${expected}`,
          );
        });
      }

      test("misses keys with dots", (): void => {
        const string = "Hello, ${name.first} ${name.last}";
        const data = {
          "name.first": "Martin",
          "name.last": "Prince",
        };

        assert.strictEqual(
          phrase(string, data),
          "Hello, ${name.first} ${name.last}",
        );
      });

      test("does not resolve dot notation (explicit)", (): void => {
        const string = "Hello, ${name.first} ${name.last}";
        const data = {
          "name.first": "Martin",
          "name.last": "Prince",
        };

        assert.strictEqual(
          phraseNoResolve(string, data),
          "Hello, Martin Prince",
        );
      });

      test("Should not replace pattern recursively", (): void => {
        const string = "Hello, ${full_name}";
        const data = {
          full_name: "${first_name} ${last_name}",
          first_name: "Martin",
          last_name: "Prince",
        };
        assert.strictEqual(
          phraseNoRecursive(string, data),
          "Hello, ${first_name} ${last_name}",
        );
      });
    });

    describe("clean parsing", (): void => {
      test("Should leave unmatched template combinations", (): void => {
        const parser = paraphrase(/\${([^{}]*)}/g, { clean: false });
        const string = "Hello, ${name.first} ${name.last}";
        const data = {};

        assert.strictEqual(
          parser(string, data),
          "Hello, ${name.first} ${name.last}",
        );
      });
      test("Should remove unmatched template combinations", (): void => {
        const parser = paraphrase(/\${([^{}]*)}/g, { clean: true });
        const string = "Hello, ${name.first} ${name.last}";
        const data = {};

        assert.strictEqual(parser(string, data), "Hello,  ");
      });
    });
  });

  describe("flavours", (): void => {
    for (const [fn, template] of flavours) {
      test(`${fn.name} → ${template}`, () => {
        assert.strictEqual(
          fn(template, { name: "Martin", last: "King" }),
          "Hello, Martin King",
        );
      });
    }

    for (const [_, template] of flavours) {
      test(`"loose" can parse (${template.substring(0, 20)}...)`, () => {
        assert.strictEqual(
          loose(template, { name: "Martin", last: "King" }),
          "Hello, Martin King",
        );
      });
    }
  });
});
