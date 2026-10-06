# LIV LVX · Interior Castle

Static site for livlvx.com, Liv Radha's kundalini yoga practice. Plain HTML, CSS and JavaScript with no build step.

## Pages

| URL | File |
| --- | --- |
| `/` | `index.html` |
| `/membership` | `membership.html` |
| `/courses` | `courses.html` |
| `/services` | `services.html` |
| `/about` | `about.html` |
| `/contact` | `contact.html` |

All pages share `castle.css` (styles) and `castle.js` (gold dust animation, course windows, mobile menu, forms). `vercel.json` turns on clean URLs, so `/membership` serves `membership.html`.

## Deploy on Vercel

1. In Vercel, choose **Add New → Project** and import this GitHub repo.
2. Framework preset: **Other**. Leave the build command and output directory empty.
3. Deploy. Add the custom domain under **Settings → Domains** when ready.

## Still to do before launch

- Replace the portrait placeholder on the home and About pages with a photo of Liv.
- Connect the newsletter and contact forms to a real service (for example Formspree, Kit or Mailchimp). They currently show a preview message and send nothing.
- Membership, course and booking buttons link to the current Squarespace pages at livlvx.com, where checkout and member logins live. Update them if those move.

## Local preview

Any static server works, for example:

```bash
npx serve .
```
