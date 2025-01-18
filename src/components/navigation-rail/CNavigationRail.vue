<template>
    <div>
        <c-fab v-if="fab" v-bind="fabProps" />

        <c-navigation-rail-item
            v-for="(item, index) in items"
            :key="index"
            :label="item.label"
            :icon="item.icon"
            :route="item.route"
        />
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { Vue, Component, toNative, Prop } from 'vue-facing-decorator'
import type { NavigationRailItem } from '@/components/navigation-rail/CNavigationRailItem.model.ts'
import type { FabProps } from '@/components/fab/CFab.model.ts'

@Component({})
export class CNavigationRail extends Vue {
    @Prop({ required: false, type: Boolean, default: false })
    public readonly fab!: boolean

    @Prop({ required: false, type: Object as PropType<FabProps>, default: () => {} })
    public readonly fabProps!: FabProps

    @Prop({ required: false, type: Array as PropType<NavigationRailItem[]>, default: () => [] })
    public readonly items!: NavigationRailItem[]
}

export default toNative(CNavigationRail)
</script>

<style scoped></style>
