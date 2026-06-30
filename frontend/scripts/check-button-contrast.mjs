import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendDir = join(__dirname, "..");
const globalsCss = readFileSync(join(frontendDir, "app/globals.css"), "utf8");
const landingPage = readFileSync(join(frontendDir, "app/page.tsx"), "utf8");

const MIN_NORMAL_TEXT_CONTRAST = 4.5;

function extractBlock(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = globalsCss.match(
    new RegExp(`${escapedSelector}\\s*\\{([^}]+)\\}`),
  );

  if (!match) {
    throw new Error(`Missing CSS block for ${selector}`);
  }

  return match[1];
}

function extractVariables(block) {
  return Object.fromEntries(
    [...block.matchAll(/--([a-z0-9-]+):\s*([^;]+);/gi)].map((match) => [
      `--${match[1]}`,
      match[2].trim(),
    ]),
  );
}

function hexToLinearRgb(hex) {
  const value = hex.trim();

  if (!/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`Expected a 6-digit hex color, got ${hex}`);
  }

  return [1, 3, 5]
    .map((start) => Number.parseInt(value.slice(start, start + 2), 16) / 255)
    .map((channel) =>
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
}

function luminance(hex) {
  const [red, green, blue] = hexToLinearRgb(hex);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const foregroundLum = luminance(foreground);
  const backgroundLum = luminance(background);
  const lighter = Math.max(foregroundLum, backgroundLum);
  const darker = Math.min(foregroundLum, backgroundLum);

  return (lighter + 0.05) / (darker + 0.05);
}

function assertThemeContrast(name, variables) {
  const bg = variables["--button-primary-bg"];
  const fg = variables["--button-primary-fg"];

  if (!bg || !fg) {
    throw new Error(`${name} is missing primary button bg/fg tokens`);
  }

  const ratio = contrastRatio(fg, bg);

  if (ratio < MIN_NORMAL_TEXT_CONTRAST) {
    throw new Error(
      `${name} primary button contrast is ${ratio.toFixed(2)}:1; expected at least ${MIN_NORMAL_TEXT_CONTRAST}:1`,
    );
  }
}

const lightTheme = extractVariables(extractBlock(":root"));
const darkTheme = extractVariables(extractBlock('[data-theme="dark"]'));

assertThemeContrast("Light theme", lightTheme);
assertThemeContrast("Dark theme", darkTheme);

if (!landingPage.includes("var(--button-primary-bg)")) {
  throw new Error("Landing page primary CTAs must use --button-primary-bg");
}

if (!landingPage.includes("var(--button-primary-fg)")) {
  throw new Error("Landing page primary CTAs must use --button-primary-fg");
}

if (landingPage.includes('background: "var(--accent-strong)"')) {
  throw new Error("Landing page primary CTAs still reuse --accent-strong");
}

console.log("Primary button contrast tokens pass WCAG AA checks.");
