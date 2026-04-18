import { config, singleton, fields } from "@keystatic/core";

// Storage mode: 'local' for dev, 'github' for production
// Driven by KEYSTATIC_STORAGE_KIND env var (defaults to 'local')
const storage =
  process.env.KEYSTATIC_STORAGE_KIND === "github"
    ? ({
        kind: "github",
        repo: {
          owner: process.env.GITHUB_REPO_OWNER!,
          name: process.env.GITHUB_REPO_NAME!,
        },
      } as const)
    : ({ kind: "local" } as const);

export default config({
  storage,
  ui: {
    brand: { name: "By Blendstrup" },
  },
  singletons: {
    settings: singleton({
      label: "Site Settings",
      path: "content/settings",
      format: { data: "yaml" },
      schema: {
        siteTitle: fields.text({
          label: "Site Title",
          description:
            "The name that appears in browser tabs and search results.",
          defaultValue: "By Blendstrup",
          validation: { length: { min: 1, max: 60 } },
        }),
      },
    }),
  },
});
