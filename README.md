# Mini Applicant Tracking System (ATS)

A modern, full-stack applicant tracking system built with React, TypeScript, and Supabase. Features a drag-and-drop Kanban board for managing candidates and a comprehensive analytics dashboard.

🚀 **Live Preview**: [mini-ats.vercel.app](https://mini-ats.vercel.app)

## 🚀 Features

### Core Features
- **Drag & Drop Kanban Board**: Move candidates through hiring stages (Applied → Interview → Offer → Rejected)
- **Real-time Analytics Dashboard**: Interactive charts showing candidate distribution and hiring metrics
- **Advanced Search & Filtering**: Filter candidates by role, status, and search by name
- **Candidate Management**: Add, edit, and delete candidate profiles with resume links
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Automatic data synchronization across the application

### Design Highlights
- Modern, clean UI with professional styling
- Smooth animations and transitions using Tailwind CSS
- Interactive data visualizations with Recharts
- Mobile-first responsive design
- Accessible components with proper ARIA labels
- Custom color scheme with primary blue theme

## 🛠 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS for styling
- @dnd-kit for drag-and-drop functionality
- Recharts for data visualization
- React Hook Form + Zod for form validation
- Lucide React for icons
- Vite for development and building

**Backend:**
- Supabase (PostgreSQL database)
- Row Level Security (RLS) for data protection
- Real-time subscriptions
- Automatic timestamps and triggers

**Development Tools:**
- ESLint for code quality
- TypeScript for type safety
- PostCSS + Autoprefixer
- Path mapping for clean imports

## 📋 Database Schema

### Candidates Table
```sql
candidates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  role            text NOT NULL,
  experience      integer NOT NULL DEFAULT 0,
  resume_link     text,
  status          text NOT NULL DEFAULT 'applied',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
)
```

**Constraints:**
- `name`: Minimum 2 characters
- `role`: Minimum 2 characters  
- `experience`: 0-50 years
- `resume_link`: Valid URL or empty
- `status`: Must be one of: 'applied', 'interview', 'offer', 'rejected'

**Indexes:**
- `candidates_status_idx`: Fast filtering by status
- `candidates_role_idx`: Analytics queries by role
- `candidates_created_at_idx`: Chronological ordering

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Local Development Setup

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/mini-ats.git
cd mini-ats
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set up Environment Variables**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Supabase credentials
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase Database**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings → API to get your project URL and anon key
   - In your Supabase dashboard, go to SQL Editor
   - Run the migration script from `supabase/migrations/create_candidates_table.sql`

5. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 📱 Usage Guide

### Managing Candidates

1. **Add New Candidate**
   - Click "Add Candidate" button
   - Fill in candidate details (name, role, experience)
   - Optionally add resume link
   - Choose initial status
   - Click "Add Candidate"

2. **Move Candidates**
   - Drag candidate cards between columns
   - Cards automatically update status in database
   - Visual feedback during drag operations

3. **Search & Filter**
   - Use search bar to find candidates by name or role
   - Filter by specific role or status
   - Combine filters for precise results
   - Clear all filters with one click

4. **View Analytics**
   - Switch to Analytics tab
   - View candidate distribution charts
   - Monitor hiring pipeline health
   - Track average experience levels

### Key Metrics Tracked

- **Total Candidates**: Overall candidate count
- **In Progress**: Candidates currently interviewing
- **Offers Made**: Number of offers extended
- **Average Experience**: Mean years of experience
- **Status Distribution**: Visual breakdown by hiring stage
- **Role Distribution**: Candidates by job role

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx       # Main layout with navigation
│   ├── KanbanBoard.tsx  # Main board with drag-and-drop
│   ├── KanbanColumn.tsx # Individual columns
│   ├── CandidateCard.tsx # Individual candidate cards
│   ├── CandidateForm.tsx # Add/edit candidate form
│   ├── SearchFilter.tsx # Search and filter controls
│   └── AnalyticsDashboard.tsx # Charts and metrics
├── hooks/               # Custom React hooks
│   ├── useCandidates.ts # Candidate CRUD operations
│   └── useAnalytics.ts  # Analytics data fetching
├── lib/                 # Utilities and services
│   ├── supabase.ts      # Supabase client setup
│   └── database.ts      # Database service layer
├── types/               # TypeScript type definitions
│   └── candidate.ts     # Candidate and analytics types
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

### Architecture Patterns

- **Custom Hooks**: Encapsulate data fetching and state management
- **Service Layer**: Abstract database operations through `DatabaseService`
- **Component Composition**: Reusable components with clear responsibilities
- **Type Safety**: Comprehensive TypeScript types throughout
- **Error Boundaries**: Graceful error handling and user feedback

## 🔧 API Endpoints (Supabase)

All database operations are handled through Supabase's auto-generated API:

- `GET /candidates` - Fetch all candidates
- `POST /candidates` - Create new candidate
- `PATCH /candidates/:id` - Update candidate status
- `DELETE /candidates/:id` - Delete candidate

## 📊 Performance Optimizations

- **React.useMemo**: Expensive calculations cached
- **Database Indexes**: Fast queries on status and role
- **Optimistic Updates**: Immediate UI feedback
- **Component Lazy Loading**: Reduced initial bundle size
- **Connection Pooling**: Efficient database connections
- **Image Optimization**: Proper image loading and caching

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Input Validation**: Client and server-side validation with Zod
- **SQL Injection Protection**: Parameterized queries via Supabase
- **XSS Prevention**: Sanitized user inputs
- **HTTPS**: Encrypted data transmission
- **Environment Variables**: Secure credential management

## 🧪 Testing Strategy

**Recommended Testing Approach:**
- Unit tests for utility functions and hooks
- Integration tests for component interactions
- E2E tests for critical user flows
- Database migration testing

**Test Scenarios:**
- Candidate CRUD operations
- Drag-and-drop functionality
- Form validation
- Analytics calculations
- Responsive design
- Error handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist` directory.

### Deployment Options

**Recommended Hosting Platforms:**
- **Vercel**: Automatic deployment from Git
- **Netlify**: Drag-and-drop or Git integration
- **Cloudflare Pages**: Fast global CDN
- **GitHub Pages**: Free hosting for public repos

### Environment Variables for Production
Make sure to set these in your hosting platform:
```
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 🔧 Customization

### Styling
- Modify `tailwind.config.js` for custom colors and themes
- Update `src/index.css` for global styles
- Component-specific styles in individual files

### Database Schema
- Add new fields to the candidates table
- Create additional tables for features like companies, interviews
- Update TypeScript types accordingly

### Features to Add
- User authentication and role-based access
- Email notifications for status changes
- Bulk operations for candidates
- Advanced reporting and exports
- Integration with job boards
- Interview scheduling
- Document management
- Team collaboration features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful component and variable names
- Add proper error handling
- Write comprehensive comments
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

**Common Issues:**

1. **Supabase Connection Error**
   - Verify environment variables are set correctly
   - Check Supabase project is active
   - Ensure RLS policies allow access

2. **Drag & Drop Not Working**
   - Check browser compatibility
   - Ensure @dnd-kit is properly installed
   - Verify touch events for mobile

3. **Charts Not Displaying**
   - Verify Recharts installation
   - Check data format matches chart expectations
   - Ensure container has proper dimensions

4. **Build Errors**
   - Run `npm run type-check` to identify TypeScript issues
   - Check for missing dependencies
   - Verify environment variables are set

**Getting Help:**
- Check browser console for errors
- Verify network requests in developer tools
- Review Supabase logs for database issues
- Open an issue on GitHub with detailed error information

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the excellent backend-as-a-service
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Recharts](https://recharts.org) for beautiful, composable charts
- [dnd kit](https://dndkit.com) for accessible drag and drop
- [Lucide](https://lucide.dev) for the beautiful icon set

---

Built with ❤️ using modern web technologies for an exceptional user experience.

**Demo**: [Live Demo](https://your-demo-url.com)  
**Repository**: [GitHub](https://github.com/yourusername/mini-ats)