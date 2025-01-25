<template>
    <div class="d-flex flex-column w-80 gap-4">
        <VSearchBar class="align-self-center" @search="search" :loading="searchBarLoading" />

        <div class="d-flex flex-column gap-2 align-self-start">
            <VSearchResult
                v-for="(searchResult, index) in searchResults"
                :result="searchResult"
                :key="index"
            />
        </div>

        <SearchFilters />
    </div>
</template>

<script lang="ts">
import { SearchResult } from '@/api/index'
import { Vue, Component, toNative } from 'vue-facing-decorator'
import VSearchBar from '@/front/components/search-bar/VSearchBar.vue'
import SearchFilters from '@/front/views/search-view/search-filters/SearchFilters.vue'
import VSearchResult from '@/front/views/search-view/search-result/VSearchResult.vue'

@Component({ components: { VSearchBar, VSearchResult, SearchFilters } })
class SearchView extends Vue {
    public searchString = ''
    public searchBarLoading: boolean = false
    public searchResults: Array<SearchResult> = []

    public async search(searchString: string) {
        this.searchString = searchString

        this.searchBarLoading = true
        this.searchResults = await window.api.search(searchString)
        this.searchBarLoading = false

        console.log(this.searchResults)
    }
}

export default toNative(SearchView)
</script>

<style scoped></style>
