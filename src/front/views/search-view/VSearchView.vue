<template>
    <div class="d-flex flex-column w-80 gap-4">
        <VSearchBar :loading="searchBarLoading" class="align-self-center" @search="search" />

        <div class="d-flex flex-column gap-2 flex-1">
            <VSearchResult
                v-for="(searchResult, index) in searchResults"
                :key="index"
                :result="searchResult"
            />
        </div>

        <VSearchFilters />
    </div>
</template>

<script lang="ts" setup>
import VSearchBar from '@/front/components/search-bar/VSearchBar.vue'
import VSearchFilters from '@/front/views/search-view/search-filters/VSearchFilters.vue'
import VSearchResult from '@/front/views/search-view/search-result'
import { type SearchResult } from '@/api'
import { ref } from 'vue'

const searchBarLoading = ref(false)
const searchResults = ref<SearchResult[]>([])

async function search(searchString: string) {
    if (!searchString) {
        searchResults.value = []
        return
    }

    searchBarLoading.value = true
    searchResults.value = await window.api.search(searchString)
    searchBarLoading.value = false
}
</script>

<style scoped></style>
