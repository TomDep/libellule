<template>
    <div :class="{ 'force-btn-visibility': forceVisibility || isPlaying }" class="cover">
        <mdui-button-icon
            v-if="isPlaying"
            class="btn"
            icon="pause"
            variant="filled"
            @click="pause"
        />
        <mdui-button-icon
            v-else
            class="btn"
            icon="play_arrow"
            variant="filled"
            @click="playOrResume"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
    forceVisibility?: boolean
    songId: number
}>()

const isPlaying = ref(false)
const started = ref(false)

function playOrResume(): void {
    if (started.value) {
        window.api.resumeSong()
    } else {
        window.api.playSong(props.songId)
        window.api.on('player:songPlaying', (songId: number) => {
            if (songId !== props.songId) {
                isPlaying.value = false
                started.value = false
            }
        })

        started.value = true
    }

    isPlaying.value = true
}

function pause(): void {
    window.api.pauseSong()
    isPlaying.value = false
}
</script>

<style lang="scss" scoped>
.cover {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    border-radius: 8px;
    aspect-ratio: 1 / 1;

    &:not(:hover) {
        &:not(.force-visibility) {
            background-color: rgb(var(--mdui-color-surface-container-low));
        }
    }

    .btn {
        opacity: 0;
    }

    &:hover > .btn,
    &.force-visibility > .btn {
        opacity: 1;
    }
}
</style>
