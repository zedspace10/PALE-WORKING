import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function read(file: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("honest scientific presentation", () => {
  it("provides a visible and accessible non-scale disclosure", () => {
    const disclosure = read("components/IllustrationDisclosure.tsx");
    expect(disclosure).toContain("accessibilityLabel");
    expect(disclosure).toContain("Illustrative, not to scale");
    expect(disclosure).not.toContain("borderWidth");
  });

  it("labels every Universe visual level and explains artistic cosmic-web links", () => {
    const universe = read("app/universe.tsx");
    expect(universe).toContain("zoomLevel === 1");
    expect(universe).toContain("zoomLevel === 2");
    expect(universe).toContain("connecting lines are decorative");
    expect(universe).not.toContain("SourceDisclosure");
    expect(universe).not.toMatch(/two trillion|approximately 2 trillion/i);
    expect(universe).toMatch(/hundreds of billions of galaxies, perhaps more/i);
  });

  it("labels Shift's animated scale without a source disclosure panel", () => {
    const shift = read("app/(tabs)/shift.tsx");
    expect(shift).toContain("IllustrationDisclosure");
    expect(shift).not.toContain("SourceDisclosure");
    expect(shift).toMatch(/not one physical scale/i);
  });

  it("visibly separates daily poetic reflection from factual copy", () => {
    expect(read("components/ReflectionCard.tsx")).toContain(
      "TODAY · POETIC REFLECTION",
    );
    expect(read("app/(tabs)/deeptime.tsx")).toContain("POETIC REFLECTION");
  });

  it("contains none of the remaining audited categorical UI claims", () => {
    const content = [
      read("app/(tabs)/index.tsx"),
      read("app/(tabs)/shift.tsx"),
      read("app/(tabs)/deeptime.tsx"),
      read("app/universe.tsx"),
      read("app/tonight-sky.tsx"),
      read("constants/cosmicData.ts"),
      read("constants/cosmicTimeMachine.ts"),
      read("constants/observatory.ts"),
      read("constants/notificationDomain.ts"),
    ].join("\n");
    expect(content).not.toMatch(
      /what's above you right now|YOUR STAR IS VISIBLE TONIGHT|Full Moon · Bright sky tonight|New Moon · Darkest sky|always point toward the North Star|every other star in the northern sky|everything we can ever know|Every human who left our world|Universe age at this moment/i,
    );
    expect(content).not.toMatch(
      /all of it began in this single moment|piece of Earth that broke off|every cell of your body|individual stars will never collide|remnants of moons torn apart by gravity|will vanish in a few hundred million years|probability of this exact moment|powered all life on Earth/i,
    );
    expect(content).not.toContain("body: `Astronomical darkness is beginning.");
    expect(content).toMatch(
      /PALE estimates astronomical darkness is beginning/i,
    );
    expect(content).toMatch(/not a physical or astrological\s+link/i);
  });
});
