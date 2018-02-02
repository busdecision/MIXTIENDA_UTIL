<template>
  <div class="school-content container">
      <div class="row main-title">
        <h3 align="center">Lista de colegios</h3>
        <hr>
      </div>
        <div class="row">
            <div class="col-md-12">
                <router-link :to="'/colegio/crear'" class="btn btn-success btn-sm link-button">
                        <a>Nuevo</a>
                </router-link>
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
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="school in schools">
              <td>{{school.id_colegio}}</td>
              <td>{{school.des_colegio}}</td>
              <td>
                <button class="btn btn-info btn-sm" @click="openNewModal(); getSchool(school.id_colegio); changeFormType('view')">Ver</button>
                <router-link :to="'/colegio/'+school.id_colegio+'/editar'" class="btn btn-primary btn-sm link-button">
                    <a>Editar</a>
                </router-link>
            </td>
            </tr>
          </tbody>
        </table>        
         <vue-simple-spinner v-if="showSpinner" size="large" message="Cargando..." :speed="0.4"></vue-simple-spinner>         
         <hr>        
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

    <modal :show.sync="modalNewIsOpen" effect="fade" width="400" :backdrop="false">
        <!--<modal :show.sync="modalNewIsOpen" :on-close="closeModal" effect="fade" width="400" @showchange="updateShowDialog">-->
      <div slot="modal-header" class="modal-header" align="center">
        <h4 class="modal-title">
        Registro de Colegio
        </h4>
      </div>
      <div slot="modal-body" class="modal-body">
          <div @submit.prevent="validateBeforeSubmit" class="my-form">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-horizontal">
                                        <div class="form-group">
                                            <label class="control-label col-sm-2">ID:</label>
                                            <div class="col-sm-10">
                                                <input :disabled="true" type="number" v-model ="schooldata.id_colegio" class="form-control input-sm" >
                                            </div>
                                        </div>
                                        <div class="form-group" :class="{'has-error': errors.has('schooldata.des_colegio') }">
                                            <label class="control-label col-sm-2" >Colegio:</label>
                                            <div class="col-sm-10">
                                                <input v-validate.initial="schooldata.des_colegio" @change="existsSchoolName()" data-vv-rules="required" :disabled="formType=='view'" type="text" v-model ="schooldata.des_colegio" class="form-control input-sm">
                                                <p class="text-danger" v-if="errors.has('schooldata.des_colegio')">Nombre es requerido</p>
                                                <vue-simple-spinner v-if="checkNameSpinner" size="small" message="Validando Nombre..." :speed="0.4"></vue-simple-spinner>                                
                                                <span v-if="canUseName" class="label label-success">Nombre validado</span>
                                                <span v-if="existSchoolName" class="label label-danger">Este nombre ya existe</span>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-horizontal">                   
                                        <div class="form-group">
                                            <label class="control-label col-sm-4" >Observacion:</label>
                                            <div class="col-sm-8">
                                                <textarea :disabled="formType=='view'" class="form-control input-sm" rows="5" v-model ="schooldata.observacion"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-horizontal">
                                        <div class="form-group" :class="{'has-error': errors.has('depSelected')}">
                                            <label class="control-label col-sm-4">Departamento:</label>                        
                                            <div class="col-sm-8">
                                                    <select v-validate.initial="depSelected"  data-vv-rules="required" :disabled="formType=='view'" class="form-control input-sm" v-model="depSelected">
                                                        <option value=""></option>  
                                                        <option v-bind:value="department.id_departamento" v-for="department in departments">{{department.des_departamento}}</option>
                                                    </select>
                                                    <p class="text-danger" v-if="errors.has('depSelected')">Departamento es requerido</p>
                                            </div>
                                        </div>
                                        <div class="form-group" :class="{'has-error': errors.has('provSelected')}">
                                            <label class="control-label col-sm-4" >Provincia:</label>
                                            <div class="col-sm-8">
                                                    <select v-validate.initial="provSelected"  data-vv-rules="required" class="form-control input-sm" v-model="provSelected" :disabled="depSelected == '' || depSelected == null || formType=='view'">
                                                        <option value=""></option>  
                                                        <option v-bind:value="province.id_provincia" v-for="province in provincies">{{province.des_provincia}}</option>
                                                    </select>
                                                    <p class="text-danger" v-if="errors.has('provSelected')">Provincia es requerida</p>
                                            </div>
                                        </div>                    
                                        <div class="form-group" :class="{'has-error': errors.has('schooldata.id_distrito')}">
                                            <label class="control-label col-sm-4" >Distrito:</label>
                                            <div class="col-sm-8">                            
                                                    <select v-validate.initial="schooldata.id_distrito"  data-vv-rules="required" class="form-control input-sm" v-model="schooldata.id_distrito" :disabled="provSelected =='' || provSelected == null || formType=='view'">
                                                        <option value=""></option>  
                                                        <option v-bind:value="district.id_distrito" v-for="district in districts">{{district.des_distrito}}</option>
                                                    </select>
                                                    <p class="text-danger" v-if="errors.has('schooldata.id_distrito')">Distrito es requerido</p>
                                            </div>                           
                                        </div>
                                    </div>
                                </div>
                            </div>
            <div class="row">
                <div class="col-md-12">
                    <label>Seleccione:</label>
                    <table class="table table-striped table-bordered table-condensed">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Grado Escolar</th>
                                <th>Nivel</th>
                            </tr>
                        </thead>
                    </table>
                    <div class="table-container">
                        <table class="table table-striped table-bordered table-condensed">
                            <tbody>
                                <tr v-for="grade in schoolGrades">
                                    <td align="center">
                                        <label>
                                            <input
                                                :disabled="formType=='view'"
                                                v-bind:value="grade.id_grado_escolar"
                                                type="checkbox"
                                                v-model="schooldata.school_grades_id"
                                                >
                                        </label>
                                    </td>
                                    <td>{{grade.des_grado_escolar}}</td>
                                    <td>{{grade.nivel_grado_escolar}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </div>
      </div>
      <div slot="modal-footer" class="modal-footer">          
        <button type="button" class="btn btn-danger" v-if="formType != 'view' "@click="saveOrUpdateSchool()">Guardar</button>
        <button type="button" class="btn btn-primary" @click="closeModal()">Cancelar</button>        
      </div>
    </modal>
 </div>
</template>
<style>
  .main-title{
      margin-bottom: 6%;
  }
  .my-form .control-label{
      text-align: left !important;
      font-size: 12px;
  }
   .my-form input{
       font-size: 12px;
   }
   .table tbody{
       font-size: 12px;
   }
   .link-button a{
      text-decoration: none;
      color:white;
    }
</style>
<script>
    import VueStrap from 'vue-strap'
    import Spinner from 'vue-simple-spinner'
    import swal from 'sweetalert2'

    export default{
      data(){
        return{
          totalPages : 0,
          currentPage : 1,
          sizeData : 10,
          showSpinner : false,
          schools: [],
          provincies: [],
          departments: [],
          schoolGrades: [],
          districts: [],
          searchParam : null,          
          modalIsOpen: false,
          modalNewIsOpen: false,          
          schooldata :{
              school_grades_id : [],
              id_distrito: null
          },          
          depSelected : null,
          provSelected : null,
          formType: '',          
          existSchoolName: false,
          checkNameSpinner: false,
          canUseName: false,
          temporaryEditName : null
        }
      },
      created(){
            //this.allSchools()
            this.searchSchool()
            this.allDistricts()
            this.allPronvicies()
            this.allDepartments()
            this.allSchoolGrades()
      },      
      methods: {
        existsSchoolName(){
            if(this.schooldata.des_colegio){
                if(this.formType == 'new'){
                    this.checkNameSpinner = true
                    this.$http.get("api/validate-school-name/"+this.schooldata.des_colegio)
                    .then(response=>{
                        this.checkNameSpinner = false
                        this.existSchoolName = response.body.exists
                        this.canUseName =   !this.existSchoolName ? true : false
                    })
                }
                else{
                    this.checkNameSpinner = true
                    this.$http.get("api/validate-school-name/"+this.schooldata.des_colegio)
                    .then(response=>{
                        this.checkNameSpinner = false
                        this.existSchoolName = response.body.exists && (response.body.name_founded != this.temporaryEditName) ? true : false
                        this.canUseName =   !this.existSchoolName ? true : false
                    })
                }
            }

        },
        validateBeforeSubmit(){
            this.$validator.validateAll();
        },
          allSchools(){
              this.showSpinner = true
            this.$http.get("api/school?size="+this.sizeData+"&page="+this.currentPage)
              .then(response=>{
                  this.schools = response.body.data
                  this.showSpinner = false
                  this.totalPages = response.body.last_page
              })
          },          
          allDepartments(){
            this.$http.get("api/department")
              .then(response=>{
                  this.departments = response.body
              })
          }, 
          allPronvicies(){              
              if(this.depSelected){                  
                this.$http.get("api/province-by-department/"+this.depSelected)
                .then(response=>{
                    this.provincies = response.body
                })                  
              }
          },
          allDistricts(){
              if(this.provSelected){
                  this.$http.get("api/district-by-province/"+this.provSelected)
                    .then(response=>{
                        this.districts = response.body
                    })
              }
            
          },
        getNumber(num){
            return new Array(num);
         },
         changePage(page){
             if(page != 0 && page <= this.totalPages){
                this.currentPage = page
                this.searchSchool()
             }             
         },   
          allSchoolGrades(){
            this.$http.get("api/school-grade")
              .then(response=>{
                  this.schoolGrades = response.body
              })
          },         
          openNewModal() {
              this.modalNewIsOpen = true
          },
          closeModal(){
            this.modalIsOpen = false
            this.modalNewIsOpen = false
            this.schooldata = {}
            this.depSelected = null
            this.provSelected = null
          },          
          getSchool(id){
            this.$http.get("api/school/"+id).then((response)=>{
                this.depSelected = response.body.district.province.id_departamento
                this.provSelected = response.data.district.id_provincia
                this.schooldata = response.body

                //store name to compare in edit modal
                this.temporaryEditName = this.schooldata.des_colegio 

                this.allPronvicies()
                this.allDistricts()

                var grades_ids = response.body.school_grades
                //getting only the ids

                this.schooldata.school_grades_id = []      
                grades_ids.forEach(function(element) {
                   this.schooldata.school_grades_id.push(element.id_grado_escolar)
               }, this);
            });
          },
          searchSchool(){
                if(!this.searchParam){
                    this.searchParam = null
                }
                this.showSpinner = true          
                this.$http.get("api/search-school/"+this.searchParam+"?size="+this.sizeData+"&page="+this.currentPage).then((response)=>{
                    this.schools = response.body.data
                    this.totalPages = response.body.last_page
                    this.showSpinner = false                 
                })            
          },
          saveOrUpdateSchool(){              
            this.$validator.validateAll();
            if(this.existSchoolName){
                swal(
                    'Oops...',
                    'Este nombre ya existe, por favor ingrese otro',
                    'error'
                )
                return
            }
            if (!this.errors.any()) {
                if(this.schooldata.school_grades_id.length > 0){
                    if(this.formType == "new"){
                        this.saveSchool()
                    }
                    else if(this.formType == "edit"){
                        this.updateSchool()
                    }
                }
                else{
                    swal(
                        'Oops...',
                        'Por favor seleccione por lo menos un grado',
                        'error'
                    )
                }
            }
                     
          },
          saveSchool(){
                this.$http.post("api/school/",this.schooldata).then(()=>{
                    this.searchSchool()
                    swal({
                        position: 'top-right',
                        type: 'success',
                        title: 'Guardado exitosamente',
                        showConfirmButton: false,
                        timer: 1700                        
                    }).then(()=>{
                        this.closeModal()
                    })
                },(error)=>{
                    swal(
                        'Oops...',
                        'Hubo un error al guardar',
                        'error'
                    )
                })
          },          
          updateSchool(){           
                this.$http.put("api/school/"+this.schooldata.id_colegio,this.schooldata).then((response)=>{
                    this.searchSchool()
                    swal({
                        position: 'top-right',
                        type: 'success',
                        title: 'Guardado exitosamente',
                        showConfirmButton: false,
                        timer: 1500,                        
                    }).then( ()=>{
                            this.closeModal()
                        })
                }, (error) =>{
                    swal(
                        'Oops...',
                        'Hubo un error al guardar',
                        'error'
                    )
                })
          },
          changeFormType(type){
              this.checkNameSpinner = false
              this.canUseName = false
              this.existSchoolName = false
              this.formType = type
              if(type == 'new'){
                this.schooldata.school_grades_id = []
              }
          }
      },
      watch : {
          sizeData: function(){
                this.currentPage = 1
                this.searchSchool()
          },
          searchParam: function(){
              var validateSrch = !this.searchParam ? '' : this.searchParam;
              if(validateSrch.length>=3 || validateSrch == ''){
                  this.searchSchool()
              }     
          },
          depSelected: function(){
              if(this.formType == 'new')
              {
                  this.provSelected = null
              }
              this.allPronvicies()
          },
          provSelected: function(){
              if(this.formType == 'new')
              {
                  this.schooldata.id_distrito = null
              }
              this.allDistricts()
          }
      },
      components :{
         'alert': VueStrap.alert,
         'modal' : VueStrap.modal,     
         'vue-simple-spinner': Spinner
      }
    }
</script>

