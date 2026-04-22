# By Blendstrup — CMS Guide

This guide covers everything you need to manage your website content. No developer help is needed for any of these tasks.

## How to Access the CMS

1. Go to [keystatic.cloud](https://keystatic.cloud) in your browser.
2. Sign in with your Keystatic Cloud account (the email and password you set up during site launch).
3. Once signed in, click the By Blendstrup project.
4. The admin panel has two sections on the left: **Pieces** (your ceramic works) and **Pages** (homepage and site settings).

---

## Task 1 — Adding a New Ceramic Piece

Use this whenever you have a new piece to show on the website.

1. In the left sidebar, click **Pieces**.
2. Click the **Add item** button in the top right.
3. Fill in the fields:
   - **Title:** The name of the piece (e.g., "Stoneware bowl, autumn glaze").
   - **Images:** Click **Add image** and upload a photo from your computer. The first photo is used as the main image. Fill in the **Alt text** field with a short description — e.g., "Stoneware bowl with matte grey glaze". This helps search engines find your work.
   - **Description:** A short text about the piece — material, size, what makes it special. This appears on the piece's detail page.
   - **Categories:** Choose the most fitting category from the list.
   - **Sale Status:** Choose **For Sale** (available to buy), **Portfolio Only** (not for sale), or **Sold**.
   - **Price:** Enter the price as text, e.g., "1.200 kr.". Leave blank if the piece is not for sale.
   - **Lead Time:** A note about delivery, e.g., "Ships within 1 week". Leave blank if the piece is not for sale.
   - **Published:** Check this box when you are ready for the piece to appear on the website. Leave it unchecked while you are still preparing.
4. Click **Save**. The website rebuilds automatically and the piece will appear within a few minutes.

---

## Task 2 — Marking a Piece as Sold

Use this when a piece has been purchased.

1. In the left sidebar, click **Pieces**.
2. Find the piece in the list and click on it.
3. Change **Sale Status** from **For Sale** to **Sold**.
4. Click **Save**. The piece will now show a "Sold" label on the website, and the "Contact to buy" button will be removed.

---

## Task 3 — Curating the Homepage

Use this to control which pieces appear in the hero image and the shop preview section on the homepage.

1. In the left sidebar, click **Homepage** (under Pages).
2. **Hero Pieces:** Select which piece or pieces (up to 3) appear as the large images at the top of the homepage.
3. **Shop Preview Pieces:** Select which pieces (up to 6) appear in the "For sale" preview section. Only pieces marked as For Sale will show a "Contact to buy" button.
4. Click **Save**. The homepage will update within a few minutes.

---

## Task 4 — Editing Site Settings

Use this to update your contact email address or Instagram handle.

1. In the left sidebar, click **Site Settings** (under Pages).
2. **Contact email address:** Update the email address that purchase inquiries and custom order inquiries are sent to.
3. **Instagram handle:** Update your Instagram username without the @ symbol (e.g., byblendstrup).
4. Click **Save**.

---

## Tips

- **Changes take a few minutes:** Every save creates a commit on GitHub and Vercel rebuilds the site. This usually takes 1–3 minutes.
- **Drafts are safe:** A piece with **Published** unchecked will never appear on the website — you can prepare pieces in advance without them going live.
- **Image sizes:** Upload photos at their original resolution. The website automatically optimises them for fast loading.
- **Need help?** Contact your developer.
