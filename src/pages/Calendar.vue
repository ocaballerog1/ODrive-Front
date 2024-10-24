<template>
  <v-row>
    <!-- Sidebar con minicalendario y botón -->
    <v-col cols="3" class="d-flex flex-column">
      <v-sheet class="pa-4" height="100vh" fixed>
        <v-row>
          <!-- Botón flotante de crear evento -->
          <v-fab
            @click="openDialog(miniCalendar)"
            color="primary"
            icon="mdi-plus"
            class="mt-10 mb-10 ms-5"
          ></v-fab>
        </v-row>
        <v-row>

          
          <!-- Mini calendario en el sidebar -->
          <v-col>
            <v-date-picker v-model="miniCalendar" color="primary"  show-current ref="miniCalendar"></v-date-picker>
          </v-col>
          
          
        </v-row>
      </v-sheet>
    </v-col>

    <!-- Calendario principal -->
    <v-col cols="9">
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="selectedDate"
          :events="events"
          :view-mode="viewMode"
          :weekdays="weekdays"
          color="primary"
        ></v-calendar>
      </v-sheet>
    </v-col>
  </v-row>

  <!-- Diálogo para crear eventos -->
  <v-dialog v-model="dialog" max-width="600px">
    <v-card title="Nuevo Evento">
      <v-card-text>
        <v-text-field label="Título del evento" v-model="form.title" required></v-text-field>
        <v-textarea label="Descripción" v-model="form.description" rows="2"></v-textarea>
        <v-select label="Tipo de evento" :items="titles" v-model="form.type" required></v-select>
        <v-select label="Color del evento" :items="colorOptions" v-model="form.color" item-text="name" item-value="value"></v-select>

        <!-- Fecha de inicio y fin -->
        <!-- <v-menu ref="startMenu" v-model="startMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="form.start" label="Inicio" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="form.start" @input="startMenu = false"></v-date-picker>
        </v-menu>

        <v-menu ref="endMenu" v-model="endMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="form.end" label="Fin" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="form.end" @input="endMenu = false"></v-date-picker>
        </v-menu> -->

        <!-- Repetir evento -->
        <v-checkbox v-model="form.recurring" label="Repetir evento"></v-checkbox>

        <!-- Recordatorio -->
        <v-select label="Recordatorio" :items="reminderOptions" v-model="form.reminder" required hint="Selecciona un recordatorio"></v-select>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancel">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="saveEvent">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDate } from 'vuetify';

export default {
  data: () => ({
    dialog: false, // Control para el diálogo
    form: {
      title: '',
      description: '',
      type: '',
      color: null,
      start: '',
      end: '',
      recurring: false,
      reminder: null,
    },
    type: 'month', // Tipo de vista del calendario principal
    weekday: [0, 1, 2, 3, 4, 5, 6], // Días de la semana
    value: new Date(), // Fecha actual en el calendario
    events: [], // Lista de eventos
    miniCalendar: new Date(), // Fecha seleccionada en el mini calendario
    colorOptions: [
      { name: 'Azul', value: 'blue' },
      { name: 'Verde', value: 'green' },
      { name: 'Rojo', value: 'red' },
      { name: 'Amarillo', value: 'yellow' },
      { name: 'Morado', value: 'purple' },
      { name: 'Cyan', value: 'cyan' },
      { name: 'Naranja', value: 'orange' },
    ],
    titles: ['Reunión', 'Vacaciones', 'Días libres', 'Viaje', 'Evento', 'Cumpleaños', 'Conferencia', 'Fiesta'],
    reminderOptions: ['Ninguno', '5 minutos antes', '10 minutos antes', '30 minutos antes'], // Opciones de recordatorio
    startMenu: false, // Control para el menú de fecha de inicio
    endMenu: false, // Control para el menú de fecha de fin
  }),

  mounted() {
    const adapter = useDate();
    // Cargar eventos al iniciar la vista del calendario
    this.getEvents({
      start: adapter.startOfDay(adapter.startOfMonth(new Date())),
      end: adapter.endOfDay(adapter.endOfMonth(new Date())),
    });
  },

  methods: {
    openDialog(date) {
      // const today = new Date().toISOString().substring(0, 10); // Obtener fecha de hoy
      // Limpiamos el formulario y configuramos las fechas
      this.form = {
        title: '',
        description: '',
        type: '',
        color: null,
        start: date, // Fecha inicial es hoy
        end: date,   // Fecha final es hoy
        recurring: false,
        reminder: null,
      };
      this.dialog = true; // Abrimos el diálogo
    },

    getEvents({ start, end }) {
      // Simulación de petición a un servidor para obtener eventos
      this.events = [
        {
          title: 'Reunión de Proyecto',
          description: 'Revisión de sprint actual',
          type: 'Reunión',
          color: 'blue',
          start: new Date(start),
          end: new Date(end),
          recurring: false,
          reminder: '10 minutos antes',
        },
      ]; // Aquí puedes cargar tus eventos reales desde un servidor
    },

    saveEvent() {
      // Validar que el formulario tenga un título y un tipo
      if (this.form.title && this.form.type) {
        // Agregamos el evento al array de eventos
        this.events.push({
          title: this.form.title,
          description: this.form.description,
          type: this.form.type,
          color: this.form.color.value, // Guardamos el valor del color seleccionado
          start: new Date(this.form.start),
          end: new Date(this.form.end),
          recurring: this.form.recurring,
          reminder: this.form.reminder,
        });
        this.dialog = false; // Cerramos el diálogo
      } else {
        alert('Por favor, completa todos los campos requeridos.'); // Mensaje de advertencia
      }
    },

    cancel() {
      this.dialog = false; // Cerrar el diálogo al cancelar
    },

    updateCalendar() {
      // Actualiza la vista principal del calendario al seleccionar una fecha en el mini calendario
      this.value = this.miniCalendar;
    }
  },
}
</script>

<style scoped>
/* Puedes agregar tus propios estilos aquí */
</style>
