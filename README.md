# NoiseWindow

A Progressive Web App for displaying real-time availability status with animated visual indicators. Designed for shared living spaces to communicate working hours and availability without disruption.

## Overview

NoiseWindow solves the problem of coordinating quiet hours in shared spaces. Roommates can see at a glance when someone is working, sleeping, or unavailable, helping maintain a respectful living environment.

The app features dynamic status animations, automatic schedule management, and works completely offline once installed.

## Features

### Core Functionality
- **Real-time Status Display** - Animated Lottie animations that reflect current availability
- **Automatic Schedule Detection** - Status updates based on time and configured working hours
- **Sleep Schedule** - Automatically shows sleeping status from midnight to 8:30 AM
- **Schedule Management** - Admin panel for configuring daily availability windows
- **Multi-day Preview** - View today's schedule and upcoming days at a glance

### User Experience
- **Bilingual Support** - Full English and Portuguese (Portugal) translations
- **Progressive Web App** - Installable on mobile and desktop devices
- **Offline Support** - Works without internet connection via service worker caching
- **Responsive Design** - Optimized for mobile and desktop viewing
- **Custom Notifications** - Toast messages for user feedback

### Admin Features
- **PIN-Protected Access** - Secure admin panel with PIN authentication
- **Flexible Scheduling** - Set custom start/end times for each day
- **Status Overrides** - Mark days as "Off" or "TBA" (To Be Announced)
- **Notification Controls** - Toggle work notifications on/off

## Tech Stack

- **Framework**: Next.js 16 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **Animations**: Lottie (via @lottiefiles/dotlottie-react)
- **PWA**: next-pwa for service worker and offline support
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Hooks with localStorage persistence
- **Database**: Supabase (migrations included, optional integration)

## Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd noisewindow
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with webpack (PWA disabled by default)
- `npm run dev:pwa` - Start development server with PWA features enabled
- `npm run dev:turbo` - Start development server with Turbopack (faster, no PWA)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
noisewindow/
├── public/
│   ├── animations/          # Lottie animation files
│   │   ├── working.lottie
│   │   ├── sleeping.lottie
│   │   └── off.lottie
│   └── favicon/             # App icons and PWA manifest
├── src/
│   ├── components/           # React components
│   │   ├── AdminPage.tsx     # Admin panel for schedule management
│   │   ├── CharacterPlaceholder.tsx  # Animated status display
│   │   ├── ErrorBoundary.tsx # Error handling component
│   │   ├── LanguageToggle.tsx # Language switcher
│   │   ├── PinPrompt.tsx     # PIN authentication dialog
│   │   ├── SchedulePreview.tsx # Schedule display component
│   │   ├── StatusBadge.tsx   # Status indicator badge
│   │   └── ui/               # Reusable UI components
│   ├── contexts/
│   │   └── LanguageContext.tsx  # Language state management
│   ├── hooks/
│   │   └── useToast.ts       # Toast notification hook
│   ├── lib/
│   │   ├── dayTranslations.ts # Day name translation utilities
│   │   ├── translations.ts    # Translation definitions
│   │   ├── utils.ts          # Utility functions
│   │   └── validation.ts     # Input validation helpers
│   ├── pages/                # Next.js pages
│   │   ├── _app.tsx          # App wrapper with providers
│   │   └── index.tsx         # Home page
│   └── styles/
│       └── globals.css       # Global styles and Tailwind config
├── supabase/
│   ├── migrations/           # Database migration files
│   └── config.toml           # Supabase configuration
├── next.config.ts            # Next.js configuration
└── package.json
```

## PWA Features

NoiseWindow is a fully functional Progressive Web App:

- **Installable** - Add to home screen on mobile and desktop devices
- **Offline Support** - Works without internet connection after initial load
- **Service Worker** - Automatic caching of resources for offline access
- **App-like Experience** - Standalone display mode without browser UI

### Testing PWA Features

1. Build for production:
   ```bash
   npm run build
   npm start
   ```

2. Install the app:
   - **Chrome/Edge**: Click the install icon in the address bar
   - **Mobile**: Use "Add to Home Screen" option from browser menu

3. Test offline mode:
   - Open DevTools → Network tab
   - Check "Offline" checkbox
   - Refresh the page - the app should continue working

## Development

### Adding New Status Animations

1. Add your `.lottie` animation file to `public/animations/`
2. Update the `animationMap` in `src/components/CharacterPlaceholder.tsx`
3. Add the corresponding status type to the component props

### Customizing Styles

Global styles and Tailwind configuration are in `src/styles/globals.css`. The design system uses CSS custom properties for theming, making it easy to adjust colors and spacing.

### Language Support

Translations are managed in `src/lib/translations.ts`. To add a new language:

1. Add a new language key to the `translations` object
2. Implement all required translation strings
3. Update the `Language` type in the same file

### Database Integration (Optional)

Supabase migrations are included in `supabase/migrations/`. To use Supabase:

1. Set up a Supabase project
2. Link your project: `supabase link --project-ref your-project-ref`
3. Push migrations: `supabase db push`
4. Add environment variables (see `.env.example`)

## Building for Production

```bash
npm run build
npm start
```

The production build includes:
- Optimized and minified bundles
- Service worker for offline support
- Static asset optimization
- TypeScript type checking

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect Next.js settings
4. Deploy

The app will automatically build and deploy. PWA features are enabled in production builds.

### Environment Variables

For local development, create a `.env.local` file:

```env
# Admin PIN for accessing the admin panel (4-digit PIN)
NEXT_PUBLIC_ADMIN_PIN=4334

# Supabase Configuration (Optional)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important Notes:**
- `NEXT_PUBLIC_ADMIN_PIN` is required. If not set, it defaults to `4334`.
- All `NEXT_PUBLIC_*` variables are exposed to the browser, so don't use sensitive values.
- For Vercel deployment, add these variables in the Vercel project settings.

## Browser Support

- Chrome/Edge (latest versions)
- Firefox (latest versions)
- Safari (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Error Handling

The app includes comprehensive error handling:
- React Error Boundary for component-level errors
- Input validation for schedule data
- Safe JSON parsing with fallbacks
- User-friendly error messages

## License

[Add your license here]

## Contributing

Contributions are welcome. Please feel free to submit issues or pull requests.
