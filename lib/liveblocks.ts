import { Liveblocks } from "@liveblocks/node"

const CURSOR_COLORS = [
  "#52A8FF",
  "#BF7AF0",
  "#FF990A",
  "#FF6166",
  "#F75F8F",
  "#62C073",
  "#0AC7B4",
  "#EDEDED",
] as const

function createLiveblocksClient() {
  return new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY! })
}

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: ReturnType<typeof createLiveblocksClient> | undefined
}

let cachedClient: ReturnType<typeof createLiveblocksClient> | undefined =
  globalForLiveblocks.liveblocks

// Liveblocks's constructor validates the secret key format synchronously,
// so the client is created lazily (on first use) rather than at module load
// — otherwise `next build`'s page-data collection would import this module
// and throw before a real LIVEBLOCKS_SECRET_KEY is ever configured.
export function getLiveblocksClient() {
  if (!cachedClient) {
    cachedClient = createLiveblocksClient()

    if (process.env.NODE_ENV === "development") {
      globalForLiveblocks.liveblocks = cachedClient
    }
  }

  return cachedClient
}

export function getCursorColorForUser(userId: string): string {
  let hash = 0

  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i)
    hash |= 0
  }

  const index = Math.abs(hash) % CURSOR_COLORS.length
  return CURSOR_COLORS[index]
}
