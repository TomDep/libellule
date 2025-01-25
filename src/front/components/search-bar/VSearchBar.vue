<template>
    <div class="v-search-bar" @keydown.enter="search">
        <div class="icon-container">
            <mdui-icon name="search"></mdui-icon>
        </div>

        <div class="input-container">
            <input
                v-model="searchString"
                type="text"
                class="input"
                placeholder="Search for a song title, album, artists..."
                ref="input"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Ref, Component, toNative } from 'vue-facing-decorator'

@Component({ emits: ['search'] })
class VSearchBar extends Vue {
    @Ref('input')
    public readonly input!: HTMLInputElement

    public searchString: string = ''

    public mounted(): void {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key !== 'f' || !event.ctrlKey) return

            this.input.focus()
        })
    }

    public search(): void {
        this.$emit('search', this.searchString)
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
}
</style>
