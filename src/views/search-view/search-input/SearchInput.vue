<template>
    <VSearchBar />
</template>

<script lang="ts">
import { Vue, Component, toNative } from 'vue-facing-decorator'
import VSearchBar from '@/components/search-bar/VSearchBar.vue'

@Component({ components: { VSearchBar } })
class SearchInput extends Vue {}

export default toNative(SearchInput)
</script>

<style scoped></style>
