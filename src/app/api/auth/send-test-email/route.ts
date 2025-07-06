import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check SendGrid configuration
    const apiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.SENDGRID_FROM_EMAIL

    if (!apiKey) {
      return NextResponse.json(
        { error: 'SendGrid API key not configured' },
        { status: 400 }
      )
    }

    if (!fromEmail) {
      return NextResponse.json(
        { error: 'SendGrid from email not configured' },
        { status: 400 }
      )
    }

    // Configure SendGrid
    sgMail.setApiKey(apiKey)

    // Send static test email
    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Test Email from Resume Maker',
      text: 'This is a test email to verify SendGrid configuration. If you received this email, your email setup is working properly!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <div style="text-align: center; margin-bottom: 30px;">
                                        <h1 style="color: #333; margin: 0; font-size: 28px;">Test Email</h1>
                                        <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Resume Maker Email Configuration</p>
                                    </div>

                                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                                        <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                                            Hello! This is a test email to verify that your SendGrid configuration is working correctly.
                                        </p>

                                        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0;">
                                            <p style="margin: 0; font-weight: bold;">✅ Success!</p>
                                            <p style="margin: 5px 0 0 0;">If you received this email, your email setup is working properly!</p>
                                        </div>

                                        <p style="margin: 15px 0 0 0; color: #666; font-size: 14px;">
                                            This test email confirms that:
                                        </p>
                                        <ul style="margin: 10px 0; color: #666; font-size: 14px;">
                                            <li>Your SendGrid API key is valid</li>
                                            <li>Your sender email is verified</li>
                                            <li>Email delivery is working</li>
                                        </ul>
                                    </div>

                                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                                        <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                                            Sent from Resume Maker Application - Test Email
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

    await sgMail.send(msg)

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      sentTo: email,
      from: fromEmail
    })

  } catch (error: any) {
    console.error('SendGrid test error:', error)

    // Provide more detailed error information
    let errorMessage = 'Failed to send email'
    let errorDetails = null

    if (error.response) {
      errorDetails = {
        statusCode: error.response.status,
        body: error.response.body,
        headers: error.response.headers
      }

      if (error.response.status === 403) {
        errorMessage = 'SendGrid API key is invalid or sender email is not verified'
      } else if (error.response.status === 401) {
        errorMessage = 'SendGrid API key is invalid'
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid email address or sender configuration'
      }
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    )
  }
}