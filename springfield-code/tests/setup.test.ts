import { describe, it, expect } from "vitest";
import { PLUGIN_INFO } from "../src/index.js";
import { ALL_CHARACTERS, REQUIRED_FILES } from "../src/constants.js";

describe("Springfield Code Plugin", () => {
  it("has correct plugin info", () => {
    expect(PLUGIN_INFO.name).toBe("springfield-code");
    expect(PLUGIN_INFO.version).toBe("3.0.3");
  });

  it("has all required characters defined", () => {
    expect(ALL_CHARACTERS.length).toBeGreaterThan(20);
    expect(ALL_CHARACTERS).toContain("homer");
    expect(ALL_CHARACTERS).toContain("lisa");
    expect(ALL_CHARACTERS).toContain("ralph");
  });

  it("has required files defined", () => {
    expect(REQUIRED_FILES).toContain("project.md");
    expect(REQUIRED_FILES).toContain("task.md");
    expect(REQUIRED_FILES).toContain("completion.md");
    expect(REQUIRED_FILES).toContain("iterations.md");
  });
});
