<template>
    <CSearchBar />
</template>

<script lang="ts">
import { Vue, Component, toNative } from 'vue-facing-decorator'

@Component({})
export class SearchInput extends Vue {}

export default toNative(SearchInput)
</script>

<style scoped></style>
