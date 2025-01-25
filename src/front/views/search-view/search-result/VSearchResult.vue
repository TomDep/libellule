<template>
    <div class="d-flex flex-row gap-2 flex-1">
        <div class="d-flex flex-column flex-1">
            <p>{{ result.name }}</p>
            <p>{{ artistName }}</p>
        </div>
        <p>{{ result.type }}</p>
    </div>
</template>

<script lang="ts" setup>
import { SearchResult } from '@/api'
import { computed } from 'vue'

const props = defineProps<{
    result: SearchResult
}>()

const artistName = computed(() => {
    if (props.result.type === 'artist') {
        return props.result.name
    } else {
        return props.result.artist
    }
})
</script>
<style scoped></style>
