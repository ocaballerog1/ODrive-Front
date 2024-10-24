<script setup lang="ts">

</script>
<template>
    <v-app-bar scroll-behavior="hide"
      >
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title></v-app-bar-title>

        <v-spacer></v-spacer>

        <v-btn icon to="Calendar">
          <v-icon>mdi-magnify</v-icon>

        </v-btn>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>
  </template>
<style scoped></style>