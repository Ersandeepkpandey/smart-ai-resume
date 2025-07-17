# Rezume - Professional Resume Builder

A modern, ATS-friendly resume builder built with Next.js, React, Tailwind CSS, and Supabase. Create professional resumes with real-time ATS scoring and multiple template options.

## ✨ Features

- **Professional Templates**: Multiple ATS-friendly resume templates
- **Real-time ATS Scoring**: Get instant feedback on your resume's compatibility
- **Live Preview**: See changes as you type
- **PDF Export**: Download your resume as a professional PDF
- **Authentication**: Secure sign-up/sign-in with Google and LinkedIn OAuth
- **Responsive Design**: Works perfectly on all devices
- **SEO Optimized**: Optimized for search engines

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Storage)
- **PDF Generation**: jsPDF, html2canvas
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Create the following tables in your Supabase database:

   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT NOT NULL,
     full_name TEXT,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create resumes table
   CREATE TABLE resumes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     title TEXT NOT NULL,
     template_id TEXT NOT NULL,
     content JSONB NOT NULL,
     ats_score INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can view own resumes" ON resumes
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own resumes" ON resumes
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own resumes" ON resumes
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own resumes" ON resumes
     FOR DELETE USING (auth.uid() = user_id);
   ```

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. **Set up OAuth providers (optional)**
   - **Google OAuth**: Configure in Supabase Dashboard > Authentication > Providers
   - **LinkedIn OAuth**: Configure in Supabase Dashboard > Authentication > Providers

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
resume-maker/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── resume/           # Resume creation/editing
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── templates/        # Resume templates
│   │   ├── ATSScore.tsx      # ATS scoring component
│   │   ├── ResumeForm.tsx    # Resume form component
│   │   └── TemplateSelector.tsx
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication context
│   └── lib/                  # Utility functions
│       ├── supabase.ts       # Supabase client
│       ├── ats-scorer.ts     # ATS scoring logic
│       └── pdf-export.ts     # PDF export utilities
├── public/                   # Static assets
└── package.json
```

## 🎨 Templates

The app includes three professional resume templates:

1. **Professional Classic**: Clean and traditional design with blue accents
2. **Modern Sidebar**: Contemporary layout with sidebar for skills
3. **Minimalist**: Simple and elegant centered design

## 🔍 ATS Scoring

The ATS (Applicant Tracking System) scoring algorithm evaluates:

- **Keyword matching** (40 points)
- **Content completeness** (30 points)
- **Format and structure** (20 points)
- **Action verbs and achievements** (10 points)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact support at rezumecare@gmail.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Lucide](https://lucide.dev/) for the beautiful icons

---

Made with ❤️ by the Rezume team
