# 🎨 ActBrow UI - Dark Theme Redesign

## ✨ New Design Features

### Visual Theme
- **Dark Background** - Deep blue/slate gradient (HSL 222° 47% 11%)
- **Primary Color** - Bright blue (HSL 217° 91% 60%)
- **Glass Morphism** - Frosted glass effects with backdrop blur
- **Gradient Accents** - Smooth color transitions on cards and buttons
- **Glow Effects** - Subtle shadows and text glows
- **Smooth Animations** - Floating, pulsing, and hover effects

### Updated Components

#### Landing Page
- Animated gradient background orbs
- Floating badge with sparkle icon
- Large bold typography with gradient text
- Stats section with animated numbers
- Feature cards with gradient icons
- Architecture diagram with colored layers
- Modern footer with social icons

#### Login Page
- Glass card design
- Floating logo animation
- Gradient primary button
- API key visibility toggle
- Copy to clipboard functionality
- Back to home link

#### Dashboard Layout
- Sidebar with gradient active states
- Glass header with system status
- Mobile-responsive hamburger menu
- Tenant info card with sparkle icon
- Glow effects on active navigation

#### Dashboard Pages
- **Overview**: Gradient stat cards, quick actions, system status
- **Tenants**: Modern table with gradient badges, API key management
- **Assistants**: Clean table layout, model selector, flow toggle
- **Tools**: Type-based filtering, gradient type badges, info cards
- **Flows**: Step builder, assistant selector, trigger phrases

### Color Palette

```css
/* Background */
--background: 222 47% 11%     /* Deep blue */
--card: 222 47% 15%           /* Lighter blue */

/* Primary */
--primary: 217 91% 60%        /* Bright blue */
--primary-foreground: 222 47% 11%

/* Accents */
--secondary: 217 33% 17%      /* Dark slate */
--accent: 217 33% 17%

/* Text */
--foreground: 210 40% 98%     /* White */
--muted-foreground: 215 20% 65% /* Gray */
```

### Gradient Presets

```css
.gradient-primary: linear-gradient(135deg, 
  hsl(217 91% 60%), 
  hsl(224 76% 48%))

.gradient-accent: linear-gradient(135deg, 
  hsl(262 83% 58%), 
  hsl(217 91% 60%))

/* Feature Gradients */
from-blue-500 to-cyan-500      /* Client tools */
from-purple-500 to-pink-500    /* Server builtin */
from-green-500 to-emerald-500  /* HTTP tools */
from-orange-500 to-red-500     /* Stats */
```

### Animations

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
}

.animate-float: 3s ease-in-out infinite
.animate-pulse: Standard pulse
.animate-pulse-glow: 2s ease-in-out infinite
```

## 🚀 Access

**Frontend:** http://localhost:3000

**Default Login:** `ak_default_tenant_key`

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, CTA |
| `/login` | API key authentication |
| `/dashboard` | Overview with stats & quick actions |
| `/dashboard/tenants` | Tenant CRUD operations |
| `/dashboard/assistants` | AI assistant management |
| `/dashboard/flows` | Navigation flow builder |
| `/dashboard/tools` | Tool library browser |

## 🎯 Key Improvements

1. **Consistent Dark Theme** - Professional look across all pages
2. **Gradient Accents** - Visual hierarchy and interest
3. **Glass Effects** - Modern depth and layering
4. **Smooth Animations** - Engaging micro-interactions
5. **Better Typography** - Clearer information hierarchy
6. **Improved Contrast** - Better readability
7. **Responsive Design** - Works on all screen sizes
8. **Status Indicators** - Live system health monitoring

## 💻 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons
- React Query (API state)

## 🎨 Design Inspiration

Based on modern SaaS dashboards with:
- Dark theme for reduced eye strain
- Gradient accents for visual interest
- Glass morphism for depth
- Minimal, clean aesthetics
- Focus on content hierarchy

## 🔧 Customization

Edit `src/app/globals.css` to change:
- Color variables
- Gradient presets
- Animation timings
- Border radius
- Spacing

Edit `tailwind.config.js` to:
- Add custom colors
- Extend animations
- Configure dark mode
- Add custom utilities
