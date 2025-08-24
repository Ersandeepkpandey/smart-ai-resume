import { ImageResponse } from 'next/og'

// Route segment config - temporarily disable edge runtime
// export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
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
          borderRadius: '6px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#3b82f6',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
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