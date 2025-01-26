import { Artist } from '@/api/artist'
import { Song } from '@/api/song'

export type Album = {
    name: string
    id: number
    artist: Artist
    songs: Array<Song>
}
