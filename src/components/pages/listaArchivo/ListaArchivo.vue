<template>
  <div>      
      <div class="row main-title" align="center">
        <h3>Lista archivo</h3>
        <hr>
      </div>
      <div class="row">
            <div class="col-md-4">
              <div class="form-horizontal">
                    <div class="form-group">
                        <label class="control-label col-sm-1">Ver</label>
                        <div class="col-sm-5">                                
                            <select class="form-control input-sm" v-model="sizeData">                                      
                                <option v-bind:value="10">10</option>
                                <option v-bind:value="25">25</option>
                                <option v-bind:value="50">50</option>
                            </select>                               
                        </div>
                        <div class="col-sm-4">
                            <label class="control-label">registros</label>
                        </div>
                    </div>
              </div>
            </div>
            <div class="col-md-8">
  					<input
                  type="text"
                  class="form-control input-sm"
                  placeholder="Buscar...">
            </div>
	    </div>
      <div class="row">
        <table class="table table-striped table-bordered table-condensed">
          <thead>
            <tr>
              <th>ID</th>
              <th>estado</th>             
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="archivo in archivoData">
              <td>{{archivo.id_lista_archivo}}</td>
              <td>{{archivo.estado.des_estado_archivo}}</td>                      
              <td align="center">              
                <a :href="archivo.ruta_archivo" class="btn btn-info btn-sm link-button" target="_blank">
                  <a>Descargar</a>
                </a>
                <!--
                  <router-link :to="'/utiles/'+archivo.id_lista_archivo+'/editar'" class="btn btn-primary btn-sm link-button">
                  -->
                <router-link :to="{ path: '/utiles/crear?listaArchivoId='+archivo.id_lista_archivo}" class="btn btn-primary btn-sm link-button">
                  <a>Registrar</a>
                </router-link>
                
            </td>
            </tr>
          </tbody>
        </table>
         <vue-simple-spinner v-if="showSpinner" size="large" message="Cargando..." :speed="0.4"></vue-simple-spinner>
         <hr>        
      </div>
      <div class="row" align="center">
          <ul class="pagination">
                <li>
                  <a v-on:click="changePage(currentPage-1)" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                  </a>
              </li>
              <li v-for="(item, index) in getNumber(totalPages)" v-bind:class="{ active:  (index+1 == currentPage)}">
                  <a @click="changePage(index+1)">{{index+1}}</a>
              </li>
              <li>
                  <a v-on:click="changePage(currentPage+1)" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                  </a>
              </li>
          </ul>
      </div>
  </div>
</template>

<style>
    .link-button a{
      text-decoration: none;
      color:white;
    }
</style>
<script>
import Spinner from 'vue-simple-spinner'
  export default{
  data(){
    return {
      sizeData : 10,
      currentPage : 1,
      searchParam : null,
      showSpinner: false,
      totalPages : 0,
      archivoData : {}
    }
  },
  created(){
    this.searchArchivo()
  },
  methods : {
    searchArchivo(){
      this.showSpinner = true
        this.$http.post("api/search-archivo/"+this.searchParam+"?size="+this.sizeData+"&page="+this.currentPage)
        .then(response=>{
          this.archivoData = response.body.data
          this.totalPages = response.body.last_page
          this.showSpinner = false
        }) 
    },
    getNumber(num){
      return new Array(num);
    },
    changePage(page){
      if(page != 0 && page <= this.totalPages){
        this.currentPage = page
        this.searchArchivo()
      }
    }  
  },
  watch:{
    sizeData: function(){
        this.currentPage = 1
        this.searchArchivo()
    },
  },
  components :{
    'vue-simple-spinner': Spinner
  }
  }
</script>