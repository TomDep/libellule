<template>
    <div class="d-flex flex-column ga-2">
        <SearchInput />
        <SearchFilters />
    </div>
</template>

<script lang="ts">
import { Vue, Component, toNative } from 'vue-facing-decorator'

@Component({})
class SearchView extends Vue {}

export default toNative(SearchView)
</script>

<style scoped></style>
