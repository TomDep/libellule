<template>
    <div class="v-search-bar">
        <div class="icon-container">
            <mdui-icon name="search"></mdui-icon>
        </div>

        <div class="input-container">
            <input
                type="text"
                class="input"
                placeholder="Search for a song title, album, artists..."
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, toNative } from 'vue-facing-decorator'

@Component({})
class VSearchBar extends Vue {
    public clicked(): void {
        console.log('clicked')
    }
}

export default toNative(VSearchBar)
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
        padding-left: 24px;
        padding-top: 4px;
        padding-bottom: 4px;

        height: 48px;

        display: flex;
        flex: 1 1 auto;
        align-items: center;

        input {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
