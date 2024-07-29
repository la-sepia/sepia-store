import { Metadata } from "next"
import "styles/globals.css"
import { AI } from "../modules/chat/components/chat/actions"
import Chat from "../modules/chat/components/chat"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body suppressHydrationWarning={true}>
        <AI>
          <main className="relative">
            {props.children}

            <Chat />
          </main>
        </AI>
      </body>
    </html>
  )
}
