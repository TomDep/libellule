<template>
    <SearchView />
</template>

<script lang="ts">
import { Vue, Component, toNative } from 'vue-facing-decorator'
import SearchView from '@/views/search-view/SearchView.vue'

@Component({ components: { SearchView } })
class SearchPage extends Vue {}

export default toNative(SearchPage)
</script>

<style scoped></style>
