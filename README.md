# RakthSetu UI

Static, GitHub Pages-ready interface for RakthSetu.

## Files

- `index.html` - app structure and accessible UI
- `styles.css` - responsive design and map styling
- `app.js` - login flow, donor matching, map markers, inventory controls

## How to Upload to GitHub

1. Create a new GitHub repository.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md`.
3. Open repository settings.
4. Go to Pages.
5. Set source to `main` branch and `/root`.
6. Save and open the GitHub Pages URL.

## Notes

- This is a frontend prototype with simulated data.
- The map is self-contained, responsive, and does not need an API key.
- Google login is represented as a UI flow. Connect real Google OAuth from your backend before production.
- All interactive controls are built as keyboard-accessible buttons, form inputs, or links.
