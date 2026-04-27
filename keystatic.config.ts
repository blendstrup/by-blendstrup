import { collection, config, fields, singleton } from "@keystatic/core";

// Storage mode: 'local' for dev, 'github' for production
// Must use NEXT_PUBLIC_ prefix so the client-side Keystatic UI (a "use client"
// component) can read it — non-public env vars are stripped from browser bundles.
const storage =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === "github"
    ? ({
        kind: "github",
        repo: {
          owner: process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER!,
          name: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME!,
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
    video: fields.url({
      label: "Video (YouTube / Vimeo)",
      description:
        "Valgfrit YouTube- eller Vimeo-link til dette stykke. Vis i galleriet og på detaljesiden. Muted autoplay — ingen kontroller.",
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
        video: fields.url({
          label: "Video (YouTube / Vimeo)",
          description: "YouTube- eller Vimeo-link til dette mediaelement.",
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
    heroVideo: fields.url({
      label: "Hero Video (YouTube / Vimeo)",
      description:
        "Valgfrit YouTube- eller Vimeo-link som baggrundsloop i heroen. Muted autoplay. Når sat, erstatter herobilledet.",
    }),
    heroHeadline: fields.text({
      label: "Hero — overskrift",
      description: "Den store overskrift over heltebilledet.",
      defaultValue: "Håndlavet keramik",
      validation: { length: { min: 1, max: 80 } },
    }),
    heroCta: fields.text({
      label: "Hero — knaptekst",
      defaultValue: "Se samlingen",
      validation: { length: { min: 1, max: 60 } },
    }),
    heroScrollIndicator: fields.text({
      label: "Hero — rul-ned tekst",
      defaultValue: "Rul ned",
      validation: { length: { max: 40 } },
    }),
    shopPreviewHeading: fields.text({
      label: "Til salg — sektionsoverskrift",
      defaultValue: "Til salg",
      validation: { length: { min: 1, max: 80 } },
    }),
    shopPreviewViewAll: fields.text({
      label: "Til salg — 'Se alle'-link",
      defaultValue: "Se alle varer",
      validation: { length: { max: 60 } },
    }),
    shopPreviewEmpty: fields.text({
      label: "Til salg — tom-tilstand tekst",
      defaultValue: "Ingen stykker til salg i øjeblikket.",
      validation: { length: { max: 200 } },
    }),
    aboutHeading: fields.text({
      label: "Om-sektion — overskrift",
      defaultValue: "Om Laura",
      validation: { length: { min: 1, max: 80 } },
    }),
    customOrdersHeading: fields.text({
      label: "Specialbestilling — overskrift",
      defaultValue: "Noget særligt i tankerne?",
      validation: { length: { min: 1, max: 80 } },
    }),
    customOrdersBody: fields.text({
      label: "Specialbestilling — brødtekst",
      defaultValue: "Jeg laver specialbestillinger — fortæl mig, hvad du forestiller dig.",
      multiline: true,
      validation: { length: { max: 300 } },
    }),
    customOrdersCta: fields.text({
      label: "Specialbestilling — knaptekst",
      defaultValue: "Start en specialbestilling",
      validation: { length: { max: 60 } },
    }),
    galleryHeading: fields.text({
      label: "Galleri-sektion — overskrift",
      defaultValue: "Galleri",
      validation: { length: { max: 60 } },
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
        video: fields.url({
          label: "Video (YouTube / Vimeo)",
          description: "YouTube- eller Vimeo-link til dette mediaelement.",
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

const gallery = singleton({
  label: "Gallery Page",
  path: "content/gallery",
  format: { data: "yaml" },
  schema: {
    title: fields.text({
      label: "Sideoverskrift",
      defaultValue: "Keramik",
      validation: { length: { min: 1, max: 80 } },
    }),
    emptyAllHeading: fields.text({
      label: "Tom tilstand (alle) — overskrift",
      defaultValue: "Ingen arbejder endnu.",
      validation: { length: { max: 120 } },
    }),
    emptyAllBody: fields.text({
      label: "Tom tilstand (alle) — brødtekst",
      defaultValue: "Kom tilbage snart — nye stykker tilføjes løbende.",
      multiline: true,
      validation: { length: { max: 200 } },
    }),
    emptyForSaleHeading: fields.text({
      label: "Tom tilstand (til salg) — overskrift",
      defaultValue: "Intet til salg lige nu.",
      validation: { length: { max: 120 } },
    }),
    emptyForSaleBody: fields.text({
      label: "Tom tilstand (til salg) — brødtekst",
      defaultValue: "Alle stykker er solgt eller ikke annonceret. Interesseret i noget skræddersyet?",
      multiline: true,
      validation: { length: { max: 200 } },
    }),
    emptyForSaleCta: fields.text({
      label: "Tom tilstand (til salg) — knaptekst",
      defaultValue: "Bestil et skræddersyet stykke",
      validation: { length: { max: 80 } },
    }),
    soldMessage: fields.text({
      label: "Solgt-besked (detalje-side)",
      defaultValue: "Dette stykke er solgt.",
      validation: { length: { max: 120 } },
    }),
    soldCta: fields.text({
      label: "Solgt — knaptekst",
      defaultValue: "Bestil noget tilsvarende",
      validation: { length: { max: 80 } },
    }),
    contactToBuy: fields.text({
      label: "'Kontakt for køb'-knap",
      defaultValue: "Kontakt for køb",
      validation: { length: { max: 60 } },
    }),
    soldBadge: fields.text({
      label: "Solgt-badge — tekst",
      defaultValue: "Solgt",
      validation: { length: { max: 40 } },
    }),
    forSaleBadge: fields.text({
      label: "Til salg-badge — tekst",
      defaultValue: "Til salg",
      validation: { length: { max: 40 } },
    }),
  },
});

const contact = singleton({
  label: "Contact Page",
  path: "content/contact",
  format: { data: "yaml" },
  schema: {
    heading: fields.text({
      label: "Sideoverskrift",
      defaultValue: "Kontakt",
      validation: { length: { min: 1, max: 80 } },
    }),
    infoHeading: fields.text({
      label: "Kontaktoplysninger — overskrift",
      defaultValue: "Kontaktoplysninger",
      validation: { length: { max: 80 } },
    }),
    purchaseHeading: fields.text({
      label: "Køb-sektion — overskrift",
      defaultValue: "Køb et stykke",
      validation: { length: { max: 80 } },
    }),
    purchaseBody: fields.text({
      label: "Køb-sektion — brødtekst",
      defaultValue: "Send mig en besked om det stykke, du er interesseret i.",
      multiline: true,
      validation: { length: { max: 300 } },
    }),
    purchaseCta: fields.text({
      label: "Køb-sektion — knaptekst",
      defaultValue: "Send en forespørgsel",
      validation: { length: { max: 60 } },
    }),
    customOrdersHeading: fields.text({
      label: "Specialbestilling-sektion — overskrift",
      defaultValue: "Specialbestilling",
      validation: { length: { max: 80 } },
    }),
    customOrdersBody: fields.text({
      label: "Specialbestilling-sektion — brødtekst",
      defaultValue: "Har du et stykke i tankerne, der ikke allerede er i butikken?",
      multiline: true,
      validation: { length: { max: 300 } },
    }),
    customOrdersCta: fields.text({
      label: "Specialbestilling-sektion — knaptekst",
      defaultValue: "Start en specialbestilling",
      validation: { length: { max: 60 } },
    }),
    customOrdersFormHeading: fields.text({
      label: "Specialbestillings-formular — overskrift",
      defaultValue: "Specialbestilling",
      validation: { length: { max: 80 } },
    }),
    customOrdersFormSubCopy: fields.text({
      label: "Specialbestillings-formular — underoverskrift",
      defaultValue: "Fortæl mig, hvad du forestiller dig — jeg vender tilbage med et tilbud.",
      multiline: true,
      validation: { length: { max: 300 } },
    }),
    purchaseFormHeading: fields.text({
      label: "Forespørgsels-formular — overskrift",
      defaultValue: "Forespørgsel",
      validation: { length: { max: 80 } },
    }),

    // Purchase inquiry form strings
    purchaseFormRegarding: fields.text({
      label: "Forespørgsel om — etiket",
      defaultValue: "Forespørgsel om",
      validation: { length: { max: 60 } },
    }),
    purchaseFormNameLabel: fields.text({
      label: "Navn-felt — etiket",
      defaultValue: "Navn",
      validation: { length: { max: 40 } },
    }),
    purchaseFormEmailLabel: fields.text({
      label: "E-mail-felt — etiket",
      defaultValue: "E-mail",
      validation: { length: { max: 40 } },
    }),
    purchaseFormMessageLabel: fields.text({
      label: "Besked-felt — etiket",
      defaultValue: "Besked",
      validation: { length: { max: 40 } },
    }),
    purchaseFormMessagePlaceholder: fields.text({
      label: "Besked-felt — pladsholder",
      defaultValue: "Fortæl mig, hvad du tænker...",
      validation: { length: { max: 120 } },
    }),
    purchaseFormSubmit: fields.text({
      label: "Send-knap",
      defaultValue: "Send forespørgsel",
      validation: { length: { max: 60 } },
    }),
    purchaseFormPending: fields.text({
      label: "Send-knap — sender",
      defaultValue: "Sender...",
      validation: { length: { max: 40 } },
    }),
    purchaseFormSuccessHeading: fields.text({
      label: "Tak-overskrift",
      defaultValue: "Tak for din henvendelse",
      validation: { length: { max: 80 } },
    }),
    purchaseFormSuccessBody: fields.text({
      label: "Tak-brødtekst",
      defaultValue: "Jeg vender tilbage til dig hurtigst muligt.",
      multiline: true,
      validation: { length: { max: 200 } },
    }),

    // Custom order form strings
    customOrderFormNameLabel: fields.text({
      label: "Navn-felt — etiket",
      defaultValue: "Navn",
      validation: { length: { max: 40 } },
    }),
    customOrderFormEmailLabel: fields.text({
      label: "E-mail-felt — etiket",
      defaultValue: "E-mail",
      validation: { length: { max: 40 } },
    }),
    customOrderFormDescriptionLabel: fields.text({
      label: "'Hvad ønsker du?'-felt — etiket",
      defaultValue: "Hvad ønsker du?",
      validation: { length: { max: 60 } },
    }),
    customOrderFormDescriptionPlaceholder: fields.text({
      label: "'Hvad ønsker du?'-felt — pladsholder",
      defaultValue: "Størrelse, farve, tekstur, brug — jo mere, jo bedre.",
      validation: { length: { max: 120 } },
    }),
    customOrderFormQuantityLabel: fields.text({
      label: "Antal-felt — etiket",
      defaultValue: "Antal",
      validation: { length: { max: 40 } },
    }),
    customOrderFormQuantityPlaceholder: fields.text({
      label: "Antal-felt — pladsholder",
      defaultValue: "F.eks. 2",
      validation: { length: { max: 60 } },
    }),
    customOrderFormBudgetLabel: fields.text({
      label: "Budgetramme-felt — etiket",
      defaultValue: "Budgetramme",
      validation: { length: { max: 60 } },
    }),
    customOrderFormBudgetPlaceholder: fields.text({
      label: "Budgetramme-felt — pladsholder",
      defaultValue: "F.eks. 500–1000 kr.",
      validation: { length: { max: 80 } },
    }),
    customOrderFormTimelineLabel: fields.text({
      label: "Tidslinje-felt — etiket",
      defaultValue: "Ønsket tidslinje",
      validation: { length: { max: 60 } },
    }),
    customOrderFormTimelinePlaceholder: fields.text({
      label: "Tidslinje-felt — pladsholder",
      defaultValue: "F.eks. inden jul",
      validation: { length: { max: 80 } },
    }),
    customOrderFormSubmit: fields.text({
      label: "Send-knap",
      defaultValue: "Send bestilling",
      validation: { length: { max: 60 } },
    }),
    customOrderFormPending: fields.text({
      label: "Send-knap — sender",
      defaultValue: "Sender...",
      validation: { length: { max: 40 } },
    }),
    customOrderFormSuccessHeading: fields.text({
      label: "Tak-overskrift",
      defaultValue: "Tak for din bestilling",
      validation: { length: { max: 80 } },
    }),
    customOrderFormSuccessBody: fields.text({
      label: "Tak-brødtekst",
      defaultValue: "Jeg gennemgår dit ønske og kontakter dig inden for få dage.",
      multiline: true,
      validation: { length: { max: 200 } },
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
    gallery,
    contact,
  },
  ui: {
    brand: { name: "By Blendstrup" },
    navigation: {
      Pieces: ["works"],
      Taxonomy: ["categories"],
      Pages: ["homepage", "settings", "about", "gallery", "contact"],
    },
  },
});
