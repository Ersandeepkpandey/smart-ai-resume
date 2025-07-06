import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'

export interface EmailConfig {
  provider: 'sendgrid' | 'gmail'
  apiKey?: string
  fromEmail: string
  gmailUser?: string
  gmailPass?: string
}

export class EmailService {
  private config: EmailConfig

  constructor(config: EmailConfig) {
    this.config = config
  }

  async sendVerificationEmail(to: string, verificationUrl: string) {
    const subject = 'Verify your email - Resume Maker'
    const html = this.getVerificationEmailHTML(verificationUrl)
    const text = `Welcome to Resume Maker! Please verify your email by clicking this link: ${verificationUrl}`

    if (this.config.provider === 'sendgrid') {
      return this.sendViaSendGrid(to, subject, text, html)
    } else {
      return this.sendViaGmail(to, subject, text, html)
    }
  }

  async sendTestEmail(to: string) {
    const subject = 'Test Email from Resume Maker'
    const html = this.getTestEmailHTML()
    const text = 'This is a test email to verify email configuration.'

    if (this.config.provider === 'sendgrid') {
      return this.sendViaSendGrid(to, subject, text, html)
    } else {
      return this.sendViaGmail(to, subject, text, html)
    }
  }

  private async sendViaSendGrid(to: string, subject: string, text: string, html: string) {
    if (!this.config.apiKey) {
      throw new Error('SendGrid API key not configured')
    }

    sgMail.setApiKey(this.config.apiKey)

    const msg = {
      to,
      from: this.config.fromEmail,
      subject,
      text,
      html
    }

    return await sgMail.send(msg)
  }

  private async sendViaGmail(to: string, subject: string, text: string, html: string) {
    if (!this.config.gmailUser || !this.config.gmailPass) {
      throw new Error('Gmail credentials not configured')
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.gmailUser,
        pass: this.config.gmailPass
      }
    })

    const mailOptions = {
      from: this.config.fromEmail,
      to,
      subject,
      text,
      html
    }

    return await transporter.sendMail(mailOptions)
  }

  private getVerificationEmailHTML(verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
              <tr>
                  <td align="center" style="padding: 40px 0;">
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                          <tr>
                              <td style="padding: 40px 30px;">
                                  <div style="text-align: center; margin-bottom: 30px;">
                                      <h1 style="color: #333; margin: 0; font-size: 28px;">Welcome to Resume Maker</h1>
                                      <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Please verify your email address</p>
                                  </div>

                                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                                      <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                                          Thank you for signing up! To complete your registration, please click the button below to verify your email address.
                                      </p>

                                      <div style="text-align: center; margin: 25px 0;">
                                          <a href="${verificationUrl}"
                                             style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                                              Verify Email Address
                                          </a>
                                      </div>

                                      <p style="margin: 15px 0 0 0; color: #666; font-size: 14px;">
                                          If the button doesn't work, copy and paste this link into your browser:
                                      </p>
                                      <p style="margin: 5px 0 0 0; word-break: break-all; color: #007bff; font-size: 14px;">
                                          ${verificationUrl}
                                      </p>
                                  </div>

                                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                                      <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                                          This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
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

  private getTestEmailHTML(): string {
    return `
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
                                          Hello! This is a test email to verify that your email configuration is working correctly.
                                      </p>

                                      <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0;">
                                          <p style="margin: 0; font-weight: bold;">✅ Success!</p>
                                          <p style="margin: 5px 0 0 0;">If you received this email, your email setup is working properly!</p>
                                      </div>
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
}