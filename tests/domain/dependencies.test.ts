import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("dependencies", () => {
  it("keeps buffer, which react-native-svg needs on iPhone and Android", () => {
    // Removing it breaks the native bundle (react-native-svg/src/utils/fetchData.ts).
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    expect(pkg.dependencies.buffer).toBeDefined();
  });
});
