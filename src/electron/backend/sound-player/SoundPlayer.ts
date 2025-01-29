import * as process from 'node:process'
import { resume, suspend } from 'ntsuspend'
import { platform } from 'os'
import EventEmitter from 'events'
const isMac = platform() === 'darwin'
const isWindows = platform() === 'win32'

if (isWindows) {
    const { suspend, resume } = await import('ntsuspend')
}

export interface ISoundPlayerOptions {
    filename?: string
    gain?: number
    device?: string
    debug?: boolean
    player?: 'aplay' | 'afplay' | 'mpg321' | 'mpg123' | 'ffplay'
}

import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'

export class SoundPlayer extends EventEmitter {
    private options: ISoundPlayerOptions = {
        player: 'ffplay',
        debug: true,
        gain: 50,
    }

    private process: ChildProcessWithoutNullStreams | null = null

    private playing: boolean = false

    public constructor(options: ISoundPlayerOptions) {
        super()
        this.setOptions(options)
    }

    public setOptions(options: ISoundPlayerOptions | string) {
        if (typeof options === 'string') {
            this.options.filename = options
            options = this.options
        }

        this.options = options || {}
        this.options.filename = options.filename || ''
        this.options.gain = options.gain || 50
        this.options.debug = options.debug || false
        this.options.player = options.player || (isMac ? 'afplay' : 'ffplay')
    }

    public play(filename?: string): void {
        if (filename) {
            this.options.filename = filename
        }

        if (!this.options.filename) {
            return
        }

        if (this.playing) {
            this.stop()
        }

        this.playing = true
        this.emit('play')
        if (this.options.debug) console.log('=========', this.options)

        switch (this.options.player) {
            case 'aplay':
                this.process = spawn('aplay', [
                    `${this.options.filename} -D ${this.options.device}`,
                ])
                break
            case 'afplay':
                this.process = spawn('afplay', [
                    this.options.filename,
                    '-v',
                    this.options.gain ?? 50,
                ])
                break
            case 'mpg321':
                this.process = spawn('mpg321', [
                    `${this.options.filename} -g ${this.options.gain} -a ${this.options.device}`,
                ])
                break
            case 'mpg123':
                this.process = spawn('mpg123', [
                    `${this.options.filename} -g ${this.options.gain} -a ${this.options.device}`,
                ])
                break
            case 'ffplay':
                this.process = spawn('ffplay', [
                    this.options.filename,
                    '-nodisp',
                    '-autoexit',
                    '-volume',
                    this.options.gain,
                ])
                break
        }

        this.process?.on('exit', (code: number, signal: string) => {
            if (code && signal) {
                this.emit('complete')
            }
        })

        this.process?.on('error', (err: Error) => {
            this.emit('error', err)
            if (this.options.debug) {
                console.error(err)
            }
        })
    }

    public stop(): void {
        this.playing = false
        this.process?.kill('SIGKILL')
        this.emit('stop')
    }

    public pause(): void {
        if (!this.playing) {
            return
        }

        if (isWindows && this.process?.pid) {
            suspend(this.process.pid)
        } else {
            this.process?.kill('SIGSTOP')
        }
        this.emit('pause')
    }

    public resume(): void {
        if (!this.playing) {
            return this.play()
        }

        if (isWindows && this.process?.pid) {
            resume(this.process.pid)
        } else {
            this.process?.kill('SIGCONT')
        }
        this.emit('resume')
    }
}
