/*
* This file was generated by a tool.
* Rerun sql-ts to regenerate this file.
*/
export interface Album {
  'album_id'?: number;
  'album_type_id'?: number | null;
  'artist_id'?: number | null;
  'name': string;
}
export interface AlbumType {
  'album_type_id'?: number;
  'name'?: string | null;
}
export interface Artist {
  'artist_id'?: number;
  'name': string;
}
export interface Genre {
  'genre_id'?: number;
  'name': string;
}
export interface Song {
  'album_id'?: number | null;
  'file_location'?: string | null;
  'song_id'?: number;
  'title': string;
}
export interface SongArtist {
  'artist_id'?: number;
  'song_id'?: number;
}
export interface SongGenre {
  'genre_id'?: number;
  'song_id'?: number;
}
