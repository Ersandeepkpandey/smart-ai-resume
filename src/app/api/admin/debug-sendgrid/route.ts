import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testEmail = searchParams.get('email')
    const sendTest = searchParams.get('send') === 'true'

    // Check configuration
    const config = {
      hasApiKey: !!process.env.SENDGRID_API_KEY,
      hasFromEmail: !!process.env.SENDGRID_FROM_EMAIL,
      apiKeyLength: process.env.SENDGRID_API_KEY?.length || 0,
      fromEmail: process.env.SENDGRID_FROM_EMAIL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    }

    let testResult = null
    let error = null

    if (sendTest && testEmail && process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      try {
        // Configure SendGrid
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const msg = {
          to: testEmail,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: 'SendGrid Test Email - Resume Maker',
          text: 'This is a test email from Resume Maker to verify SendGrid is working correctly.',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>SendGrid Test</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <div style="text-align: center; margin-bottom: 30px;">
                                            <h1 style="color: #333; margin: 0; font-size: 28px;">SendGrid Test Email</h1>
                                            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Resume Maker Email System</p>
                                        </div>

                                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                                            <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                                                🎉 <strong>Success!</strong> SendGrid is working correctly.
                                            </p>

                                            <p style="margin: 15px 0 0 0; color: #666; font-size: 14px;">
                                                This test email confirms that your SendGrid configuration is properly set up and emails can be sent successfully.
                                            </p>

                                            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                                <strong>Configuration Details:</strong><br>
                                                • API Key: ${config.hasApiKey ? '✅ Configured' : '❌ Missing'}<br>
                                                • From Email: ${config.fromEmail || '❌ Missing'}<br>
                                                • App URL: ${config.appUrl || '❌ Missing'}
                                            </div>
                                        </div>

                                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                                            <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                                                Sent at: ${new Date().toLocaleString()}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
          `
        }

        const result = await sgMail.send(msg)
        testResult = {
          success: true,
          messageId: result[0]?.headers['x-message-id'],
          statusCode: result[0]?.statusCode,
          timestamp: new Date().toISOString()
        }
      } catch (sendError: any) {
        error = {
          message: sendError.message,
          status: sendError.response?.status,
          body: sendError.response?.body,
          code: sendError.code
        }
      }
    }

    return NextResponse.json({
      config,
      testResult,
      error,
      instructions: {
        setup: 'Add SENDGRID_API_KEY and SENDGRID_FROM_EMAIL to your .env.local file',
        test: `Add ?email=your-email@example.com&send=true to test email sending`,
        verify: 'Make sure your sender email is verified in SendGrid dashboard'
      }
    })

  } catch (error) {
    console.error('SendGrid debug error:', error)
    return NextResponse.json(
      { error: 'Debug endpoint error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}