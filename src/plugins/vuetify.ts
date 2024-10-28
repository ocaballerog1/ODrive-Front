/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import 'vuetify/labs/VCalendar'

// Composables
import { createVuetify } from 'vuetify'
import { VCalendar } from 'vuetify/labs/VCalendar'
import { VDateInput } from 'vuetify/labs/components'
import { VColorPicker } from 'vuetify/components'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VCalendar,
    VDateInput,
    VColorPicker
  },
  theme: {
    defaultTheme: 'light',
  },
})
