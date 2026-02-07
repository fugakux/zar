# Satoshi Nakamoto Merch Store

A modern, high-performance React merch store built with Next.js, Tailwind CSS, and Framer Motion.

## Features

- 🎨 Clean landing page with animated logo
- ⚡ Fast and optimized with Next.js 14
- 📱 Fully responsive (mobile & desktop)
- ✨ Smooth animations with Framer Motion
- 🛍️ Product grid layout matching design specs
- 🎯 TypeScript for type safety

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to see the landing page

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── shop/
│       └── page.tsx         # Shop page
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── ProductCard.tsx      # Product card component
│   └── ProductGrid.tsx      # Product grid layout
└── public/                  # Static assets
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Package Manager**: npm

## Customization

### Adding Products

Edit the `products` array in `components/ProductGrid.tsx`:

```typescript
const products = [
  { id: 1, name: 'PRODUCT NAME', price: 450, soldOut: false },
  // Add more products...
]
```

### Replacing Demo Images

Replace the placeholder div in `components/ProductCard.tsx` with actual images using Next.js Image component.

### Styling

All styles use Tailwind CSS. Customize colors and spacing in `tailwind.config.js`.

## Build for Production

```bash
npm run build
npm start
```

## License

All rights reserved.

