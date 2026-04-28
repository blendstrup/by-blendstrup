import { describe, expect, it } from "vitest"

// Import keystatic config — this validates TypeScript compilation of the schema
import keystaticConfig from "../../keystatic.config"

type KeystaticConfigShape = {
	collections?: Record<string, unknown>
	singletons?: Record<string, unknown>
	ui?: Record<string, unknown>
}

const cfg = keystaticConfig as unknown as KeystaticConfigShape

describe("Keystatic schema", () => {
	describe("collections", () => {
		it("exports a works collection", () => {
			expect(cfg.collections).toBeDefined()
			expect(cfg.collections).toHaveProperty("works")
		})

		it("exports a categories collection", () => {
			expect(cfg.collections).toHaveProperty("categories")
		})
	})

	describe("singletons", () => {
		it("exports the settings singleton (existing)", () => {
			expect(cfg.singletons).toHaveProperty("settings")
		})

		it("exports a homepage singleton", () => {
			expect(cfg.singletons).toHaveProperty("homepage")
		})
	})

	describe("ui.navigation", () => {
		it("has navigation groupings", () => {
			expect(cfg.ui).toBeDefined()
			expect(cfg.ui?.navigation).toBeDefined()
		})

		it("includes 'about' in Pages navigation (Phase 4)", () => {
			const nav = cfg.ui?.navigation as Record<string, string[]> | undefined
			expect(nav?.Pages).toContain("about")
		})
	})

	describe("Phase 4 additions", () => {
		it("exports the about singleton (Phase 4)", () => {
			expect(cfg.singletons).toHaveProperty("about")
		})

		it("settings singleton has contactEmail field (Phase 4)", () => {
			const settings = cfg.singletons?.settings as
				| { schema?: Record<string, unknown> }
				| undefined
			expect(settings?.schema).toHaveProperty("contactEmail")
		})

		it("settings singleton has instagramHandle field (Phase 4)", () => {
			const settings = cfg.singletons?.settings as
				| { schema?: Record<string, unknown> }
				| undefined
			expect(settings?.schema).toHaveProperty("instagramHandle")
		})
	})

	describe("Phase quick-260428-vrt — file-based video fields", () => {
		it("works.video field exists", () => {
			const works = cfg.collections?.works as
				| { schema?: Record<string, unknown> }
				| undefined
			expect(works?.schema).toHaveProperty("video")
		})

		it("works.videoPoster field exists", () => {
			const works = cfg.collections?.works as
				| { schema?: Record<string, unknown> }
				| undefined
			expect(works?.schema).toHaveProperty("videoPoster")
		})

		it("homepage.heroVideo field exists", () => {
			const homepage = cfg.singletons?.homepage as
				| { schema?: Record<string, unknown> }
				| undefined
			expect(homepage?.schema).toHaveProperty("heroVideo")
		})

		it("homepage.heroVideoPoster field exists", () => {
			const homepage = cfg.singletons?.homepage as
				| { schema?: Record<string, unknown> }
				| undefined
			expect(homepage?.schema).toHaveProperty("heroVideoPoster")
		})

		it("works.video is no longer a url-shaped field", () => {
			const works = cfg.collections?.works as
				| { schema?: Record<string, unknown> }
				| undefined
			const videoField = works?.schema?.video
			// fields.file serializes without "url" anywhere; fields.url contains
			// "url" as a discriminator. This catches a regression to fields.url.
			expect(JSON.stringify(videoField)).not.toContain("url")
		})

		it("homepage.heroVideo is no longer a url-shaped field", () => {
			const homepage = cfg.singletons?.homepage as
				| { schema?: Record<string, unknown> }
				| undefined
			const heroVideoField = homepage?.schema?.heroVideo
			expect(JSON.stringify(heroVideoField)).not.toContain("url")
		})
	})
})
