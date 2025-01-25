<template>
    <div class="d-flex flex-row gap-2 flex-1">
        <div class="d-flex flex-column flex-1">
            <p>{{ result.name }}</p>
            <p>{{ artist }}</p>
        </div>
        <p>{{ result.type }}</p>
    </div>
</template>

<script lang="ts">
import { Vue, Component, toNative, Prop } from 'vue-facing-decorator'
import { SearchResult as SearchResultModel } from '@/api'

@Component({})
export class VSearchResult extends Vue {
    @Prop({
        required: true,
        type: Object,
        default: () => {},
    })
    public readonly result!: SearchResultModel

    public get artist(): string {
        if (this.result.type === 'artist') {
            return this.result.name
        } else {
            return this.result.artist
        }
    }
}

export default toNative(VSearchResult)
</script>

<style scoped></style>
