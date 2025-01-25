<template>
    <div class="v-search-bar" @keydown.enter="search">
        <div class="icon-container">
            <mdui-icon name="search"></mdui-icon>
        </div>

        <div class="input-container">
            <input
                ref="input"
                v-model="searchString"
                class="input"
                placeholder="Search for a song title, album, artists..."
                type="text"
            />
        </div>

        <div v-if="searchString" class="clear-button-container">
            <mdui-button-icon icon="close" @click="clearSearchString"></mdui-button-icon>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from 'vue'

const input = useTemplateRef<HTMLInputElement>('input')
const searchString = ref('')

onMounted(() => {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key !== 'f' || !event.ctrlKey) return
        input.value?.focus()
    })
})

const emit = defineEmits<{
    search: [searchString: string]
}>()

function search(): void {
    emit('search', searchString.value)
}

function clearSearchString(): void {
    searchString.value = ''
    search()
    input.value?.focus()
}
</script>

<style scoped>
.v-search-bar {
    display: flex;

    align-items: center;
    column-gap: 8px;

    background-color: rgb(var(--mdui-color-surface-container-high));
    border-radius: var(--mdui-shape-corner-full);

    width: 100%;
    max-width: 720px;

    .icon-container {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 48px;
        height: 48px;
    }

    .input-container {
        padding: 8px 24px;

        height: 48px;

        display: flex;
        flex: 1 1 auto;
        align-items: center;

        input {
            width: 100%;
            height: 100%;
        }
    }

    .clear-button-container {
        margin-right: 12px;
    }
}
</style>
