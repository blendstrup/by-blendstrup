import { config, collection, singleton, fields } from "@keystatic/core"

// Storage mode: 'local' for dev, 'github' for production
// Driven by KEYSTATIC_STORAGE_KIND env var (defaults to 'local')
const githubRepoOwner = process.env.GITHUB_REPO_OWNER
const githubRepoName = process.env.GITHUB_REPO_NAME

if (process.env.KEYSTATIC_STORAGE_KIND === "github") {
  if (!githubRepoOwner || !githubRepoName) {
    throw new Error(
      "GITHUB_REPO_OWNER and GITHUB_REPO_NAME must be set when KEYSTATIC_STORAGE_KIND=github",
    )
  }
}

const storage =
  process.env.KEYSTATIC_STORAGE_KIND === "github"
    ? ({
        kind: "github",
        repo: {
          owner: githubRepoOwner!,
          name: githubRepoName!,
        },
      } as const)
    : ({ kind: "local" } as const)

// ---------------------------------------------------------------------------
// Categories collection — bilingual taxonomy managed by the owner via CMS
// ---------------------------------------------------------------------------

const categories = collection({
  label: "Categories",
  slugField: "name",
  path: "content/categories/*",
  format: { data: "yaml" },
  schema: {
    name: fields.slug({
      name: {
        label: "Category name (for URL)",
        description:
          'A short identifier used in the URL. Will be auto-generated — for example, "bowls" or "mugs".',
      },
    }),
    nameDa: fields.text({
      label: "Name in Danish",
      description:
        'The category label shown to Danish visitors. Example: "Skåle".',
      validation: { isRequired: true, length: { min: 1, max: 60 } },
    }),
    nameEn: fields.text({
      label: "Name in English",
      description:
        'The category label shown to English visitors. Example: "Bowls".',
      validation: { isRequired: true, length: { min: 1, max: 60 } },
    }),
  },
})

// ---------------------------------------------------------------------------
// Works collection — each ceramic piece with bilingual content, images, and sale status
// ---------------------------------------------------------------------------

const works = collection({
  label: "Ceramic Pieces",
  slugField: "slug",
  path: "content/works/*/",
  format: { data: "yaml" },
  columns: ["saleStatus", "published"],
  schema: {
    slug: fields.slug({
      name: {
        label: "Piece name",
        description:
          'The name of this ceramic piece. Used to generate the URL — keep it short and descriptive. Example: "glazed-bowl-01".',
      },
    }),
    published: fields.checkbox({
      label: "Published",
      description:
        "Tick to make this piece visible on the public site. Unticked pieces are drafts — only you can see them here in the CMS.",
      defaultValue: false,
    }),
    titleDa: fields.text({
      label: "Title (Danish)",
      description:
        'The piece name shown to Danish visitors. Example: "Leirskål med glasur".',
      validation: { isRequired: true, length: { min: 1, max: 120 } },
    }),
    titleEn: fields.text({
      label: "Title (English)",
      description:
        'The piece name shown to English visitors. Example: "Glazed clay bowl".',
      validation: { isRequired: true, length: { min: 1, max: 120 } },
    }),
    descriptionDa: fields.text({
      label: "Description (Danish)",
      description:
        "A short description for Danish visitors — material, technique, size, or story. A few sentences is plenty.",
      multiline: true,
    }),
    descriptionEn: fields.text({
      label: "Description (English)",
      description: "The same description in English.",
      multiline: true,
    }),
    saleStatus: fields.select({
      label: "Sale status",
      description:
        'Choose "Available for purchase" to show this piece in the shop. "Sold" keeps it in the gallery with a Sold label. "Not for sale" shows it as a portfolio piece only.',
      options: [
        { label: "Available for purchase", value: "available" },
        { label: "Sold", value: "sold" },
        { label: "Not for sale", value: "not-listed" },
      ],
      defaultValue: "not-listed",
    }),
    price: fields.text({
      label: "Price",
      description:
        'Write the price exactly as you want it to appear — for example "1.200 kr.", "From 800 kr.", or "Price on request". Only shown when the piece is available for purchase.',
    }),
    leadTime: fields.text({
      label: "Lead time / availability note",
      description:
        'Optional note about availability or delivery time. Example: "Ready to ship" or "Allow 2–3 weeks". Only shown when the piece is available for purchase.',
    }),
    categories: fields.multiRelationship({
      label: "Categories",
      description:
        "Choose one or more categories for this piece. Categories help visitors filter the gallery. You can manage categories under the Taxonomy menu.",
      collection: "categories",
    }),
    images: fields.array(
      fields.object({
        image: fields.image({
          label: "Image",
          description:
            "Upload a photo of this piece (JPEG recommended, max 20 MB). The first image in the list is used as the main photo in the gallery and on detail pages.",
          directory: "public/images/works",
          publicPath: "/images/works/",
          validation: { isRequired: true },
        }),
        alt: fields.text({
          label: "Image description (alt text)",
          description:
            'Describe what is shown in the photo — used by screen readers and search engines. Example: "Handthrown clay bowl with ash glaze, front view". Start with the piece name for consistency.',
          validation: { isRequired: true, length: { min: 1, max: 200 } },
        }),
      }),
      {
        label: "Images",
        description:
          "Add 1–8 photos. Drag to reorder — the first photo becomes the main image shown in the gallery.",
        itemLabel: (props) => props.fields.alt.value || "Photo",
        validation: { length: { min: 1, max: 8 } },
      },
    ),
  },
})

// ---------------------------------------------------------------------------
// Homepage singleton — owner curates hero and shop preview pieces
// ---------------------------------------------------------------------------

const homepage = singleton({
  label: "Homepage",
  path: "content/homepage",
  format: { data: "yaml" },
  schema: {
    heroWorks: fields.multiRelationship({
      label: "Hero pieces",
      description:
        "Choose 1–3 pieces to feature in the large hero section at the top of the homepage. The first piece gets the most visual prominence.",
      collection: "works",
      validation: { length: { min: 0, max: 3 } },
    }),
    shopPreviewWorks: fields.multiRelationship({
      label: "Shop preview pieces",
      description:
        'Choose up to 6 pieces to show in the "Available now" section on the homepage. Only pieces marked "Available for purchase" will show a price.',
      collection: "works",
      validation: { length: { min: 0, max: 6 } },
    }),
  },
})

// ---------------------------------------------------------------------------
// Keystatic config — combines all collections and singletons
// ---------------------------------------------------------------------------

export default config({
  storage,
  ui: {
    brand: { name: "By Blendstrup" },
    navigation: {
      Pieces: ["works"],
      Taxonomy: ["categories"],
      Pages: ["homepage", "settings"],
    },
  },
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
})
