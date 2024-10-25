<template>
  <v-row>
    <!-- Sidebar con minicalendario y botones -->
    <v-col cols="3" class="d-flex flex-column">
      <v-sheet class="pa-4" height="100vh" fixed>
        <v-row>
          <!-- Botón flotante de crear evento -->
          <v-fab @click="openDialog(miniCalendar)" color="primary" icon="mdi-plus" class="mt-10 mb-10 ms-5"></v-fab>

          <!-- Botón flotante para ver la lista de eventos del día -->
          <v-fab @click="openEventListDialog" color="secondary" icon="mdi-format-list-bulleted"
            class="mt-10 ms-5"></v-fab>
        </v-row>

        <v-row>
          <!-- Mini calendario en el sidebar -->
          <v-col>
            <v-date-picker v-model="miniCalendar" color="primary" show-current ref="miniCalendar"
              @input="filterEventsByDay"></v-date-picker>
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>

    <!-- Calendario principal -->
    <v-col cols="9">
      <v-sheet>
        <v-calendar ref="calendar" v-model="miniCalendar" :events="events" :view-mode="viewMode" :weekdays="weekdays"
          color="primary"></v-calendar>
      </v-sheet>
    </v-col>
  </v-row>

  <!-- Diálogo para crear o editar eventos -->
  <v-dialog v-model="dialog" max-width="600px">
    <v-card :title="isEditing ? 'Editar Evento' : 'Nuevo Evento'">

      <v-card-text>
        <v-text-field label="Título del evento" v-model="form.title" required></v-text-field>
        <v-textarea label="Descripción" v-model="form.description" rows="2"></v-textarea>
        <v-select label="Tipo de evento" :items="titles" v-model="form.type" required></v-select>
        <v-select label="Color del evento" :items="colorOptions" v-model="form.color" item-text="name"
          item-value="value"></v-select>
        <input type="color" value="{{form.color}}">

        <v-checkbox v-model="form.allDay" label="Todo el día" @change="toggleAllDay"></v-checkbox>

        <div v-if="!form.allDay">
          <v-menu ref="startMenu" v-model="startMenu" :close-on-content-click="false" transition="scale-transition"
            offset-y min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="form.start" label="Inicio" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="form.start" @input="startMenu = false"></v-date-picker>
          </v-menu>

          <v-menu ref="endMenu" v-model="endMenu" :close-on-content-click="false" transition="scale-transition" offset-y
            min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="form.end" label="Fin" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="form.end" @input="endMenu = false"></v-date-picker>
          </v-menu>
        </div>

        <!-- Repetir evento -->
        <v-checkbox v-model="form.recurring" label="Repetir evento"></v-checkbox>
        <v-select label="Recordatorio" :items="reminderOptions" v-model="form.reminder" required
          hint="Selecciona un recordatorio"></v-select>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" v-if="isEditing" @click="form.delete">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path
              d="M292.31-140q-29.92 0-51.12-21.19Q220-182.39 220-212.31V-720h-40v-60h180v-35.38h240V-780h180v60h-40v507.69Q740-182 719-161q-21 21-51.31 21H292.31ZM680-720H280v507.69q0 5.39 3.46 8.85t8.85 3.46h375.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-720ZM376.16-280h59.99v-360h-59.99v360Zm147.69 0h59.99v-360h-59.99v360ZM280-720v520-520Z" />
          </svg>
        </v-btn>
        <v-btn color="blue darken-1" text @click="cancel">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="saveEvent">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo de lista de eventos del día -->
  <v-dialog v-model="eventListDialog" max-width="600px">
    <v-card title="Eventos del Día">
      <v-list>
        <v-list-item v-for="(event, index) in dailyEvents" :key="index" @click="openEvent(event)"
          class="event-list-item">
          <v-list-item-content>
            <v-list-item-title>{{ event.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ event.description }}</v-list-item-subtitle>

          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeEventListDialog">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDate } from 'vuetify';

export default {
  data: () => ({
    dialog: false, // Control para el diálogo de creación/edición
    eventListDialog: false, // Control para el diálogo de listado de eventos
    isEditing: false, // Bandera para diferenciar entre edición y creación
    editingIndex: -1, // Índice del evento que se está editando
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
    miniCalendar: new Date(), // Fecha seleccionada en el mini calendario
    dailyEvents: [], // Eventos filtrados para el día seleccionado
    events: [], // Lista de eventos
    colorOptions: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'grey'],
    titles: ['Reunión', 'Vacaciones', 'Días libres', 'Viaje', 'Evento', 'Cumpleaños', 'Conferencia', 'Fiesta'],
    reminderOptions: ['Ninguno', '5 minutos antes', '10 minutos antes', '30 minutos antes'],
  }),

  mounted() {
    const adapter = useDate();
    // Cargar eventos al iniciar la vista del calendario
    this.getEvents({
      start: adapter.startOfDay(adapter.startOfMonth(new Date())),
      end: adapter.endOfDay(adapter.endOfMonth(new Date())),
    });
    this.filterEventsByDay(); // Inicializa eventos del día actual
  },

  methods: {
    openDialog(date) {
      this.form = {
        title: '',
        description: '',
        type: '',
        allDay: false,
        color: null,
        start: date || new Date().toISOString().substring(0, 10),
        end: date || new Date().toISOString().substring(0, 10),
        recurring: false,
        reminder: null,
      };
      this.isEditing = false; // No estamos editando
      this.dialog = true; // Abrimos el diálogo
    },

    openEventListDialog() {
      this.filterEventsByDay(); // Filtra los eventos del día seleccionado
      this.eventListDialog = true; // Abrimos el diálogo de listado de eventos
    },

    closeEventListDialog() {
      this.eventListDialog = false; // Cerramos el diálogo de listado de eventos
    },

    openEvent(event) {
      // Configura el formulario con los datos del evento seleccionado
      this.form = { ...event };
      this.isEditing = true;
      this.editingIndex = this.events.indexOf(event);
      this.dialog = true; // Abre el diálogo para editar el evento
      this.eventListDialog = false; // Cierra el diálogo de lista de eventos
    },

    getEvents({ start, end }) {
      // Simulación de petición a un servidor para obtener eventos
      this.events = [
        {
          title: 'Reunión de Proyecto',
          description: 'Revisión de sprint actual',
          type: 'Reunión',
          color: 'red',
          allDay: true,
          start: new Date(start),
          end: new Date(end),
          recurring: false,
          reminder: '10 minutos antes',
        },
      ]; // Aquí puedes cargar tus eventos reales desde un servidor
    },

    toggleAllDay() {
      if (this.form.allDay) {
        this.form.start = new Date().setHours(0, 0, 0, 0);
        this.form.end = new Date().setHours(23, 59, 59, 999);
      }
    },

    saveEvent() {
      if (this.form.title && this.form.type) {
        if (this.isEditing && this.editingIndex !== -1) {
          this.events[this.editingIndex] = { ...this.form };
        } else {
          this.events.push({
            title: this.form.title,
            description: this.form.description,
            type: this.form.type,
            color: this.form.color,
            allDay: this.form.allDay,
            start: new Date(this.form.start),
            end: new Date(this.form.end),
            recurring: this.form.recurring,
            reminder: this.form.reminder,
          });
        }
        this.dialog = false; // Cerramos el diálogo
      } else {
        alert('Por favor, completa todos los campos requeridos.');
      }
    },

    cancel() {
      this.dialog = false; // Cerrar el diálogo al cancelar
    },

    filterEventsByDay() {
      const selectedDate = this.miniCalendar.toISOString().substring(0, 10); // Fecha seleccionada en formato 'YYYY-MM-DD'
      this.dailyEvents = this.events.filter(event => {
        const eventDate = new Date(event.start).toISOString().substring(0, 10); // Fecha del evento en el mismo formato
        return eventDate === selectedDate;
      });
    },
  },
}
</script>

<style scoped>
.event-list-item {
  cursor: pointer;
}
</style>


<!-- Fecha de inicio y fin -->
<!--  -->