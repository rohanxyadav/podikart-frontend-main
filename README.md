# PodiKart Frontend

The modern, responsive frontend for the PodiKart e-commerce application.

## Tech Stack

- **Framework:** Vite + React (TypeScript)
- **UI Components:** Shadcn/UI + Radix UI
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod
- **Animations:** Framer Motion

## Getting Started

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Create a `.env` file based on `.env.example`.
   - Set `VITE_API_BASE_URL` to your backend API address.

4. Run the development server:
   ```bash
   npm run dev
   ```

### Features

- Product browsing and filtering
- User authentication (Login/Register)
- Admin dashboard for product management
- Responsive design for mobile and desktop
- Modern UI with dark mode support

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest
