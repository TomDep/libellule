// noinspection JSUnusedGlobalSymbols

declare module 'sound-player' {
    export interface ISoundPlayerOptions {
        filename?: string
        gain?: number
        device?: string
        debug?: boolean
        player?: 'aplay' | 'afplay' | 'mpg321' | 'mpg123' | 'ffplay'
    }

    interface SoundPlayerEvents {
        play: () => void
        pause: () => void
        resume: () => void
        stop: () => void
        error: (error: Error) => void
        complete: () => void
    }

    export default class SoundPlayer {
        public play: () => void
        public stop: () => void
        public pause: () => void
        public resume: () => void
        public setOptions: (options: ISoundPlayerOptions | string) => void

        public constructor()

        public constructor(filename: string)

        public constructor(options: ISoundPlayerOptions)

        public on<Event extends keyof SoundPlayerEvents>(
            event: Event,
            listener: SoundPlayerEvents[Event],
        ): this
    }
}
