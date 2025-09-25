import './globals.css'

export const metadata = {
  title: 'Phòng khám từ xa - Bcare.vn',
  description: 'Phòng khám từ xa - Bcare.vn',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
