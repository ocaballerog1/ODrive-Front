<script lang="ts"></script>
<template>
    <v-main>
      <v-container>
        <!-- Banner -->
        <v-row class="d-flex justify-center align-center" style="height: 60vh; background-image: url('https://source.unsplash.com/random/1600x900'); background-size: cover;">
          <v-col cols="12" class="text-center white--text">
            <h1 class="display-2">Bienvenido a Mi Aplicación</h1>
            <p class="subtitle-1">Tu solución para gestionar proyectos de manera eficiente</p>
            <v-btn large color="secondary">Saber más</v-btn>
          </v-col>
        </v-row>

        <!-- Sección de información -->
        <v-row class="my-12">
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Características</v-card-title>
              <v-card-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et dictum purus.
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary">Más detalles</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Beneficios</v-card-title>
              <v-card-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer rutrum ligula nec lorem vehicula.
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary">Más detalles</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Soporte</v-card-title>
              <v-card-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel ligula at arcu tristique varius.
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary">Más detalles</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

</template>
<style scoped></style>