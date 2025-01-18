<template>
    <div class="c-search-bar">
        <v-icon size="large">mdi-magnify</v-icon>
        <mdui-text-field variant="filled" placeholder="Search for a song title, album, artists...">
        </mdui-text-field>

        <mdui-button variant="text">Click me</mdui-button>
    </div>
</template>

<script lang="ts">
import { Vue, Component, toNative } from 'vue-facing-decorator'

@Component({})
class CSearchBar extends Vue {
    public clicked(): void {
        console.log('clicked')
    }
}

export default toNative(CSearchBar)
</script>

<style scoped>
.c-search-bar {
    display: flex;
    align-items: center;
    column-gap: 8px;

    background-color: rgb(var(--mdui-color-primary));
    border-radius: var(--mdui-shape-corner-extra-small);
    box-shadow: var(--mdui-elevation-level4);

    &:deep(.v-field__input) {
        padding: 0 !important;
    }
}
</style>
