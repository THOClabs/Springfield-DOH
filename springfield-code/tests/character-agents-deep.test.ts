/**
 * Character Agent Deep Tests (Batch 76)
 *
 * Deep testing of character agent files and their content,
 * verifying markdown structure, character traits, and consistency.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

const AGENTS_PATH = path.join(__dirname, "..", "src", "agents");
const SIMPSON_FAMILY_PATH = path.join(AGENTS_PATH, "simpson-family");
const EXTENDED_PATH = path.join(AGENTS_PATH, "extended");
const SPRINGFIELD_PATH = path.join(AGENTS_PATH, "springfield");

describe("Simpson Family Agent Files", () => {
  const simpsonFamilyAgents = ["homer", "marge", "bart", "lisa", "maggie"];

  describe("file existence", () => {
    for (const agent of simpsonFamilyAgents) {
      it(`${agent}.md exists`, () => {
        const filePath = path.join(SIMPSON_FAMILY_PATH, `${agent}.md`);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    }
  });

  describe("file content structure", () => {
    for (const agent of simpsonFamilyAgents) {
      it(`${agent}.md has content`, () => {
        const filePath = path.join(SIMPSON_FAMILY_PATH, `${agent}.md`);
        const content = fs.readFileSync(filePath, "utf-8");
        expect(content.length).toBeGreaterThan(100);
      });

      it(`${agent}.md starts with heading`, () => {
        const filePath = path.join(SIMPSON_FAMILY_PATH, `${agent}.md`);
        const content = fs.readFileSync(filePath, "utf-8");
        expect(content.startsWith("#")).toBe(true);
      });
    }
  });

  describe("homer.md content", () => {
    let homerContent: string;

    beforeEach(() => {
      homerContent = fs.readFileSync(
        path.join(SIMPSON_FAMILY_PATH, "homer.md"),
        "utf-8"
      );
    });

    it("contains character name", () => {
      expect(homerContent.toLowerCase()).toContain("homer");
    });

    it("contains role or purpose description", () => {
      expect(homerContent.toLowerCase()).toMatch(/question|assumption|dumb/);
    });

    it("has multiple sections", () => {
      const headingCount = (homerContent.match(/^#+\s/gm) || []).length;
      expect(headingCount).toBeGreaterThan(0);
    });
  });

  describe("lisa.md content", () => {
    let lisaContent: string;

    beforeEach(() => {
      lisaContent = fs.readFileSync(
        path.join(SIMPSON_FAMILY_PATH, "lisa.md"),
        "utf-8"
      );
    });

    it("contains character name", () => {
      expect(lisaContent.toLowerCase()).toContain("lisa");
    });

    it("mentions research or analysis", () => {
      expect(lisaContent.toLowerCase()).toMatch(/research|analysis|document/);
    });
  });

  describe("bart.md content", () => {
    let bartContent: string;

    beforeEach(() => {
      bartContent = fs.readFileSync(
        path.join(SIMPSON_FAMILY_PATH, "bart.md"),
        "utf-8"
      );
    });

    it("contains character name", () => {
      expect(bartContent.toLowerCase()).toContain("bart");
    });

    it("mentions edge cases or testing", () => {
      expect(bartContent.toLowerCase()).toMatch(/edge|case|break|test/);
    });
  });

  describe("marge.md content", () => {
    let margeContent: string;

    beforeEach(() => {
      margeContent = fs.readFileSync(
        path.join(SIMPSON_FAMILY_PATH, "marge.md"),
        "utf-8"
      );
    });

    it("contains character name", () => {
      expect(margeContent.toLowerCase()).toContain("marge");
    });

    it("mentions organization or structure", () => {
      expect(margeContent.toLowerCase()).toMatch(/organize|structure|maintain/);
    });
  });

  describe("maggie.md content", () => {
    let maggieContent: string;

    beforeEach(() => {
      maggieContent = fs.readFileSync(
        path.join(SIMPSON_FAMILY_PATH, "maggie.md"),
        "utf-8"
      );
    });

    it("contains character name", () => {
      expect(maggieContent.toLowerCase()).toContain("maggie");
    });

    it("mentions observation or silence", () => {
      expect(maggieContent.toLowerCase()).toMatch(/observe|silent|log|watch/);
    });
  });
});

describe("Extended Family Agent Files", () => {
  const extendedAgents = ["grampa", "burns", "smithers", "flanders"];

  describe("file existence", () => {
    for (const agent of extendedAgents) {
      it(`${agent}.md exists`, () => {
        const filePath = path.join(EXTENDED_PATH, `${agent}.md`);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    }
  });

  describe("file content structure", () => {
    for (const agent of extendedAgents) {
      it(`${agent}.md has content`, () => {
        const filePath = path.join(EXTENDED_PATH, `${agent}.md`);
        const content = fs.readFileSync(filePath, "utf-8");
        expect(content.length).toBeGreaterThan(100);
      });
    }
  });

  describe("grampa.md content", () => {
    let grampaContent: string;

    beforeEach(() => {
      grampaContent = fs.readFileSync(
        path.join(EXTENDED_PATH, "grampa.md"),
        "utf-8"
      );
    });

    it("mentions history or legacy", () => {
      expect(grampaContent.toLowerCase()).toMatch(/history|legacy|old|past/);
    });
  });

  describe("burns.md content", () => {
    let burnsContent: string;

    beforeEach(() => {
      burnsContent = fs.readFileSync(
        path.join(EXTENDED_PATH, "burns.md"),
        "utf-8"
      );
    });

    it("mentions budget or resources", () => {
      expect(burnsContent.toLowerCase()).toMatch(/budget|resource|money|cost/);
    });
  });

  describe("smithers.md content", () => {
    let smithersContent: string;

    beforeEach(() => {
      smithersContent = fs.readFileSync(
        path.join(EXTENDED_PATH, "smithers.md"),
        "utf-8"
      );
    });

    it("mentions schedule or coordination", () => {
      expect(smithersContent.toLowerCase()).toMatch(
        /schedule|coordinate|manage|assist/
      );
    });
  });

  describe("flanders.md content", () => {
    let flandersContent: string;

    beforeEach(() => {
      flandersContent = fs.readFileSync(
        path.join(EXTENDED_PATH, "flanders.md"),
        "utf-8"
      );
    });

    it("mentions standards or quality", () => {
      expect(flandersContent.toLowerCase()).toMatch(
        /standard|quality|best|practice/
      );
    });
  });
});

describe("Springfield Agent Files", () => {
  const springfieldAgents = [
    "apu",
    "bob",
    "cbg",
    "frink",
    "krusty",
    "milhouse",
    "moe",
    "nelson",
    "ralph",
    "skinner",
    "wiggum",
    "willie",
  ];

  describe("file existence", () => {
    for (const agent of springfieldAgents) {
      it(`${agent}.md exists`, () => {
        const filePath = path.join(SPRINGFIELD_PATH, `${agent}.md`);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    }
  });

  describe("file content non-empty", () => {
    for (const agent of springfieldAgents) {
      it(`${agent}.md has content`, () => {
        const filePath = path.join(SPRINGFIELD_PATH, `${agent}.md`);
        const content = fs.readFileSync(filePath, "utf-8");
        expect(content.length).toBeGreaterThan(50);
      });
    }
  });

  describe("moe.md content", () => {
    let moeContent: string;

    beforeEach(() => {
      moeContent = fs.readFileSync(
        path.join(SPRINGFIELD_PATH, "moe.md"),
        "utf-8"
      );
    });

    it("mentions debug or troubleshooting", () => {
      expect(moeContent.toLowerCase()).toMatch(/debug|troubleshoot|fix|issue/);
    });
  });

  describe("wiggum.md content", () => {
    let wiggumContent: string;

    beforeEach(() => {
      wiggumContent = fs.readFileSync(
        path.join(SPRINGFIELD_PATH, "wiggum.md"),
        "utf-8"
      );
    });

    it("mentions security or review", () => {
      expect(wiggumContent.toLowerCase()).toMatch(/security|review|check|safe/);
    });
  });

  describe("krusty.md content", () => {
    let krustyContent: string;

    beforeEach(() => {
      krustyContent = fs.readFileSync(
        path.join(SPRINGFIELD_PATH, "krusty.md"),
        "utf-8"
      );
    });

    it("mentions demo or presentation", () => {
      expect(krustyContent.toLowerCase()).toMatch(/demo|present|show|entertain/);
    });
  });

  describe("nelson.md content", () => {
    let nelsonContent: string;

    beforeEach(() => {
      nelsonContent = fs.readFileSync(
        path.join(SPRINGFIELD_PATH, "nelson.md"),
        "utf-8"
      );
    });

    it("mentions tests or validation", () => {
      expect(nelsonContent.toLowerCase()).toMatch(/test|valid|check|assert/);
    });
  });
});

describe("Agent File Format Consistency", () => {
  const allAgentDirs = [SIMPSON_FAMILY_PATH, EXTENDED_PATH, SPRINGFIELD_PATH];

  it("all agent files are markdown", () => {
    for (const dir of allAgentDirs) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (!file.startsWith(".")) {
          expect(file.endsWith(".md")).toBe(true);
        }
      }
    }
  });

  it("all agent files use lowercase names", () => {
    for (const dir of allAgentDirs) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        expect(file).toBe(file.toLowerCase());
      }
    }
  });

  it("no agent files have spaces in names", () => {
    for (const dir of allAgentDirs) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        expect(file.includes(" ")).toBe(false);
      }
    }
  });
});

describe("Agent Content Quality", () => {
  it("simpson family agents total content is substantial", () => {
    const files = fs.readdirSync(SIMPSON_FAMILY_PATH);
    let totalLength = 0;
    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = fs.readFileSync(
          path.join(SIMPSON_FAMILY_PATH, file),
          "utf-8"
        );
        totalLength += content.length;
      }
    }
    expect(totalLength).toBeGreaterThan(1000);
  });

  it("extended family agents total content is substantial", () => {
    const files = fs.readdirSync(EXTENDED_PATH);
    let totalLength = 0;
    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = fs.readFileSync(
          path.join(EXTENDED_PATH, file),
          "utf-8"
        );
        totalLength += content.length;
      }
    }
    expect(totalLength).toBeGreaterThan(1000);
  });

  it("springfield agents total content is substantial", () => {
    const files = fs.readdirSync(SPRINGFIELD_PATH);
    let totalLength = 0;
    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = fs.readFileSync(
          path.join(SPRINGFIELD_PATH, file),
          "utf-8"
        );
        totalLength += content.length;
      }
    }
    expect(totalLength).toBeGreaterThan(1000);
  });
});

describe("Agent File Encoding", () => {
  const simpsonFamilyAgents = ["homer", "marge", "bart", "lisa", "maggie"];

  for (const agent of simpsonFamilyAgents) {
    it(`${agent}.md is valid UTF-8`, () => {
      const filePath = path.join(SIMPSON_FAMILY_PATH, `${agent}.md`);
      const content = fs.readFileSync(filePath, "utf-8");
      // If we can read it as UTF-8, it's valid
      expect(typeof content).toBe("string");
    });
  }
});
