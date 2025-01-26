<template>
    <div class="d-flex flex-row gap-4 w-100 align-center">
        <slot />

        <p class="text-capitalize body-medium">{{ result.type }}</p>
    </div>
</template>

<script lang="ts" setup>
import { SearchResultBase } from '@/api'

const props = defineProps<{
    result: SearchResultBase
}>()
</script>

<style lang="scss" scoped></style>
