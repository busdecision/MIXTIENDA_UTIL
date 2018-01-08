<template>
    <div>
        <div class="container panel panel-default">
            <div class="panel-body">
                    <div class="row">
                        <!--<div :show.sync="modalNewIsOpen" :on-close="closeModal" effect="fade" width="400" @showchange="updateShowDialog">-->
                    <div align="center">
                        <h3 class="modal-title">
                            <span v-if="formType == 'new' ">Registro de Colegio</span>
                            <span v-if="formType == 'edit' ">Actualizar Colegio</span>
                        </h3>
                    </div>
                    <hr>
                    <br>
                    <div>
                        <div @submit.prevent="validateBeforeSubmit" class="my-form">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-horizontal">
                                        <div class="form-group" v-if="formType == 'edit'">
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
                    <div align="center">          
                        <button type="button" class="btn btn-danger" v-if="formType != 'view' "@click="saveOrUpdateSchool()">Guardar</button>
                        <button type="button" class="btn btn-primary">Cancelar</button>        
                    </div>
                    </div>
            </div>
        </div>    
    </div>
</template>
<style>

</style>

<script>
    import Spinner from 'vue-simple-spinner'
    import swal from 'sweetalert2'

    export default {
        data(){
            return {
                formType : "new",
                schooldata :{
                    school_grades_id : [],
                    id_distrito: null
                },
                schools: [],
                provincies: [],
                departments: [],
                schoolGrades: [],
                districts: [],
                checkNameSpinner: false,
                canUseName: false,
                existSchoolName: false,
                depSelected : null,
                provSelected : null
            }
        },
        created(){
            this.initForm()
            this.allDistricts()
            this.allPronvicies()
            this.allDepartments()
            this.allSchoolGrades()            
        },
        methods : {
            initForm(){
                var type = this.$route.meta.type
                this.formType = type == "create" ? 'new' : 'edit'
                if(type == 'edit'){
                    this.getSchool(this.$route.params.id)
                }
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
          allSchoolGrades(){
            this.$http.get("api/school-grade")
              .then(response=>{
                  this.schoolGrades = response.body
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
                    swal({
                        position: 'top-right',
                        type: 'success',
                        title: 'Guardado exitosamente',
                        showConfirmButton: false,
                        timer: 1700                        
                    }).then(()=>{
                        this.$router.go("/colegio")
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
                    swal({
                        position: 'top-right',
                        type: 'success',
                        title: 'Guardado exitosamente',
                        showConfirmButton: false,
                        timer: 1500,                        
                    }).then(()=>{                      
                        this.$router.go("/colegio")
                    })                    
                }, (error) =>{
                    swal(
                        'Oops...',
                        'Hubo un error al guardar',
                        'error'
                    )
                })
          }
        },
        watch : {
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
         'vue-simple-spinner': Spinner
      }
    }
</script>