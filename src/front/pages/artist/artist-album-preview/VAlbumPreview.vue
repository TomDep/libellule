<template>
    <mdui-card
        class="d-flex gap-3 pa-3 flex-1 align-center surface"
        clickable
        variant="filled"
        @click="goToAlbum"
    >
        <VAlbumCover />
        <div class="d-flex flex-column">
            <p class="title-large">{{ albumPreview?.name }}</p>
            <p class="body-medium on-surface-text">{{ year }}</p>
            <p class="body-medium on-surface-text">
                {{ albumPreview?.songNumber }}
                {{ (albumPreview?.songNumber ?? 0 > 1) ? 'songs' : 'song' }}
            </p>
        </div>
    </mdui-card>
</template>

<script lang="ts" setup>
import { AlbumPreview } from '@/api'
import VAlbumCover from '@/front/components/album-cover'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{
    albumPreview: AlbumPreview | null
}>()

const year = 2002

const pathToAlbum = computed(() => {
    console.log(`/collection/album/${props.albumPreview?.id}`)
    return `/collection/album/${props.albumPreview?.id}`
})

function goToAlbum() {
    router.push({ path: pathToAlbum.value })
}
</script>

<style lang="scss" scoped></style>
