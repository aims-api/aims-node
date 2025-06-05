declare module 'node-apple-music' {
  export function setToken(jwt: string): void
  // biome-ignore lint/suspicious/noExplicitAny: types missing
  export function fetchSong(id: string, options: { countryCode: string }): Promise<Record<string, any>>
}
