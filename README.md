# Digna’s 70th Crystal Ruby Invitation — Split Page Version

This keeps the **same uploaded crystal-ruby design/color/theme** and only separates the front cover from the official invitation.

## Pages

- `index.html` — front cover page only
- `invitation.html` — official invitation page
- `css/styles.css` — original styling preserved, with only split-page animation additions
- `js/front.js` — front cover particles, tilt, magnetic CTA, and opening transition
- `js/invitation.js` — invitation page loader, scroll reveal, countdown, particles, and panel tilt

## What changed

- The original design color/theme was preserved.
- The front page is now separate.
- The `Open Invitation` CTA is now a real link:
  ```html
  <a href="invitation.html" class="open-invitation">Open Invitation</a>
  ```
- Added an opening animation when clicking the CTA.
- Added a soft official invitation loading/reveal animation on `invitation.html`.
- The program section remains ready for final titles later.

## Run locally

Open `index.html` in a browser, then click **Open Invitation**.
