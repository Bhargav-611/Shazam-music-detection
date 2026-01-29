# Nano Banana - Premium Scrollytelling Website

A stunning, production-ready scrollytelling e-commerce website for Nano Banana premium juice brand. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Immersive Scrollytelling**: Canvas-based image sequence animation (120 frames per product)
- **Premium Design**: Gradient themes, glassmorphism, and smooth animations
- **3 Product Flavors**: Cream Mango, Dutch Chocolate, Ruby Pomegranate
- **Responsive**: Fully responsive design with mobile-first approach
- **Performance**: Optimized for static export and deployment
- **Type-Safe**: Built with TypeScript for reliability

## 📁 Project Structure

```
frontend_4/
├── app/
│   ├── layout.tsx         # Root layout with Outfit font
│   ├── page.tsx           # Main page with product switching
│   └── globals.css        # Global styles and scrollbar customization
├── components/
│   ├── Navbar.tsx         # Fixed navbar with gradient branding
│   ├── ProductBottleScroll.tsx    # Canvas scroll animation
│   ├── ProductTextOverlays.tsx    # Scroll-triggered text overlays
│   └── Footer.tsx         # Professional dark footer
├── data/
│   └── products.ts        # Product data structure
├── public/
│   └── images/
│       ├── mango/         # 1.webp to 120.webp
│       ├── chocolate/     # 1.webp to 120.webp
│       └── pomegranate/   # 1.webp to 120.webp
├── next.config.mjs        # Next.js config with static export
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Image Requirements

**IMPORTANT**: You need to add product images to the `public/images` directory:

### Required Structure:
```
public/images/
├── mango/
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── ...
│   └── 120.jpg
├── chocolate/
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── ...
│   └── 120.jpg
└── pomegranate/
    ├── 1.jpg
    ├── 2.jpg
    ├── ...
    └── 120.jpg
```

Each product needs 120 sequential JPG images for the scroll animation.

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🌐 Deployment

This project is configured for static export and can be deployed to:
- **Netlify Drop**: Just drag and drop the `out` folder after build
- **Vercel**: Deploy directly from GitHub
- **Any static hosting**: Upload the `out` folder

## 🎯 Key Technologies

- **Next.js 14**: App Router with static export
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and scroll effects
- **HTML5 Canvas**: Image sequence rendering

## 🎨 Design Features

- Custom gradient branding (Orange → Pink)
- Smooth scroll-triggered animations
- Glassmorphism UI elements
- Custom scrollbar styling
- Premium product photography showcase
- Responsive typography with Outfit font
- Interactive navigation controls

## 📝 License

Private project for Nano Banana brand.

---

Built with ❤️ using Next.js and Framer Motion
