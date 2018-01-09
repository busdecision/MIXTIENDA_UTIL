<template>
  <div>
      <div class="row main-title">
        <h3 align="center">Lista de Útiles</h3>
        <hr>
      </div>
        <div class="row">
          <div class="col-md-4">
         			
		  		</div>
        </div>
        </br>

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
                  v-model="searchParam"
                  type="text"
                  class="form-control input-sm"
                  placeholder="Buscar...">
            </div>
	    </div>
      <br>    
      <div class="row">
        <table class="table table-striped table-bordered table-condensed">
          <thead>
            <tr>
              <th>ID</th>
              <th>Colegio</th>
              <th>Nivel</th>
              <th>Grado</th>
              <th>Código Lista</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="util in utilData">
              <td>{{util.id_colegio}}</td>
              <td>{{util.des_colegio}}</td>
              <td>{{util.des_grado_escolar}}</td>
              <td>{{util.nivel_grado_escolar}}</td>
              <td>{{util.id_lista_archivo}}</td>              
              <td>
              <button @click="openModal(util.id_lista)" class="btn btn-info btn-sm link-button">
                <a>Ver</a>
              </button>
              <router-link :to="'/utiles/'+util.id_lista+'/editar'" class="btn btn-primary btn-sm link-button">
                <a>Editar</a>
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
      <modal :show.sync="modalNewIsOpen" effect="fade" width="400" :backdrop="false">
          <div slot="modal-header" class="modal-header" align="center">
            <h4 class="modal-title">
              Ver Util
            </h4>
          </div>
          <div slot="modal-body" class="modal-body">
            <div class="row">
              <form class="form-horizontal">
                <div class="form-group">
                  <label class="control-label col-sm-2">Colegio:</label>
                  <div class="col-sm-8">
                    <select v-model="util.id_colegio" class="form-control input-sm" :disabled="true">
                      <option value=""></option>
                      <option value="" v-for="school in schools" v-bind:value="school.id_colegio">
                        {{school.des_colegio}}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-sm-2">Grado:</label>
                  <div class="col-sm-8"> 
                    <select v-model="util.id_grado_escolar" class="form-control input-sm" :disabled="true">
                      <option value=""></option>
                      <option value="" v-for="grade in schoolGrades" v-bind:value="grade.id_grado_escolar">
                        {{grade.des_grado_escolar}}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-sm-2" for="pwd">Periodo:</label>
                  <div class="col-sm-4">
                    <input v-model="util.periodo" type="text" class="form-control input-sm" :disabled="true">
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-sm-2" for="pwd">Cod Lista:</label>
                  <div class="col-sm-8"> 
                    <input v-model="util.id_lista_archivo" type="text" class="form-control input-sm" :disabled="true">
                  </div>
                </div>
              </form>
              <div class="row" style="margin:5%;">
                    <table class="table table-striped table-condensed">
                      <thead>
                        <tr>
                            <th class="col-xs-3">Grupo Producto</th>
                            <th class="col-xs-3">Des detalle</th>
                            <th class="col-xs-3">Cantidad</th>
                        </tr>
                      </thead>
                    </table>
                    <div class="table-container">
                      <table class="table table-striped table-condensed">
                        <tbody>
                            <tr v-for="(product, index) in util.grupo_producto">
                              <td class="col-xs-3">
                                {{product.des_grupo_producto}}
                              </td>
                              <td class="col-xs-3">
                                {{product.des_detalle}}
                              </td>
                              <td class="col-xs-3">
                                {{product.cantidad}}
                              </td>
                            </td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                </div>
            </div>
          </div>
          <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeModal()">Cerrar</button>        
          </div>
      </modal>
  </div>
</template>
<style>
    .pagination{
        cursor: pointer;
    }
    .link-button a{
      text-decoration: none;
      color:white;
    }
      div.table-container {
      height: 300px;
      overflow-x: hidden;
      overflow-y: auto;
      margin-top: -20px;
  }
</style>

<script>
import VueStrap from 'vue-strap'
import Spinner from 'vue-simple-spinner'
export default{
  data(){
    return {
      sizeData : 10,
      currentPage : 1,
      searchParam : null,
      showSpinner: false,
      utilData:{},
      schoolGrades : [],
      schools : {},
      totalPages : 0,
      modalNewIsOpen : false,
      util: {
          periodo : 0,
          grupo_producto : []
        }
    }
  },
  created(){
    this.searchUtil()
    this.getSchools()
    this.getSchoolGrades()
    
  },
  methods : {
    openModal(id){
      this.getUtil(id)
      this.modalNewIsOpen= true
    },
    closeModal(){
      this.modalNewIsOpen = false
    },
    getUtil(id){
      this.$http.get("api/util/"+id).then(response=>{
        this.util =  response.body
      })
    },
    getSchools(){
      this.$http.get("api/school").then(response=>{
        this.schools = response.body
      })
    },
    getSchoolGrades(){
      this.$http.get("api/school-grade").then(response=>{
        this.schoolGrades = response.body
      })
    },
    searchUtil(){
      if(!this.searchParam){
          this.searchParam = null
      }
      this.showSpinner = true
        this.$http.post("api/search-utiles/"+this.searchParam+"?size="+this.sizeData+"&page="+this.currentPage)
        .then(response=>{
          this.utilData = response.body.data
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
        this.searchUtil()
      }
    }
  },
  watch : {
    sizeData: function(){
        this.currentPage = 1
        this.searchUtil()
    },
    searchParam : function(){
      var validateSrch = !this.searchParam ? '' : this.searchParam;
      if(validateSrch.length>=3 || validateSrch == ''){
        this.searchUtil()
      }      
    }
  },
  components :{
    'modal' : VueStrap.modal,
    'vue-simple-spinner': Spinner
  }
}  
</script>