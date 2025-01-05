import path from 'path'
import sqlite3 from 'sqlite3'

export class DataBaseManager {
  constructor(rootDirectory: string) {
    this.connectToDatabase(rootDirectory)
  }

  private connectToDatabase(rootDirectory: string) {
    try {
      const filename = path.join(rootDirectory, 'database/libellule.db')
      const db = new (sqlite3.verbose().Database)(filename)

      db.serialize(() => {
        db.each<{ song_id: string; title: string }>("SELECT * FROM 'song'", (err, row) => {
          console.log(row.song_id + ': ' + row.title)
        })
      })

      db.close()
    } catch (error) {
      console.error(error)
    }
  }
}
