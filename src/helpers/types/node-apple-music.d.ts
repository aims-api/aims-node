declare module 'node-apple-music' {
  export function fetchToken(): Promise<string>
  // biome-ignore lint/suspicious/noExplicitAny: types missing
  export function fetchSong(id: string, options: { countryCode: string }): Promise<Record<string, any>>
}
