<template>
  <div>
    <v-sheet>
      <v-btn @click="openDialog" color="blue" class="mb-3">Crear +</v-btn>
      <v-calendar
        ref="calendar"
        v-model="value"
        :events="events"
        :view-mode="type"
        :weekdays="weekday"
      ></v-calendar>
    </v-sheet>

    <!-- Diálogo para crear un evento usando Vuetify Labs -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card title="Nuevo Evento">
        <v-card-text>
          <v-text-field
            label="Título del evento"
            v-model="form.title"
            required
          ></v-text-field>

          <v-textarea
            label="Descripción"
            v-model="form.description"
            rows="2"
          ></v-textarea>

          <v-select
            label="Tipo de evento"
            :items="titles"
            v-model="form.type"
            required
          ></v-select>

          <v-select
            label="Color del evento"
            :items="colorOptions"
            v-model="form.color"
            item-text="name"
            item-value="value"
          ></v-select>

          <v-menu
            ref="startMenu"
            v-model="startMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.start"
                label="Inicio"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="form.start" @input="startMenu = false"></v-date-picker>
          </v-menu>

          <v-menu
            ref="endMenu"
            v-model="endMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.end"
                label="Fin"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="form.end" @input="endMenu = false"></v-date-picker>
          </v-menu>

          <v-checkbox
            v-model="form.recurring"
            label="Repetir evento"
          ></v-checkbox>

          <v-select
            label="Recordatorio"
            :items="reminderOptions"
            v-model="form.reminder"
            required
            hint="Selecciona un recordatorio"
          ></v-select>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveEvent">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
    type: 'month',
    weekday: [0, 1, 2, 3, 4, 5, 6],
    value: new Date(), // Fecha actual
    events: [],
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
    this.getEvents({
      start: adapter.startOfDay(adapter.startOfMonth(new Date())),
      end: adapter.endOfDay(adapter.endOfMonth(new Date())),
    });
  },

  methods: {
    openDialog() {
      const today = new Date().toISOString().substring(0, 10); // Obtener fecha de hoy
      // Limpiamos el formulario y configuramos las fechas
      this.form = {
        title: '',
        description: '',
        type: '',
        color: null,
        start: today, // Fecha inicial es hoy
        end: today,   // Fecha final es hoy
        recurring: false,
        reminder: null,
      };
      this.dialog = true; // Abrimos el diálogo
    },

    getEvents({ start, end }) {
      // Simulamos una petición a un servidor
      this.events = []; // Aquí puedes cargar tus eventos desde un servidor
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


  },
}
</script>

<style scoped>
/* Puedes agregar tus propios estilos aquí */
</style>
