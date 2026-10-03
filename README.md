# Common Goods Storefront

A responsive storefront concept for considered homewares and everyday objects. Built as a frontend portfolio project to demonstrate component-driven UI, interactive product discovery, and shopping-cart state.

Developer profile: [j06352811-cell](https://github.com/j06352811-cell)

## Features

- Responsive layouts for mobile, tablet, and desktop
- Product catalog with category filters, text search, and price sorting
- Product detail modal with descriptions and add-to-bag action
- Shopping bag drawer with editable quantities, subtotal, and free-shipping progress
- Cart persistence with `localStorage`
- Demo checkout form with browser validation and an order confirmation state
- Persistent wishlist with a saved-items filter and an email signup interaction
- Accessible labels, keyboard focus styles, and reduced-motion support

## Built With

- React 18
- Vite
- Plain CSS with responsive breakpoints and design tokens
- Lucide icons

## Run Locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To verify a production build:

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  data/products.js   Product catalog and categories
  App.jsx            Storefront UI and interaction state
  main.jsx           React entry point
  styles.css         Responsive design system and component styles
```

## Deploy

Push this repository to GitHub, then import it into Vercel or Netlify. Use `npm run build` as the build command and `dist` as the output directory. The project is a frontend demo: checkout does not collect payment or send an order to a server.

## What I Practiced

I practiced breaking a storefront into reusable React components, deriving filtered and sorted product lists from state, updating cart quantities immutably, and persisting cart data in the browser. I also worked through responsive layouts, accessible controls, empty states, form validation, and the boundary between a frontend checkout demo and a real payment flow.

## Interview Walkthrough

- `ProductCard` receives product data and interaction handlers rather than owning catalog state.
- `visibleProducts` is derived from the selected category, search query, and sort choice with `useMemo`.
- Cart changes use functional state updates so rapid quantity changes stay consistent.
- `localStorage` restores the bag between visits; the checkout intentionally remains a demo and would need a trusted payment provider and backend for production.
