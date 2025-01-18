<template>
    <div
        style="
            display: flex;
            flex-direction: column;
            flex: 1 1 auto;
            align-items: center;
            width: 80%;
        "
    >
        <SearchInput />
        <SearchFilters />
    </div>
</template>

<script lang="ts">
import { Vue, Component, toNative } from 'vue-facing-decorator'
import SearchInput from '@/views/search-view/search-input/SearchInput.vue'
import SearchFilters from '@/views/search-view/search-filters/SearchFilters.vue'

@Component({ components: { SearchInput, SearchFilters } })
class SearchView extends Vue {}

export default toNative(SearchView)
</script>

<style scoped></style>
