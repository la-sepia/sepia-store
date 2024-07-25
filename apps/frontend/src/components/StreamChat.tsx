"use client"

import { useState } from "react"
import { streamComponent } from "../lib/actions/chat"

export function StreamChat() {
  const [component, setComponent] = useState<React.ReactNode>()

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setComponent(await streamComponent())
        }}
      >
        <button>Stream Component</button>
      </form>
      <div>{component}</div>
    </div>
  )
}
