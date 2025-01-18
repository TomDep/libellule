<template>
    <div>
        <router-link :to="route">
            <v-icon>{{ icon }}</v-icon>
            {{ label }}
        </router-link>
    </div>
</template>

<script lang="ts">
import { Vue, Component, toNative, Prop } from 'vue-facing-decorator'
import type { FabSize } from '@/components/fab/CFab.model.ts'

@Component({})
export class CFab extends Vue {
    @Prop({ required: true, type: String, default: '' })
    public readonly icon!: string

    @Prop({ required: true, type: String, default: '' })
    public readonly label!: string

    @Prop({ required: true, type: String, default: '' })
    public readonly route!: string

    @Prop({ required: false, type: String, default: 'medium' })
    public readonly size!: FabSize
}

export default toNative(CFab)
</script>

<style scoped lang="scss">
@use '@/styles/material/tokens';

.container {
    &.medium {
        width: 56px;
        height: 56px;

        padding: 16px;
        border-radius: tokens.$md-sys-shape-corner-medium;
    }

    &:hover {
        opacity: tokens.$md-sys-state-hover-state-layer-opacity;
    }
}
</style>
