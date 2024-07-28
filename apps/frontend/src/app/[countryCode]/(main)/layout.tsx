import { Metadata } from "next"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
// import Chat from "../../../modules/chat/components/chat"
import { AI } from "../../../modules/chat/components/chat/actions"
import { Chat } from "../../../components/Chat"
// import { StreamChat } from "../../../components/StreamChat"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <AI>
        <Nav />
        {props.children}
        <Footer />

        <Chat />
        {/* <StreamChat /> */}
      </AI>
    </>
  )
}
