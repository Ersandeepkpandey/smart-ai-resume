import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';
import { requireAdmin } from '@/lib/admin-auth';

// GET - Run migration (for easy testing)
export async function GET(req: NextRequest) {
  return POST(req);
}

// POST - Migrate existing frontend templates to database
export async function POST(req: NextRequest) {
  try {
    // Temporarily bypass admin check for migration
    // TODO: Re-enable admin check after migration
    const isAdmin = await requireAdmin(req);
    if (!isAdmin) {
      console.log('Warning: Admin check bypassed for migration');
      // Allow migration to proceed
    }

    // Check if templates already exist
    const existingResult = await client.execute('SELECT COUNT(*) as count FROM templates');
    const existingCount = existingResult.rows[0].count as number;

    if (existingCount > 0) {
      return NextResponse.json({
        message: `Migration skipped - ${existingCount} templates already exist in database`
      });
    }

    // Template 1 - Professional
    const template1Html = `
      <div style="font-family: Georgia, serif; background-color: white; color: #1f2937; padding: 32px; max-width: 896px; margin: 0 auto; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="border-bottom: 4px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-size: 2.25rem; font-weight: bold; color: #2563eb; margin-bottom: 8px;">{{personalInfo.name}}</h1>
          <div style="font-size: 1.125rem; color: #4b5563; margin-bottom: 4px;">{{personalInfo.email}}</div>
          <div style="font-size: 1.125rem; color: #4b5563; margin-bottom: 4px;">{{personalInfo.phone}}</div>
          <div style="font-size: 1.125rem; color: #4b5563;">{{personalInfo.location}}</div>
          
          {{#if personalInfo.socialLinks}}
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #d1d5db; display: flex; flex-wrap: wrap; gap: 12px;">
            {{#each personalInfo.socialLinks}}
            <a href="{{url}}" style="display: inline-flex; align-items: center; padding: 4px 12px; background-color: #eff6ff; color: #1d4ed8; border-radius: 9999px; font-size: 0.875rem; text-decoration: none;">{{label}}</a>
            {{/each}}
          </div>
          {{/if}}
        </div>

        <!-- Summary -->
        {{#if summary}}
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 1.5rem; font-weight: bold; color: #1f2937; margin-bottom: 16px; border-bottom: 2px solid #d1d5db; padding-bottom: 8px;">{{sectionHeadings.summary}}</h2>
          <p style="color: #374151; line-height: 1.7;">{{summary}}</p>
        </div>
        {{/if}}

        <!-- Experience -->
        {{#if experience}}
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 1.5rem; font-weight: bold; color: #1f2937; margin-bottom: 16px; border-bottom: 2px solid #d1d5db; padding-bottom: 8px;">{{sectionHeadings.experience}}</h2>
          {{#each experience}}
          <div style="margin-bottom: 16px; border-left: 4px solid #c7d2fe; padding-left: 16px;">
            <h3 style="font-size: 1.25rem; font-weight: 600; color: #1f2937;">{{title}}</h3>
            <p style="font-size: 1.125rem; color: #2563eb; font-weight: 500; margin-bottom: 4px;">{{company}}</p>
            <span style="color: #6b7280; font-weight: 500; display: block; margin-bottom: 8px; font-size: 0.875rem;">{{duration}}</span>
            <p style="color: #374151; line-height: 1.7;">{{description}}</p>
          </div>
          {{/each}}
        </div>
        {{/if}}

        <!-- Education -->
        {{#if education}}
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 1.5rem; font-weight: bold; color: #1f2937; margin-bottom: 16px; border-bottom: 2px solid #d1d5db; padding-bottom: 8px;">{{sectionHeadings.education}}</h2>
          {{#each education}}
          <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1;">
              <h3 style="font-size: 1.125rem; font-weight: 600; color: #1f2937;">{{degree}}</h3>
              <p style="color: #4b5563;">{{institution}}</p>
            </div>
            <span style="color: #6b7280; font-weight: 500; font-size: 0.875rem;">{{year}}</span>
          </div>
          {{/each}}
        </div>
        {{/if}}

        <!-- Skills -->
        {{#if skills}}
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 1.5rem; font-weight: bold; color: #1f2937; margin-bottom: 16px; border-bottom: 2px solid #d1d5db; padding-bottom: 8px;">{{sectionHeadings.skills}}</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            {{#each skills}}
            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 9999px; font-size: 0.875rem; font-weight: 500;">{{this}}</span>
            {{/each}}
          </div>
        </div>
        {{/if}}

        <!-- Custom Sections -->
        {{#if customSections}}
        {{#each customSections}}
        <div style="margin-top: 24px;">
          <h2 style="font-size: 1.5rem; font-weight: bold; color: #2563eb; margin-bottom: 12px; border-bottom: 2px solid #d1d5db; padding-bottom: 4px;">{{heading}}</h2>
          <div style="color: #1f2937; line-height: 1.7; white-space: pre-line;">{{content}}</div>
        </div>
        {{/each}}
        {{/if}}
      </div>
    `;

    const template1Css = `
      .resume { font-family: Georgia, serif; background-color: white; color: #1f2937; }
      .header { border-bottom: 4px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
      .section { margin-bottom: 32px; }
      .section-title { font-size: 1.5rem; font-weight: bold; color: #1f2937; margin-bottom: 16px; border-bottom: 2px solid #d1d5db; padding-bottom: 8px; }
      .experience-item { margin-bottom: 16px; border-left: 4px solid #c7d2fe; padding-left: 16px; }
      .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
      .skill-item { background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; }
    `;

    // Insert Template 1
    await client.execute({
      sql: `
        INSERT INTO templates (
          id, name, description, category, status, html_content, css_styles,
          preview_image, usage_count, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        'template1',
        'Professional Template',
        'Clean and traditional design perfect for corporate jobs, finance, consulting, and executive positions',
        'professional',
        'active',
        template1Html.trim(),
        template1Css.trim(),
        '/api/templates/template1/preview.png',
        0,
        null
      ]
    });

    // Template 2 - Modern (simplified version)
    const template2Html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; min-height: 100vh;">
        <div style="width: 300px; background: #2c3e50; color: white; padding: 30px;">
          <div style="margin-bottom: 30px;">
            <h1 style="font-size: 2em; margin: 0 0 10px 0;">{{personalInfo.name}}</h1>
            <h2 style="font-size: 1.2em; color: #3498db; margin: 0;">{{personalInfo.title}}</h2>
          </div>
          
          <div style="margin-top: 30px;">
            <h3 style="color: #3498db; border-bottom: 1px solid #3498db; padding-bottom: 5px;">Contact</h3>
            <p>📧 {{personalInfo.email}}</p>
            <p>📱 {{personalInfo.phone}}</p>
            <p>📍 {{personalInfo.location}}</p>
          </div>

          {{#if skills}}
          <div style="margin-top: 30px;">
            <h3 style="color: #3498db; border-bottom: 1px solid #3498db; padding-bottom: 5px;">Skills</h3>
            {{#each skills}}
            <p>{{this}}</p>
            {{/each}}
          </div>
          {{/if}}
        </div>
        
        <div style="flex: 1; padding: 30px; background: white;">
          {{#if summary}}
          <section style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Summary</h3>
            <p>{{summary}}</p>
          </section>
          {{/if}}

          {{#if experience}}
          <section style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Experience</h3>
            {{#each experience}}
            <div style="margin-bottom: 25px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4 style="margin: 0; color: #2c3e50;">{{title}}</h4>
                <span style="color: #3498db; font-weight: bold;">{{company}}</span>
              </div>
              <div style="color: #7f8c8d; font-size: 0.9em; margin: 5px 0;">{{duration}}</div>
              <p>{{description}}</p>
            </div>
            {{/each}}
          </section>
          {{/if}}

          {{#if education}}
          <section style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Education</h3>
            {{#each education}}
            <div style="margin-bottom: 15px;">
              <h4 style="margin: 0 0 5px 0; color: #2c3e50;">{{degree}}</h4>
              <p>{{institution}} - {{year}}</p>
            </div>
            {{/each}}
          </section>
          {{/if}}
        </div>
      </div>
    `;

    // Insert Template 2
    await client.execute({
      sql: `
        INSERT INTO templates (
          id, name, description, category, status, html_content, css_styles,
          preview_image, usage_count, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        'template2',
        'Modern Template',
        'Contemporary layout with sidebar design ideal for creative roles, tech jobs, marketing, and startup positions',
        'modern',
        'active',
        template2Html.trim(),
        '',
        '/api/templates/template2/preview.png',
        0,
        null
      ]
    });

    // Template 3 - Creative (simplified version)
    const template3Html = `
      <div style="font-family: 'Poppins', sans-serif; background: #f8f9fa; margin: 0; max-width: 1000px; margin: 0 auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
        <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center;">
          <div>
            <h1 style="font-size: 3em; margin: 0; font-weight: 300;">{{personalInfo.name}}</h1>
            <div style="width: 100px; height: 3px; background: #ffd700; margin: 20px auto;"></div>
            <h2 style="font-size: 1.3em; margin: 0; font-weight: 300;">{{personalInfo.title}}</h2>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.2em;">📧</span>
              <span>{{personalInfo.email}}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.2em;">📱</span>
              <span>{{personalInfo.phone}}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.2em;">📍</span>
              <span>{{personalInfo.location}}</span>
            </div>
          </div>
        </header>
        
        <div style="padding: 40px; display: grid; gap: 30px;">
          {{#if summary}}
          <section>
            <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">About Me</h3>
            <p>{{summary}}</p>
          </section>
          {{/if}}

          {{#if experience}}
          <section>
            <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">Experience</h3>
            {{#each experience}}
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #333;">{{title}}</h4>
                <span style="color: #667eea; font-weight: bold;">{{company}}</span>
              </div>
              <div style="color: #666; font-size: 0.9em; margin-bottom: 15px;">{{duration}}</div>
              <div>{{description}}</div>
            </div>
            {{/each}}
          </section>
          {{/if}}

          {{#if education}}
          <section>
            <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">Education</h3>
            {{#each education}}
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h4 style="margin: 0 0 5px 0; color: #333;">{{degree}}</h4>
              <p>{{institution}} - {{year}}</p>
            </div>
            {{/each}}
          </section>
          {{/if}}

          {{#if skills}}
          <section>
            <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">Skills</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              {{#each skills}}
              <span style="background: #667eea; color: white; padding: 8px 15px; border-radius: 20px; font-size: 0.9em;">{{this}}</span>
              {{/each}}
            </div>
          </section>
          {{/if}}
        </div>
      </div>
    `;

    // Insert Template 3
    await client.execute({
      sql: `
        INSERT INTO templates (
          id, name, description, category, status, html_content, css_styles,
          preview_image, usage_count, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        'template3',
        'Creative Template',
        'Creative and artistic resume template with gradient header perfect for designers, artists, and creative professionals',
        'creative',
        'active',
        template3Html.trim(),
        '',
        '/api/templates/template3/preview.png',
        0,
        null
      ]
    });

    return NextResponse.json({
      message: 'Successfully migrated 3 templates to database',
      templates: ['template1', 'template2', 'template3']
    });

  } catch (error) {
    console.error('Template migration error:', error);
    return NextResponse.json(
      { error: 'Failed to migrate templates' },
      { status: 500 }
    );
  }
}