<template>
    <SearchView />
</template>

<script lang="ts">
import { Vue, Component, toNative } from 'vue-facing-decorator'

@Component({})
class SearchPage extends Vue {}

export default toNative(SearchPage)
</script>

<style scoped></style>
