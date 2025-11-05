import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          name: "browser",
          browser: {
            provider: playwright(),
            enabled: true,
            headless: true,
            instances: [
              { browser: 'chromium' },
            ],
          },
          include: ["src/**/*.svelte.{test,spec}.{js,ts}", "src/**/*.{test,spec}.{js,ts}"],
          setupFiles: ['./src/vitest-setup-client.ts'],
        }
      },
    ],
  },
});
