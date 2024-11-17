<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

defineOptions({
  name: 'MainLayout'
})

const linksList = [
  {
    title: 'Contact Me',
    caption: 'clouse.jacob@gmail.com',
    icon: 'email',
    link: 'mailto:clouse.jacob@gmail.com'
  },
  {
    title: 'My Github',
    caption: 'github.com/jacobpclouse',
    icon: 'code',
    link: 'https://github.com/jacobpclouse'
  },
  {
    title: 'My LinkedIn',
    caption: 'linkedin.com/in/jpclouse/',
    icon: 'record_voice_over',
    link: 'https://www.linkedin.com/in/jpclouse/'
  },
  {
    title: 'My Website',
    caption: 'jacobpclouse.com/',
    icon: 'public',
    link: 'https://jacobpclouse.com/'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
