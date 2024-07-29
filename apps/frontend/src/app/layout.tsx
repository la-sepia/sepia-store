import { Metadata } from "next"
import "styles/globals.css"

import { AI, Chat } from "medusa-ui-sepia"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body suppressHydrationWarning={true}>
        <AI>
          <main className="relative">{props.children}</main>
          <Chat />
        </AI>
      </body>
    </html>
  )
}
