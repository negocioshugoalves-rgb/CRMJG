import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CRM JG Represent',
  description: 'Sistema de gestao de diagnosticos, propostas e relacionamento comercial.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
