import { Metadata } from "next"
import "styles/globals.css"
import { Chat } from "medusa-ui-sepia/ui"
import { AI } from "medusa-ui-sepia/rsc"

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
