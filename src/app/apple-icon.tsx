import { ImageResponse } from 'next/og'

// Route segment config - temporarily disable edge runtime
// export const runtime = 'edge'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          borderRadius: '24px',
          padding: '20px',
        }}
      >
        <div
          style={{
            width: '140px',
            height: '140px',
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '80px',
            fontWeight: 'bold',
          }}
        >
          R
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}