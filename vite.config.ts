import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.{test,spec}.{js,ts}"],
          exclude: [
            "src/**/*.svelte.{test,spec}.{js,ts}",
            "src/lib/basic-clock/**/*.{test,spec}.{js,ts}"
          ],
        },
      },
      {
        extends: "./vite.config.ts",
        test: {
          name: "dom",
          environment: "jsdom",
          include: [
            "src/**/*.svelte.{test,spec}.{js,ts}",
            "src/lib/basic-clock/**/*.{test,spec}.{js,ts}"
          ],
          setupFiles: ["./vitest.setup.ts"],
          deps: {
            inline: ["@testing-library/svelte", "svelte"]
          },
          define: {
            'import.meta.env.SSR': 'false'
          }
        },
      },
    ],
  },
});
