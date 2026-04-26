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
    displayName: fields.text({
      label: "Display Name",
      description: "Category name shown in the CMS.",
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
    title: fields.text({
      label: "Title",
      description: "The piece title.",
      validation: { length: { min: 1, max: 80 } },
    }),
    description: fields.text({
      label: "Description",
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
    video: fields.file({
      label: "Video",
      description:
        "Optional looping video (MP4 or WebM, max ~20 MB). Shown on the detail page and in gallery cards. Muted autoplay — no controls.",
      directory: "public/videos/works",
      publicPath: "/videos/works/",
      validation: { isRequired: false },
    }),
    mediaGallery: fields.array(
      fields.object({
        type: fields.select({
          label: "Type",
          options: [
            { label: "Billede", value: "image" },
            { label: "Video", value: "video" },
          ],
          defaultValue: "image",
        }),
        image: fields.image({
          label: "Billede",
          directory: "public/images/gallery",
          publicPath: "/images/gallery/",
        }),
        imageAlt: fields.text({
          label: "Alt-tekst",
          description: "Beskriv billedet for skærmlæsere.",
          validation: { length: { max: 120 } },
        }),
        video: fields.file({
          label: "Video",
          directory: "public/videos/gallery",
          publicPath: "/videos/gallery/",
          validation: { isRequired: false },
        }),
        title: fields.text({
          label: "Titel",
          description: "Valgfri billedtekst.",
          validation: { length: { max: 80 } },
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          description: "Valgfrie tags (f.eks. 'stentøj', 'process').",
          itemLabel: (p) => p.value || "Tag",
        }),
      }),
      {
        label: "Media galleri",
        description:
          "Valgfrie fotos og videoer med titel og tags.",
        itemLabel: (p) =>
          p.fields.title.value ||
          p.fields.type.value ||
          "Mediaelement",
      },
    ),
  },
});

const about = singleton({
  label: "About",
  path: "content/about",
  format: { data: "yaml" },
  schema: {
    aboutText: fields.text({
      label: "About text",
      description: "Short bio or studio description.",
      multiline: true,
      validation: { length: { max: 1000 } },
    }),
    photo: fields.image({
      label: "Photo",
      description:
        "A photo of the maker or studio. Portrait or square orientation recommended.",
      directory: "public/images/about",
      publicPath: "/images/about/",
    }),
    photoAlt: fields.text({
      label: "Photo alt text",
      description: "Describe the photo for screen readers.",
      validation: { length: { min: 1, max: 120 } },
    }),
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
    heroVideo: fields.file({
      label: "Hero Video",
      description:
        "Optional looping background video for the homepage hero (MP4 recommended, max ~30 MB). Plays muted and autoplays — no controls shown. When set, replaces or overlays the hero image.",
      directory: "public/videos/hero",
      publicPath: "/videos/hero/",
      validation: { isRequired: false },
    }),
    mediaGallery: fields.array(
      fields.object({
        type: fields.select({
          label: "Type",
          options: [
            { label: "Billede", value: "image" },
            { label: "Video", value: "video" },
          ],
          defaultValue: "image",
        }),
        image: fields.image({
          label: "Billede",
          directory: "public/images/gallery",
          publicPath: "/images/gallery/",
        }),
        imageAlt: fields.text({
          label: "Alt-tekst",
          description: "Beskriv billedet for skærmlæsere.",
          validation: { length: { max: 120 } },
        }),
        video: fields.file({
          label: "Video",
          directory: "public/videos/gallery",
          publicPath: "/videos/gallery/",
          validation: { isRequired: false },
        }),
        title: fields.text({
          label: "Titel",
          description: "Valgfri billedtekst.",
          validation: { length: { max: 80 } },
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          description: "Valgfrie tags (f.eks. 'stentøj', 'process').",
          itemLabel: (p) => p.value || "Tag",
        }),
      }),
      {
        label: "Media galleri",
        description:
          "Valgfrie fotos og videoer med titel og tags.",
        itemLabel: (p) =>
          p.fields.title.value ||
          p.fields.type.value ||
          "Mediaelement",
      },
    ),
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
        contactEmail: fields.text({
          label: "Contact email address",
          description:
            "Email address shown on the contact page. Visitors click to email you directly.",
          validation: { length: { min: 1, max: 120 } },
        }),
        instagramHandle: fields.text({
          label: "Instagram handle",
          description:
            "Your Instagram username without the @ sign (e.g. byblendstrup).",
          validation: { length: { max: 60 } },
        }),
      },
    }),
    homepage,
    about,
  },
  ui: {
    brand: { name: "By Blendstrup" },
    navigation: {
      Pieces: ["works"],
      Taxonomy: ["categories"],
      Pages: ["homepage", "settings", "about"],
    },
  },
});
