import { collection, config, fields, singleton } from "@keystatic/core";

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

const categories = collection({
  label: "Categories",
  slugField: "name",
  path: "content/categories/*",
  format: { data: "yaml" },
  schema: {
    name: fields.slug({
      name: {
        label: "Internal Name",
        description:
          "Unique identifier for this category (used in URLs and relationships).",
      },
    }),
    nameDa: fields.text({
      label: "Name (Danish)",
      description: "Category name shown to Danish visitors.",
      validation: { length: { min: 1, max: 60 } },
    }),
    nameEn: fields.text({
      label: "Name (English)",
      description: "Category name shown to English visitors.",
      validation: { length: { min: 1, max: 60 } },
    }),
  },
});

const works = collection({
  label: "Works",
  slugField: "slug",
  path: "content/works/*/",
  format: { data: "yaml" },
  schema: {
    slug: fields.slug({
      name: {
        label: "URL Slug",
        description: "Unique identifier for this piece used in URLs.",
      },
    }),
    published: fields.checkbox({
      label: "Published",
      description: "When checked, this piece appears on the public website.",
      defaultValue: false,
    }),
    titleDa: fields.text({
      label: "Title (Danish)",
      description: "The piece title shown to Danish visitors.",
      validation: { length: { min: 1, max: 80 } },
    }),
    titleEn: fields.text({
      label: "Title (English)",
      description: "The piece title shown to English visitors.",
      validation: { length: { min: 1, max: 80 } },
    }),
    descriptionDa: fields.text({
      label: "Description (Danish)",
      description: "Description shown to Danish visitors.",
      multiline: true,
    }),
    descriptionEn: fields.text({
      label: "Description (English)",
      description: "Description shown to English visitors.",
      multiline: true,
    }),
    saleStatus: fields.select({
      label: "Sale Status",
      description: "Is this piece available, sold, or only in the portfolio?",
      options: [
        { label: "For Sale", value: "available" },
        { label: "Sold", value: "sold" },
        { label: "Portfolio Only", value: "notListed" },
      ],
      defaultValue: "notListed",
    }),
    price: fields.text({
      label: "Price",
      description: "e.g. 1.200 kr. Leave blank if not for sale.",
      validation: { length: { max: 40 } },
    }),
    leadTime: fields.text({
      label: "Lead Time",
      description: "e.g. 'Ships in 1–2 weeks'. Leave blank if not for sale.",
      validation: { length: { max: 80 } },
    }),
    categories: fields.multiRelationship({
      label: "Categories",
      description: "Which category does this piece belong to?",
      collection: "categories",
    }),
    images: fields.array(
      fields.object({
        image: fields.image({
          label: "Image",
          directory: "public/images/works",
          publicPath: "/images/works/",
        }),
        alt: fields.text({
          label: "Alt text",
          description:
            "Describe the image for screen readers and search engines.",
          validation: { length: { min: 1 } },
        }),
      }),
      {
        label: "Images",
        description: "Add one or more photos of this piece.",
        itemLabel: (props) => props.fields.alt.value || "Image",
      },
    ),
  },
});

const homepage = singleton({
  label: "Homepage",
  path: "content/homepage",
  format: { data: "yaml" },
  schema: {
    heroWorks: fields.multiRelationship({
      label: "Hero Pieces",
      description: "Up to 3 pieces shown in the homepage hero.",
      collection: "works",
      validation: { length: { max: 3 } },
    }),
    shopPreviewWorks: fields.multiRelationship({
      label: "Shop Preview Pieces",
      description:
        "Up to 6 for-sale pieces shown in the homepage shop preview.",
      collection: "works",
      validation: { length: { max: 6 } },
    }),
  },
});

export default config({
  storage,
  collections: {
    works,
    categories,
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
    homepage,
  },
  ui: {
    brand: { name: "By Blendstrup" },
    navigation: {
      Pieces: ["works"],
      Taxonomy: ["categories"],
      Pages: ["homepage", "settings"],
    },
  },
});
