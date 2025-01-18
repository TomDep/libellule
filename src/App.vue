<template>
    <mdui-layout style="height: 100vh; width: 100vw">
        <mdui-navigation-rail alignment="center" style="position: relative">
            <mdui-button-icon icon="menu" slot="top"></mdui-button-icon>
            <mdui-fab icon="edit--outlined" slot="top"></mdui-fab>

            <mdui-navigation-rail-item icon="watch_later--outlined"
                >Recent</mdui-navigation-rail-item
            >
            <mdui-navigation-rail-item icon="image--outlined">Images</mdui-navigation-rail-item>
            <mdui-navigation-rail-item icon="library_music--outlined">
                Library
            </mdui-navigation-rail-item>

            <mdui-button-icon icon="settings" slot="bottom"></mdui-button-icon>
        </mdui-navigation-rail>
        <mdui-layout-main>Main</mdui-layout-main>
    </mdui-layout>
</template>

<script lang="ts">
import { Vue, Component, toNative } from 'vue-facing-decorator'

@Component({})
class App extends Vue {}

export default toNative(App)
</script>
