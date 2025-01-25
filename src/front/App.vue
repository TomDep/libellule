<template>
    <mdui-layout style="height: 100vh; width: 100vw">
        <mdui-navigation-rail alignment="center" style="position: relative">
            <mdui-button-icon icon="menu" slot="top"></mdui-button-icon>

            <router-link to="/search" slot="top">
                <mdui-fab icon="search--outlined"></mdui-fab>
            </router-link>

            <mdui-navigation-rail-item icon="watch_later--outlined"
                >Recent</mdui-navigation-rail-item
            >
            <mdui-navigation-rail-item icon="image--outlined">Images</mdui-navigation-rail-item>
            <mdui-navigation-rail-item icon="library_music--outlined">
                Library
            </mdui-navigation-rail-item>

            <mdui-button-icon icon="settings" slot="bottom"></mdui-button-icon>
        </mdui-navigation-rail>
        <mdui-layout-main class="d-flex surface">
            <div class="d-flex justify-center pa-4 flex-1">
                <router-view />
            </div>
        </mdui-layout-main>
    </mdui-layout>
</template>

<script lang="ts">
import { Vue, Component, toNative } from 'vue-facing-decorator'

@Component({})
class App extends Vue {}

export default toNative(App)
</script>

<style scoped lang="scss">
.main {
    display: flex;
    justify-content: center;
    padding: 24px;

    width: 100%;
    height: 100%;

    background-color: rgb(var(--mdui-color-surface));
}
</style>
