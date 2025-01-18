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

@Component({})
export class CNavigationRailItem extends Vue {
    @Prop({ required: true, type: String, default: '' })
    public readonly icon!: string

    @Prop({ required: true, type: String, default: '' })
    public readonly label!: string

    @Prop({ required: true, type: String, default: '' })
    public readonly route!: string
}

export default toNative(CNavigationRailItem)
</script>

<style scoped></style>
