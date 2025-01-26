<template>
    <div class="d-flex body-small on-surface-variant-text">
        <router-link
            v-for="(artist, index) of artists"
            :key="index"
            :to="artistCollectionPath[artist.id]"
        >
            <span v-if="index > 0" class="mr-1">,</span>
            <a> {{ artist.name }}</a>
        </router-link>
    </div>
</template>

<script lang="ts" setup>
import { Artist } from '@/api'
import { onBeforeMount, ref } from 'vue'

const props = defineProps<{
    artists: Array<Artist>
}>()

const artistCollectionPath = ref<Record<number, string>>({})

onBeforeMount(() => {
    for (const artist of props.artists) {
        const id = artist.id
        artistCollectionPath.value[id] = `/collection/artist/${id}`
    }
})
</script>

<style lang="scss" scoped></style>
