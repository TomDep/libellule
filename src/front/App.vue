<template>
    <mdui-layout style="height: 100vh; width: 100vw">
        <mdui-navigation-rail alignment="center" style="position: relative">
            <mdui-button-icon slot="top" icon="menu"></mdui-button-icon>

            <router-link slot="top" to="/search">
                <mdui-fab icon="search--outlined"></mdui-fab>
            </router-link>

            <mdui-navigation-rail-item icon="watch_later--outlined"
                >Recent</mdui-navigation-rail-item
            >
            <mdui-navigation-rail-item icon="image--outlined">Images</mdui-navigation-rail-item>
            <mdui-navigation-rail-item icon="library_music--outlined">
                Library
            </mdui-navigation-rail-item>

            <mdui-button-icon slot="bottom" icon="settings"></mdui-button-icon>
        </mdui-navigation-rail>
        <mdui-layout-main class="d-flex surface">
            <div class="d-flex justify-center pa-4 flex-1">
                <router-view />
            </div>
        </mdui-layout-main>
    </mdui-layout>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.main {
    display: flex;
    justify-content: center;
    width: 100%;

    height: 100%;
    padding: 24px;

    background-color: rgb(var(--mdui-color-surface));
}
</style>
