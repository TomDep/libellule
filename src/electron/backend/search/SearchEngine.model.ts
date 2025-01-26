type RawSearchResultWithArtists = {
    artists: string
    artist_ids: string
}

export type RawSearchResultBase = {
    type: 'song' | 'album' | 'artist'
    id: number
    name: string
}

export type RawSearchResultArtist = RawSearchResultBase & {
    type: 'artist'
}

export type RawSearchResultAlbum = RawSearchResultBase &
    RawSearchResultWithArtists & {
        type: 'album'
    }

export type RawSearchResultSong = RawSearchResultBase &
    RawSearchResultWithArtists & {
        type: 'song'
    }

export type RawSearchResult = RawSearchResultArtist | RawSearchResultAlbum | RawSearchResultSong
