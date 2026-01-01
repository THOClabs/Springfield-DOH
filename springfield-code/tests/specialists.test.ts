import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { generateArtifact } from "../src/artifacts/generator.js";
import { run as springfieldRun } from "../src/commands/springfield.js";

// Import ALL specialist generators
import { generateDrNickArtifact } from "../src/artifacts/generators/dr-nick.js";
import { generatePattyArtifact } from "../src/artifacts/generators/patty.js";
import { generateTroyArtifact } from "../src/artifacts/generators/troy.js";
import { generateLionelArtifact } from "../src/artifacts/generators/lionel.js";
import { generateHansArtifact } from "../src/artifacts/generators/hans.js";
import { generateHibbertArtifact } from "../src/artifacts/generators/hibbert.js";
import { generateEdnaArtifact } from "../src/artifacts/generators/edna.js";
import { generateOttoArtifact } from "../src/artifacts/generators/otto.js";
import { generateLennyArtifact } from "../src/artifacts/generators/lenny.js";
import { generateKentArtifact } from "../src/artifacts/generators/kent.js";
import { generateSnakeArtifact } from "../src/artifacts/generators/snake.js";
import { generateCookieArtifact } from "../src/artifacts/generators/cookie.js";
import { generateGilArtifact } from "../src/artifacts/generators/gil.js";
import { generateBumblebeeArtifact } from "../src/artifacts/generators/bumblebee.js";
import { generateDuffmanArtifact } from "../src/artifacts/generators/duffman.js";
import { generateFatTonyArtifact } from "../src/artifacts/generators/fat-tony.js";
import { generateSeaCaptainArtifact } from "../src/artifacts/generators/sea-captain.js";
import { generateLovejoyArtifact } from "../src/artifacts/generators/lovejoy.js";
import { generateHelenArtifact } from "../src/artifacts/generators/helen.js";
import { generateAgnesArtifact } from "../src/artifacts/generators/agnes.js";

// Import specialist commands
import drNickCommand from "../src/commands/dr-nick.js";
import snakeCommand from "../src/commands/snake.js";
import agnesCommand from "../src/commands/agnes.js";

describe("specialist characters (v2.1.0)", () => {
  const testDir = path.join(os.tmpdir(), "specialists-test-" + Date.now());

  beforeEach(() => {
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("specialist artifact generators", () => {
    const mockContext = {
      userInput: "Test API health",
      timestamp: new Date("2024-01-15T12:00:00Z"),
    };

    it("generates Dr. Nick artifact with health check theme", () => {
      const result = generateDrNickArtifact(mockContext);

      expect(result).toContain("Dr. Nick's API Health Checks");
      expect(result).toContain("Hi everybody!");
      expect(result).toContain("Test API health");
      expect(result).toContain("Vital Signs Dashboard");
      expect(result).toContain("Checkup Results");
    });

    it("generates Snake artifact with auth security theme", () => {
      const result = generateSnakeArtifact({
        userInput: "Review auth flow",
        timestamp: new Date(),
      });

      expect(result).toContain("Snake's Authentication Audit");
      expect(result).toContain("Bye-bye");
      expect(result).toContain("Auth Flow Analysis");
      expect(result).toContain("Vulnerabilities Found");
    });

    it("generates Agnes artifact with CI/CD theme", () => {
      const result = generateAgnesArtifact({
        userInput: "Build pipeline",
        timestamp: new Date(),
      });

      expect(result).toContain("Agnes Skinner's CI/CD Pipeline");
      expect(result).toContain("SEYMOUR!");
      expect(result).toContain("Quality Gates");
      expect(result).toContain("Pipeline Status");
    });

    it("generates Fat Tony artifact with microservices theme", () => {
      const result = generateFatTonyArtifact({
        userInput: "Service architecture",
        timestamp: new Date(),
      });

      expect(result).toContain("Fat Tony's Microservices");
      expect(result).toContain("Each service handles its own business");
      expect(result).toContain("Service Boundaries");
      expect(result).toContain("Communication Channels");
    });

    it("generates Bumblebee Man artifact with i18n theme", () => {
      const result = generateBumblebeeArtifact({
        userInput: "Translate strings",
        timestamp: new Date(),
      });

      expect(result).toContain("Bumblebee Man's i18n");
      expect(result).toContain("¡Ay, ay, ay!");
      expect(result).toContain("Translation Coverage");
      expect(result).toContain("Hardcoded Strings");
    });

    // Additional specialist generators (v2.2.0 coverage expansion)
    it("generates Patty artifact with compliance theme", () => {
      const result = generatePattyArtifact({
        userInput: "Review compliance",
        timestamp: new Date(),
      });
      expect(result).toContain("Patty's Compliance");
      expect(result).toContain("Gate Status");
    });

    it("generates Troy artifact with onboarding theme", () => {
      const result = generateTroyArtifact({
        userInput: "New developer guide",
        timestamp: new Date(),
      });
      expect(result).toContain("Troy McClure's Onboarding");
      expect(result).toContain("You may remember me");
    });

    it("generates Lionel artifact with legal theme", () => {
      const result = generateLionelArtifact({
        userInput: "License review",
        timestamp: new Date(),
      });
      expect(result).toContain("Lionel Hutz's Legal");
      expect(result).toContain("License Audit");
    });

    it("generates Hans artifact with accessibility theme", () => {
      const result = generateHansArtifact({
        userInput: "a11y audit",
        timestamp: new Date(),
      });
      expect(result).toContain("Hans Moleman's Accessibility");
      expect(result).toContain("WCAG");
    });

    it("generates Hibbert artifact with performance theme", () => {
      const result = generateHibbertArtifact({
        userInput: "Profile app",
        timestamp: new Date(),
      });
      expect(result).toContain("Dr. Hibbert's Performance");
      expect(result).toContain("A-hee-hee-hee");
    });

    it("generates Edna artifact with code review theme", () => {
      const result = generateEdnaArtifact({
        userInput: "Review PR",
        timestamp: new Date(),
      });
      expect(result).toContain("Edna Krabappel's Code Review");
      expect(result).toContain("Ha!");
    });

    it("generates Otto artifact with migration theme", () => {
      const result = generateOttoArtifact({
        userInput: "Upgrade dependencies",
        timestamp: new Date(),
      });
      expect(result).toContain("Otto's Migration");
      expect(result).toContain("Radical");
    });

    it("generates Lenny artifact with A/B testing theme", () => {
      const result = generateLennyArtifact({
        userInput: "Feature experiment",
        timestamp: new Date(),
      });
      expect(result).toContain("Lenny's A/B Testing");
      expect(result).toContain("Experiment");
    });

    it("generates Kent artifact with monitoring theme", () => {
      const result = generateKentArtifact({
        userInput: "System alerts",
        timestamp: new Date(),
      });
      expect(result).toContain("Kent Brockman's Monitoring");
      expect(result).toContain("This just in");
    });

    it("generates Cookie artifact with database theme", () => {
      const result = generateCookieArtifact({
        userInput: "Schema design",
        timestamp: new Date(),
      });
      expect(result).toContain("Cookie Kwan's Database");
      expect(result).toContain("Stay off");
    });

    it("generates Gil artifact with error handling theme", () => {
      const result = generateGilArtifact({
        userInput: "Exception patterns",
        timestamp: new Date(),
      });
      expect(result).toContain("Gil's Error Handling");
      expect(result).toContain("Ol' Gil");
    });

    it("generates Duffman artifact with feature flags theme", () => {
      const result = generateDuffmanArtifact({
        userInput: "Toggle features",
        timestamp: new Date(),
      });
      expect(result).toContain("Duffman's Feature Flag");
      expect(result).toContain("Oh yeah");
    });

    it("generates Sea Captain artifact with K8s theme", () => {
      const result = generateSeaCaptainArtifact({
        userInput: "Container deploy",
        timestamp: new Date(),
      });
      expect(result).toContain("Sea Captain's Container");
      expect(result).toContain("Arr");
    });

    it("generates Lovejoy artifact with events theme", () => {
      const result = generateLovejoyArtifact({
        userInput: "Event architecture",
        timestamp: new Date(),
      });
      expect(result).toContain("Reverend Lovejoy's Event");
      expect(result).toContain("message");
    });

    it("generates Helen artifact with privacy theme", () => {
      const result = generateHelenArtifact({
        userInput: "User data audit",
        timestamp: new Date(),
      });
      expect(result).toContain("Helen Lovejoy's Privacy");
      expect(result).toContain("think of");
    });
  });

  describe("specialist commands", () => {
    it("dr-nick command has correct metadata", () => {
      expect(drNickCommand.name).toBe("dr-nick");
      expect(drNickCommand.description).toContain("API health");
    });

    it("snake command has correct metadata", () => {
      expect(snakeCommand.name).toBe("snake");
      expect(snakeCommand.description).toContain("authentication");
    });

    it("agnes command has correct metadata", () => {
      expect(agnesCommand.name).toBe("agnes");
      expect(agnesCommand.description).toContain("CI/CD");
    });
  });

  describe("specialist artifact generation integration", () => {
    it("generates artifact files for specialist characters", async () => {
      // Initialize Springfield first
      await springfieldRun(["init"], { cwd: testDir });

      // Test a few representative specialists
      const specialists = ["dr-nick", "snake", "agnes", "fat-tony", "bumblebee"];

      for (const specialist of specialists) {
        const result = generateArtifact(specialist, "Test input", testDir);
        expect(result).not.toBeNull();
        if (result) {
          expect(fs.existsSync(result)).toBe(true);
        }
      }
    });
  });
});
