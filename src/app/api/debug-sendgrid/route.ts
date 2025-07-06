import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const apiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.SENDGRID_FROM_EMAIL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    const config = {
      apiKey: {
        exists: !!apiKey,
        length: apiKey ? apiKey.length : 0,
        startsWithSG: apiKey ? apiKey.startsWith('SG.') : false
      },
      fromEmail: {
        exists: !!fromEmail,
        value: fromEmail || 'Not set'
      },
      appUrl: {
        exists: !!appUrl,
        value: appUrl || 'Not set'
      }
    }

    // Test SendGrid configuration
    let sendGridTest = {
      configured: false,
      error: null,
      details: null
    }

    if (apiKey && fromEmail) {
      try {
        sgMail.setApiKey(apiKey)
        sendGridTest.configured = true
      } catch (error: any) {
        sendGridTest.error = error.message
      }
    }

    return NextResponse.json({
      environment: config,
      sendGrid: sendGridTest,
      recommendations: getRecommendations(config)
    })

  } catch (error) {
    console.error('SendGrid debug error:', error)
    return NextResponse.json(
      { error: 'Debug failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.SENDGRID_FROM_EMAIL

    if (!apiKey || !fromEmail) {
      return NextResponse.json(
        { error: 'SendGrid not properly configured' },
        { status: 400 }
      )
    }

    // Configure SendGrid
    sgMail.setApiKey(apiKey)

    // Send a very simple test email
    const msg = {
      to: email,
      from: fromEmail,
      subject: 'SendGrid Test',
      text: 'This is a test email from Resume Maker.',
      html: '<p>This is a test email from Resume Maker.</p>'
    }

    const result = await sgMail.send(msg)

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result: result
    })

  } catch (error: any) {
    console.error('SendGrid test error:', error)

    let errorInfo = {
      message: error.message,
      status: null,
      body: null,
      code: null
    }

    if (error.response) {
      errorInfo.status = error.response.status
      errorInfo.body = error.response.body
      errorInfo.code = error.code
    }

    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: errorInfo
      },
      { status: 500 }
    )
  }
}

function getRecommendations(config: any) {
  const recommendations = []

  if (!config.apiKey.exists) {
    recommendations.push('Set SENDGRID_API_KEY in your .env.local file')
  } else if (!config.apiKey.startsWithSG) {
    recommendations.push('SENDGRID_API_KEY should start with "SG."')
  }

  if (!config.fromEmail.exists) {
    recommendations.push('Set SENDGRID_FROM_EMAIL in your .env.local file')
  } else if (!config.fromEmail.value.includes('@')) {
    recommendations.push('SENDGRID_FROM_EMAIL should be a valid email address')
  }

  if (!config.appUrl.exists) {
    recommendations.push('Set NEXT_PUBLIC_APP_URL in your .env.local file')
  }

  if (recommendations.length === 0) {
    recommendations.push('Configuration looks good. Check SendGrid dashboard for sender verification.')
  }

  return recommendations
}