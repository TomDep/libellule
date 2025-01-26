import { Artist } from '@/api/artist'

export type Song = {
    id: number
    album: string
    albumId: number
    title: string
    artists: Array<Artist>
}
