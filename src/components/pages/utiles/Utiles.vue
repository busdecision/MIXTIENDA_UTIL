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
              <router-link :to="'/utiles/'+util.id_lista" class="btn btn-info btn-sm link-button">
                <a>Ver</a>
              </router-link>
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
      utilData : {}
    }
  },
  created(){
    this.searchUtil()
  },
  methods : {
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
    'vue-simple-spinner': Spinner
  }
}  
</script>