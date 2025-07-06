-- Turso Database Schema for Resume Maker
-- Run this in your Turso database

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  is_verified INTEGER DEFAULT 0, -- SQLite uses INTEGER for boolean
  verification_token TEXT,
  reset_token TEXT,
  reset_token_expires TEXT, -- ISO string format
  last_login TEXT, -- ISO string format
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Profiles table for user profiles
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  last_login TEXT, -- ISO string format
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  template_id TEXT NOT NULL,
  content TEXT NOT NULL, -- JSON string
  ats_score INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'professional' CHECK (category IN ('professional', 'creative', 'modern', 'classic')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  html_content TEXT NOT NULL,
  css_styles TEXT,
  preview_image TEXT,
  usage_count INTEGER DEFAULT 0,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_status ON templates(status);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON templates(created_by);

-- Create triggers for updated_at
CREATE TRIGGER IF NOT EXISTS update_users_updated_at
  AFTER UPDATE ON users
  BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_profiles_updated_at
  AFTER UPDATE ON profiles
  BEGIN
    UPDATE profiles SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_resumes_updated_at
  AFTER UPDATE ON resumes
  BEGIN
    UPDATE resumes SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_templates_updated_at
  AFTER UPDATE ON templates
  BEGIN
    UPDATE templates SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO users (id, email, full_name, password_hash, role, is_verified, status)
VALUES (
  'admin-001',
  'admin@resumemaker.com',
  'Admin User',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
  'admin',
  1,
  'active'
);

-- Insert default templates
INSERT OR IGNORE INTO templates (id, name, description, category, status, html_content, css_styles, created_by) VALUES
('template-1', 'Professional Template', 'Clean and professional resume template', 'professional', 'active',
'<div class="resume-container">
  <header class="resume-header">
    <h1 class="name">{{fullName}}</h1>
    <p class="title">{{title}}</p>
    <div class="contact-info">
      <p>{{email}} | {{phone}} | {{location}}</p>
    </div>
  </header>
  <section class="summary">
    <h2>Summary</h2>
    <p>{{summary}}</p>
  </section>
  <section class="experience">
    <h2>Experience</h2>
    {{#each experience}}
    <div class="job">
      <h3>{{title}} at {{company}}</h3>
      <p class="date">{{startDate}} - {{endDate}}</p>
      <ul>
        {{#each achievements}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
    {{/each}}
  </section>
  <section class="education">
    <h2>Education</h2>
    {{#each education}}
    <div class="degree">
      <h3>{{degree}}</h3>
      <p>{{school}} - {{year}}</p>
    </div>
    {{/each}}
  </section>
  <section class="skills">
    <h2>Skills</h2>
    <p>{{skills}}</p>
  </section>
</div>',
'body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
.resume-container { max-width: 800px; margin: 0 auto; }
.resume-header { text-align: center; margin-bottom: 30px; }
.name { font-size: 2.5em; margin: 0; color: #2c3e50; }
.title { font-size: 1.2em; color: #7f8c8d; margin: 10px 0; }
.contact-info { margin: 10px 0; }
section { margin-bottom: 25px; }
h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
.job { margin-bottom: 20px; }
.job h3 { color: #34495e; margin: 5px 0; }
.date { color: #7f8c8d; font-style: italic; }
ul { margin: 10px 0; }
li { margin: 5px 0; }',
'admin-001'),

('template-2', 'Modern Template', 'Modern and creative resume template', 'modern', 'active',
'<div class="modern-resume">
  <div class="sidebar">
    <div class="profile">
      <h1>{{fullName}}</h1>
      <h2>{{title}}</h2>
    </div>
    <div class="contact">
      <h3>Contact</h3>
      <p>📧 {{email}}</p>
      <p>📱 {{phone}}</p>
      <p>📍 {{location}}</p>
    </div>
    <div class="skills">
      <h3>Skills</h3>
      <p>{{skills}}</p>
    </div>
  </div>
  <div class="main-content">
    <section class="summary">
      <h3>Summary</h3>
      <p>{{summary}}</p>
    </section>
    <section class="experience">
      <h3>Experience</h3>
      {{#each experience}}
      <div class="job">
        <div class="job-header">
          <h4>{{title}}</h4>
          <span class="company">{{company}}</span>
        </div>
        <div class="job-date">{{startDate}} - {{endDate}}</div>
        <ul>
          {{#each achievements}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
      </div>
      {{/each}}
    </section>
    <section class="education">
      <h3>Education</h3>
      {{#each education}}
      <div class="degree">
        <h4>{{degree}}</h4>
        <p>{{school}} - {{year}}</p>
      </div>
      {{/each}}
    </section>
  </div>
</div>',
'.modern-resume { display: flex; min-height: 100vh; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
.sidebar { width: 300px; background: #2c3e50; color: white; padding: 30px; }
.profile h1 { font-size: 2em; margin: 0 0 10px 0; }
.profile h2 { font-size: 1.2em; color: #3498db; margin: 0; }
.contact, .skills { margin-top: 30px; }
.contact h3, .skills h3 { color: #3498db; border-bottom: 1px solid #3498db; padding-bottom: 5px; }
.main-content { flex: 1; padding: 30px; background: white; }
section { margin-bottom: 30px; }
h3 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
.job { margin-bottom: 25px; }
.job-header { display: flex; justify-content: space-between; align-items: center; }
.job-header h4 { margin: 0; color: #2c3e50; }
.company { color: #3498db; font-weight: bold; }
.job-date { color: #7f8c8d; font-size: 0.9em; margin: 5px 0; }
ul { margin: 10px 0; }
li { margin: 5px 0; }',
'admin-001'),

('template-3', 'Creative Template', 'Creative and artistic resume template', 'creative', 'active',
'<div class="creative-resume">
  <header class="creative-header">
    <div class="name-section">
      <h1>{{fullName}}</h1>
      <div class="title-line"></div>
      <h2>{{title}}</h2>
    </div>
    <div class="contact-grid">
      <div class="contact-item">
        <span class="icon">📧</span>
        <span>{{email}}</span>
      </div>
      <div class="contact-item">
        <span class="icon">📱</span>
        <span>{{phone}}</span>
      </div>
      <div class="contact-item">
        <span class="icon">📍</span>
        <span>{{location}}</span>
      </div>
    </div>
  </header>
  <div class="content-grid">
    <section class="summary-section">
      <h3>About Me</h3>
      <p>{{summary}}</p>
    </section>
    <section class="experience-section">
      <h3>Experience</h3>
      {{#each experience}}
      <div class="experience-card">
        <div class="card-header">
          <h4>{{title}}</h4>
          <span class="company">{{company}}</span>
        </div>
        <div class="card-date">{{startDate}} - {{endDate}}</div>
        <div class="card-content">
          {{#each achievements}}
          <div class="achievement">• {{this}}</div>
          {{/each}}
        </div>
      </div>
      {{/each}}
    </section>
    <section class="education-section">
      <h3>Education</h3>
      {{#each education}}
      <div class="education-card">
        <h4>{{degree}}</h4>
        <p>{{school}} - {{year}}</p>
      </div>
      {{/each}}
    </section>
    <section class="skills-section">
      <h3>Skills</h3>
      <div class="skills-grid">
        {{#each skillsArray}}
        <span class="skill-tag">{{this}}</span>
        {{/each}}
      </div>
    </section>
  </div>
</div>',
'body { margin: 0; font-family: "Poppins", sans-serif; background: #f8f9fa; }
.creative-resume { max-width: 1000px; margin: 0 auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
.creative-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
.name-section h1 { font-size: 3em; margin: 0; font-weight: 300; }
.title-line { width: 100px; height: 3px; background: #ffd700; margin: 20px auto; }
.name-section h2 { font-size: 1.3em; margin: 0; font-weight: 300; }
.contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px; }
.contact-item { display: flex; align-items: center; gap: 10px; }
.icon { font-size: 1.2em; }
.content-grid { padding: 40px; display: grid; gap: 30px; }
section h3 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px; }
.experience-card { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.card-header h4 { margin: 0; color: #333; }
.company { color: #667eea; font-weight: bold; }
.card-date { color: #666; font-size: 0.9em; margin-bottom: 15px; }
.achievement { margin: 8px 0; }
.education-card { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.education-card h4 { margin: 0 0 5px 0; color: #333; }
.skills-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.skill-tag { background: #667eea; color: white; padding: 8px 15px; border-radius: 20px; font-size: 0.9em; }',
'admin-001');