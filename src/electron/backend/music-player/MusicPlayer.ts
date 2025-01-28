import SoundPlayer from 'sound-player'

export class MusicPlayer {
    private readonly soundPlayer: SoundPlayer

    public constructor() {
        this.soundPlayer = new SoundPlayer({
            player: 'ffplay',
            gain: 100,
        })

        this.soundPlayer.on('error', (error: Error) => {
            console.error(error)
        })

        this.soundPlayer.play()
    }

    public stop(): void {
        this.soundPlayer.stop()
    }
}
