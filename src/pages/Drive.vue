<template>
  <v-app>
    <!-- Barra lateral -->
    <v-navigation-drawer app v-model="drawer">
      <v-btn v-if="drawer" @click="toggleDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenido principal -->
    <v-main>
      <v-btn v-if="!drawer" @click="toggleDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-btn @click="uploadFileDialog = true">
        <v-icon>mdi-upload</v-icon>
      </v-btn>
      <v-container>
        <v-row>
          <v-col v-for="file in files" :key="file" cols="12" sm="6" md="2">
            <v-card class="file-card" @click="viewFileFunction(file)">
              <v-card-title>{{ cleanFileName(file) }}</v-card-title>

              <!-- Vista previa para imágenes -->
              <v-card-text v-if="isImage(file)">
                <v-img :src="`http://localhost:3005/files/download/${file}`" max-width="100%" height="200px" contain></v-img>
              </v-card-text>

              <v-card v-if="isVideo(file)">
                <video :src="`http://localhost:3005/files/download/${file}`" max-width="100%" height="200px" controls></video>
              </v-card>

              <v-card v-if="isPdfFile(file)">
                <v-icon color="primary">mdi-file-pdf</v-icon>
                <span>{{ cleanFileName(file) }}</span>
              </v-card>

              <!-- Vista previa para otros tipos de archivo -->
              <v-card-text v-else>
                <v-chip color="grey lighten-2" text-color="black">{{ getFileExtension(file) }}</v-chip>
              </v-card-text>

              <v-card-actions>
                <v-btn @click="deleteFile(file)" color="red">Eliminar</v-btn>
                <v-btn @click="downloadFile(file)" color="primary">Descargar</v-btn>
                <v-btn  color="primary">Ver</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Diálogo de carga de archivo -->
    <v-dialog v-model="uploadFileDialog" max-width="100000vh" width="100vh">
      <v-card height="auto" max-height="9999vh">
        <v-card-title>
          <span class="headline">Subir archivos</span>
        </v-card-title>
        <v-card-text>
          <v-file-input 
            v-model="selectedFiles" 
            label="Selecciona archivos" 
            multiple
            accept="*/*"
            style="max-height: 100vh; overflow-y: auto;"
            @change="previewFiles"
          ></v-file-input>
          
          <!-- Vista previa de los archivos seleccionados -->
          <v-row v-if="filesPreview.length > 0" style="overflow-y: auto; max-height: 50vh;">
            <v-col v-for="(file, index) in filesPreview" :key="index" cols="12" sm="6" md="2">
              <v-card class="pa-2" height="200px">
                <!-- Vista previa para imágenes -->
                <v-img v-if="file.type === 'image'" :src="file.url" max-width="100%" height="150px" />
                
                <!-- Vista previa para videos -->
                <video v-if="file.type === 'video'" :src="file.url" max-width="100%" height="150px" controls></video>
                
                <!-- Vista previa para archivos PDF -->
                <v-icon v-if="file.type === 'application/pdf'" color="primary">mdi-file-pdf</v-icon>
                <span v-if="file.type === 'application/pdf'">{{ file.name }}</span>

                <!-- Vista previa para otros archivos -->
                <v-icon v-if="file.type === 'other'" color="primary">mdi-file</v-icon>
                <span v-if="file.type === 'other'">{{ file.name }}</span>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="uploadFiles" color="primary">Subir</v-btn>
          <v-btn @click="uploadFileDialog = false" color="secondary">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para ver archivos -->
    <v-dialog v-model="viewFileDialog" max-width="90vw" max-height="90vh">
      <v-card height="auto" max-height="90vh" style="overflow-y: auto;">
        <v-card-title>
          <span class="headline">Vista previa del archivo</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <!-- Vista previa de la imagen -->
          <v-img
            v-if="isImage(viewFile)"
            :src="viewFileUrl"
            width="100%"
            height="100%"
            contain
            style="object-fit: contain; max-height: 70vh; display: block; margin: 0 auto;"
          />
          
          <!-- Vista previa de archivo Python o texto -->
          <v-textarea
            v-if="isCodeFile(viewFile)"
            v-model="viewFileContent"
            readonly
            outlined
            auto-grow
            style="overflow-y: auto; max-height: 60vh; width: 100%;"
          ></v-textarea>

          <!-- Vista previa de archivo PDF -->
          <iframe
            v-if="isPdfFile(viewFile)"
            :src="viewFileUrl"
            style="width: 100%; height: 80vh; border: none; max-height: 90vh;"
          ></iframe>

          <!-- Otras vistas de archivo -->
          <v-chip
            v-if="!isImage(viewFile) && !isCodeFile(viewFile) && !isPdfFile(viewFile)"
            color="grey lighten-2"
            text-color="black"
          >
            {{ getFileExtension(viewFile) }}
          </v-chip>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="viewFileDialog = false" color="secondary">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      files: [],
      items: [
        { title: 'Mi Unidad' },
        { title: 'Recientes' },
        { title: 'Papelera' }
      ],
      drawer: false,
      uploadFileDialog: false,
      viewFileDialog: false,
      selectedFiles: [],
      filesPreview: [],
      viewFile: null, // Archivo seleccionado para vista previa
      viewFileContent: '', // Contenido del archivo de texto
      viewFileUrl: '', // URL de vista previa del archivo
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    async fetchFiles() {
      try {
        const response = await axios.get('http://localhost:3005/files');
        this.files = response.data;
      } catch (error) {
        console.error('Error al obtener los archivos:', error);
      }
    },
    async uploadFiles() {
      if (this.selectedFiles.length === 0) return;
      const formData = new FormData();
      
      // Asegúrate de que el nombre del campo sea 'files'
      this.selectedFiles.forEach(file => {
        formData.append('files', file);  // Asegúrate de que el nombre aquí sea 'files'
      });

      try {
        const response = await axios.post('http://localhost:3005/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Archivos subidos:', response.data);
        this.uploadFileDialog = false;
        this.fetchFiles(); // Recargar la lista de archivos
      } catch (error) {
        console.error('Error al subir los archivos:', error);
      }
    },
    async deleteFile(file) {
      try {
        const response = await axios.delete(`http://localhost:3005/files/${file}`);
        console.log('Archivo eliminado:', response.data);
        this.fetchFiles(); // Recargar la lista de archivos
      } catch (error) {
        console.error('Error al eliminar el archivo:', error);
      }
    },
    async downloadFile(file) {
      try {
        const response = await axios.get(`http://localhost:3005/files/download/${file}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error al descargar el archivo:', error);
      }
    },
    cleanFileName(file) {
      return file.replace(/^\d+-/, ''); // Eliminar números de identificador al principio del nombre
    },
    isVideo(file) {
      const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'flv', 'wmv', 'mkv', '3gp', 'm4v', 'mpg', 'mpeg', 'm2v', 'm4v', 'f4v', 'f4p', 'f4a', 'f4b'];
      const ext = this.getFileExtension(file);
      return videoExtensions.includes(ext);
    },
    isImage(file) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico', 'tiff', 'tif' , 'heic', 'heif' , 'jfif'];
      const ext = this.getFileExtension(file);
      return imageExtensions.includes(ext);
    },
    isCodeFile(file) {
      const codeExtensions = ['py', 'js', 'html', 'css', 'java', 'cpp', 'c', 'rb', 'php', 'go', 'ts', 'sh', 'json', 'xml', 'yml', 'yaml', 'md', 'txt'];
      const ext = this.getFileExtension(file);
      return codeExtensions.includes(ext);
    },
    isPdfFile(file) {
      return this.getFileExtension(file) === 'pdf';
    },
    getFileExtension(file) {
      return file.split('.').pop().toLowerCase();
    },
    previewFiles() {
      this.filesPreview = [];
      this.selectedFiles.forEach(file => {
        const fileType = file.type.split('/')[0];  // Determinar el tipo de archivo (image, video, etc.)
        const filePreview = {
          name: file.name,
          type: fileType,
          url: URL.createObjectURL(file)  // Crear una URL para vista previa
        };
        this.filesPreview.push(filePreview);
      });
    },
    viewFileFunction(file) {
      console.log('Se hizo clic en:', file);  // Verificar qué archivo se selecciona
      console.log(file);
      
      this.viewFile = file;
      const ext = this.getFileExtension(file );
      console.log('Extensión del archivo:', ext);

      if (this.isImage(file)) {
        this.viewFileUrl = `http://localhost:3005/files/download/${file}`;
      }

      if (this.isCodeFile(file)) {
        axios.get(`http://localhost:3005/files/download/${file}`)
          .then(response => {
            this.viewFileContent = response.data;
          }).catch(error => {
            console.error('Error al obtener el archivo de código:', error);
          });
      }

      if (this.isPdfFile(file)) {
        this.viewFileUrl = `http://localhost:3005/files/download/${file}`;
      }

      this.viewFileDialog = true;
    }
  },
  mounted() {
    this.fetchFiles();
  }
};
</script>

<style scoped>
.v-card {
  cursor: pointer;
  height: 350px; /* Definir una altura fija para las tarjetas */
  display: flex;
  flex-direction: column;
}

.v-card-title {
  flex-grow: 0;
  font-size: 16px;
  font-weight: bold;
}

.v-card-text {
  flex-grow: 1;
  overflow: hidden; /* Evitar que el contenido se desborde */
  text-align: center;
}

.v-card-actions {
  margin-top: auto; /* Asegurar que los botones estén al final */
}
</style>
