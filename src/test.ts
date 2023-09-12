import { paraphrase, loose, dollar, double, single, hash, percent } from ".";

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
      expect(phrase.bind(null, "")).not.toThrow(TypeError));
    test("instance can not process non string", (): void =>
      expect(phrase.bind(null, {})).toThrow(TypeError));
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
      expect(phrase(res)).toBe(`Hello, ${first} ${first} ${last}`);
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
      expect(phrase(res)).toBe(`Hello, ${first} ${first} ${last}`);
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
      expect(phrase(res)).toBe(`Hello, ${first} ${first} ${last}`);
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
      expect(phrase(res)).toBe(`Hello, ${first} ${first} {{ last }}`);
    });

    test("expose its replacers", (): void => {
      const patterns = [/\${([^{}]*)}/g, /%{([^{}]*)}/g, /{{([^{}]*)}}/g];
      const phrase = paraphrase(...patterns);
      expect(Array.isArray(phrase.patterns)).toBe(true);
      expect(
        phrase.patterns.every((pattern) => pattern instanceof RegExp),
      ).toBe(true);
      expect(phrase.patterns[0]).toBe(patterns[0]);
    });

    test("patterns array mutations does not affect the instance", (): void => {
      const patterns = [/{{([^{}]*)}}/g];
      const phrase = paraphrase(...patterns);
      patterns.pop();
      expect(phrase("{{ key }}", { key: "value" })).toBe("value");
      expect(patterns).toHaveLength(0);
      expect(phrase.patterns).toHaveLength(1);
    });
  });

  describe("works with spread arguments", (): void => {
    const phrase = paraphrase(/\${([^{}]*)}/g);

    test("Uses string arguments", (): void => {
      const string = "Hello, ${0} ${1}";

      expect(phrase(string, "Martin", "Prince")).toBe("Hello, Martin Prince");
    });

    test("Uses number arguments", (): void => {
      const string = "Hello, ${0} ${1}";

      expect(phrase(string, 4, 6)).toBe("Hello, 4 6");
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
      expect(phrase(string, data)).toBe("Hello, Martin Prince");
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

        expect(phrase(string, data)).toBe("Hello, Martin Prince");
      });

      test("resolves arrays", (): void => {
        const string = "Hello, ${0} ${1}";
        const name = ["Martin", "Prince"];

        expect(phrase(string, name)).toBe("Hello, Martin Prince");
      });

      test.each([
        ["Prince", "Prince"],
        [Infinity, "Infinity"],
        [null, "${1}"],
        [[1, 2, 3], "${1}"],
        [{ key: "Balue", toString: () => "A String" }, "${1}"],
      ])("resolve %s to %s", (arg, expected): void => {
        expect(phrase("Hello, ${0} ${1}", "Martin", arg)).toBe(
          `Hello, Martin ${expected}`,
        );
      });

      test("misses keys with dots", (): void => {
        const string = "Hello, ${name.first} ${name.last}";
        const data = {
          "name.first": "Martin",
          "name.last": "Prince",
        };

        expect(phrase(string, data)).toBe("Hello, ${name.first} ${name.last}");
      });

      test("does not resolve dot notation (explicit)", (): void => {
        const string = "Hello, ${name.first} ${name.last}";
        const data = {
          "name.first": "Martin",
          "name.last": "Prince",
        };

        expect(phraseNoResolve(string, data)).toBe("Hello, Martin Prince");
      });

      test("Should not replace pattern recursively", (): void => {
        const string = "Hello, ${full_name}";
        const data = {
          full_name: "${first_name} ${last_name}",
          first_name: "Martin",
          last_name: "Prince",
        };
        expect(phraseNoRecursive(string, data)).toBe(
          "Hello, ${first_name} ${last_name}",
        );
      });
    });

    describe("clean parsing", (): void => {
      test("Should leave unmatched template combinations", (): void => {
        const parser = paraphrase(/\${([^{}]*)}/g, { clean: false });
        const string = "Hello, ${name.first} ${name.last}";
        const data = {};

        expect(parser(string, data)).toBe("Hello, ${name.first} ${name.last}");
      });
      test("Should remove unmatched template combinations", (): void => {
        const parser = paraphrase(/\${([^{}]*)}/g, { clean: true });
        const string = "Hello, ${name.first} ${name.last}";
        const data = {};

        expect(parser(string, data)).toBe("Hello,  ");
      });
    });
  });

  describe("flavours", (): void => {
    test.each(flavours)("%s → %s", (fn, template) => {
      expect(fn(template, { name: "Martin", last: "King" })).toBe(
        "Hello, Martin King",
      );
    });

    test.each(flavours)('"loose" can parse (%s) %s', (_, template) => {
      expect(loose(template, { name: "Martin", last: "King" })).toBe(
        "Hello, Martin King",
      );
    });
  });
});
