<template>
  <div>    
    <div class="container panel panel-default">
      <div class="panel-body" @submit.prevent="validateBeforeSubmit">
        <div class="row" align="center">
          <h4 v-if="utilFormType == 'new'">Registrar Lista de Útiles</h4>
          <h4 v-if="utilFormType == 'edit'">Editar Util</h4>
          <h4 v-if="utilFormType == 'view'">Ver Util</h4>
          </br>
        </div>
      <div class="row">
        <form class="form-horizontal">
          <div class="form-group">
            <label class="control-label col-sm-2">Colegio:</label>
            <div class="col-sm-8" :class="{'has-error': errors.has('utilData.id_colegio')}">
              <select @change="verifyPeriod()" v-model="utilData.id_colegio" class="form-control input-sm" data-vv-rules="required" v-validate.initial="utilData.id_colegio" :disabled="utilFormType == 'view' || utilFormType == 'edit'">
                <option value=""></option>
                <option value="" v-for="school in schools" v-bind:value="school.id_colegio">
                  {{school.des_colegio}}
                </option>
              </select>
              <p class="text-danger" v-if="errors.has('utilData.id_colegio')">Colegio es requerido</p>
            </div>
            <div class="col-sm-2">
              <button type="button" class="btn btn-success btn-sm" v-if="utilFormType != 'view' " @click="openSchoolModal()">Nuevo</button>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="pwd">Grado:</label>
            <div class="col-sm-8" :class="{'has-error': errors.has('utilData.id_grado_escolar')}"> 
              <select @change="verifyPeriod()" v-model="utilData.id_grado_escolar" class="form-control input-sm" data-vv-rules="required" v-validate.initial="utilData.id_grado_escolar" :disabled="utilFormType == 'view' || utilFormType == 'edit'">
                <option value=""></option>
                <option value="" v-for="grade in schoolGrades" v-bind:value="grade.id_grado_escolar">
                  {{grade.des_grado_escolar}}
                </option>
              </select>
              <p class="text-danger" v-if="errors.has('utilData.id_grado_escolar')">Grado es requerido</p>
            </div>
            <div class="col-sm-2">
              <button class="btn btn-success btn-sm" v-if="utilFormType != 'view' ">Nuevo</button>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="pwd">Periodo:</label>
            <div class="col-sm-4">
              <input v-model="utilData.periodo" type="text" class="form-control input-sm" :disabled="true">
              <span class="label label-success" v-if="verifyParam == true">Periodo disponible</span>
              <span class="label label-danger" v-if="verifyParam == false">Periodo ya registrado</span>
            </div>
            <div class="col-sm-4">
              <button class="btn btn-danger btn-sm" type="button" @click="verifyPeriod()" v-if="utilFormType != 'view' ">Verificar</button>
            </div>
          </div>
          <div class="form-group" :class="{'has-error': errors.has('utilData.id_lista_archivo')}">
            <label class="control-label col-sm-2" for="pwd">Cod Lista:</label>
            <div class="col-sm-8"> 
              <input v-model="utilData.id_lista_archivo" type="text" class="form-control input-sm" data-vv-rules="required" v-validate.initial="utilData.id_lista_archivo" :disabled="utilFormType == 'view'">
              <p class="text-danger" v-if="errors.has('utilData.id_lista_archivo')">Código es requerido</p>
            </div>            
          </div>
        </form>
      </div>
      <div class="row" v-if="utilFormType != 'view'">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-2">Grupo producto:</label>
              <div class="col-sm-6">
                  <v-select
                    :debounce="250"
                    :on-search="searchProductGroups"
                    :options="productGroupList"
                    placeholder="Buscar..."
                    label="des_grupo_producto"
                    :on-change="productSelected"
                  >
                  </v-select>
              </div>
              <label class="control-label col-sm-1">Cantidad:</label>
              <div class="col-sm-2">
                <input v-model="tempProductGroup.cantidad" type="number" class="form-control input-sm"  min="0">
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-2" for="email">Des detalle:</label>
              <div class="col-sm-6">
                <input v-model="tempProductGroup.des_detalle" type="text" class="form-control input-sm">
              </div>              
              <div class="col-sm-2">
                <button class="btn btn-primary" @click="addProduct()" type="button" v-if="utilFormType != 'view' "> <span class="glyphicon glyphicon-plus"></span></button>
              </div>
            </div>
          </form>
      </div>
      <div class="row">
              <table class="table table-striped table-bordered table-condensed">
                <thead>
                  <tr>
                    <th>Grupo Producto</th>
                    <th>Des detalle</th>
                    <th>Cantidad</th> 
                    <th v-if="utilFormType != 'view' ">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, index) in utilData.grupo_producto">
                    <td >
                      {{product.des_grupo_producto}}
                    </td>
                    <td>
                      {{product.des_detalle}}
                    </td>
                    <td>
                      {{product.cantidad}}
                    </td>
                    <td v-if="utilFormType != 'view' ">
                      <button class="btn btn-danger btn-sm" @click="removeProduct(index)">Eliminar</button>
                    </td>
                  </td>
                  </tr>
                </tbody>
              </table>
      </div>
        <hr>
        <div class="row" align="center">
          <button class="btn btn-primary" @click="saveUtil()"  v-if="utilFormType != 'view' ">Guardar</button>
          <button class="btn btn-danger">Cancelar</button>
        </div>
      </div>      
    </div>

    <!-- school modal -->
    <modal :show.sync="schoolModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header" align="center">
        <h4 class="modal-title">
        Registro de Colegio
        </h4>
      </div>
      <div slot="modal-body" class="modal-body">
          <div @submit.prevent="validateBeforeSubmitSchool" class="my-form">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="control-label col-sm-4">ID:</label>
                            <div class="col-sm-8">
                                <input :disabled="true" type="number" v-model ="schooldata.id_colegio" class="form-control input-sm" >
                            </div>
                        </div>
                        <div class="form-group" :class="{'has-error': errors.has('schooldata.des_colegio') }">
                            <label class="control-label col-sm-4" >Colegio:</label>
                            <div class="col-sm-8">
                                <input v-validate.initial="schooldata.des_colegio" @change="existsSchoolName()" data-vv-rules="required" type="text" v-model ="schooldata.des_colegio" class="form-control input-sm">
                                <p class="text-danger" v-if="errors.has('schooldata.des_colegio')">Nombre es requerido</p>
                                <vue-simple-spinner v-if="checkNameSpinner" size="small" message="Validando Nombre..." :speed="0.4"></vue-simple-spinner>                                
                                <span v-if="canUseName" class="label label-success">Nombre validado</span>
                                <span v-if="existSchoolName" class="label label-danger">Este nombre ya existe</span>
                            </div>
                        </div>                    
                        <div class="form-group">
                            <label class="control-label col-sm-4" >Observacion:</label>
                            <div class="col-sm-8">
                                <textarea class="form-control input-sm" rows="5" v-model ="schooldata.observacion"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-horizontal">
                        <div class="form-group" :class="{'has-error': errors.has('depSelected')}">
                            <label class="control-label col-sm-4">Departamento:</label>                        
                            <div class="col-sm-8">
                                    <select v-validate.initial="depSelected"  data-vv-rules="required" class="form-control input-sm" v-model="depSelected">
                                        <option value=""></option>  
                                        <option v-bind:value="department.id_departamento" v-for="department in departments">{{department.des_departamento}}</option>
                                    </select>
                                    <p class="text-danger" v-if="errors.has('depSelected')">Departamento es requerido</p>
                            </div>
                        </div>
                        <div class="form-group" :class="{'has-error': errors.has('provSelected')}">
                            <label class="control-label col-sm-4" >Provincia:</label>
                            <div class="col-sm-8">
                                    <select v-validate.initial="provSelected"  data-vv-rules="required" class="form-control input-sm" v-model="provSelected" :disabled="depSelected == '' || depSelected == null">
                                        <option value=""></option>  
                                        <option v-bind:value="province.id_provincia" v-for="province in provincies">{{province.des_provincia}}</option>
                                    </select>
                                    <p class="text-danger" v-if="errors.has('provSelected')">Provincia es requerida</p>
                            </div>
                        </div>                    
                        <div class="form-group" :class="{'has-error': errors.has('schooldata.id_distrito')}">
                            <label class="control-label col-sm-4" >Distrito:</label>
                            <div class="col-sm-8">                            
                                    <select v-validate.initial="schooldata.id_distrito"  data-vv-rules="required" class="form-control input-sm" v-model="schooldata.id_distrito" :disabled="provSelected =='' || provSelected == null ">
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
      <div slot="modal-footer" class="modal-footer">          
        <button type="button" class="btn btn-danger" @click="saveSchool()">Guardar</button>
        <button type="button" class="btn btn-primary" @click="closeSchoolModal()">Cancelar</button>        
      </div>
    </modal>
    <!-- fin school modal-->

  </div>
</template>
<style>
body, .panel, .form-control{
  /*background-color: black;*/
}
</style>

<script>
import VueStrap from 'vue-strap'
import vueSelect from 'vue-select'
import swal from 'sweetalert2'

  export default{
    data(){
      return {
        //schoolModal
        schoolModal : false,
        canUseName: false,
        schooldata : {},
        checkNameSpinner : false,
        existSchoolName: false,
        depSelected : null,
        provSelected : null,
        provincies: [],
        departments: [],
        districts: [],

        utilFormType: null,
        verifyParam : null,
        syncedVal: null,
        schools : {},
        schoolGrades : [],
        parameter : {},
        productGroupList:[],
        utilData: {
          periodo : 0,
          grupo_producto : []
        },
        tempProductGroup : {
          cantidad : 0,
          id_grupo_producto : null
        }
      }
    },
    created(){
      this.initform()
      this.getSchools()
      this.getSchoolGrades()
      this.getParameter(1)
      this.getProductGroup()      
    },
    methods : {
    openSchoolModal(){
      this.schoolModal = true
    },
    closeSchoolModal(){
      this.schoolModal = false
    },
    searchProductGroups(q, loading){
      loading(true)
      console.log("searching" + q)
      this.$http.get("api/search-product-group/"+q)
        .then(response=>{
          this.productGroupList = response.body.data
          console.log(this.productGroupList)
          loading(false)
        })
    },
    initform(){
      this.utilFormType = this.$route.meta.type
      if(this.utilFormType == "edit" || this.utilFormType == "view"){
        var id = this.$route.params.id
        this.getUtil(id)
      }      
    },
    validateBeforeSubmit(){
        this.$validator.validateAll()
    },
    validateBeforeSubmitSchool(){
      console.log(this.$validator)
      this.$validator.validateAll()
    },
    verifyPeriod(){
      if(this.utilData.id_colegio && this.utilData.id_grado_escolar){
        this.$http.post("api/verify-period",
          {
            id_colegio: this.utilData.id_colegio,
            id_grado_escolar: this.utilData.id_grado_escolar,
            period : this.utilData.periodo
            }).then(response=>{
            this.verifyParam = response.body.result
        }) 
      }     
    },
    getUtil(id){
      this.$http.get("api/util/"+id).then(response=>{
        this.utilData =  response.body
      })
    },
    productSelected(item){
      this.tempProductGroup = item
    },
    getProductGroup(){
      this.$http.get("api/product-group").then(response=>{
        //this.productGroupList = response.body
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
    getParameter(id){
      this.$http.get("api/parameter/"+id).then(response=>{
        this.utilData.periodo = response.body.valor_parametro        
      })
    },
    addProduct(){
      if(this.tempProductGroup.des_grupo_producto && this.tempProductGroup.cantidad && this.tempProductGroup.des_detalle){
        this.utilData.grupo_producto.push(this.tempProductGroup)
        this.tempProductGroup = {}
      }
    },
    removeProduct(index){
        this.utilData.grupo_producto.splice(index, 1)
    },
    saveUtil(){
      this.$validator.validateAll().then((res)=>{
        if(res){
          if(this.utilFormType == "new"){
            this.saveU()
          }
          else if(this.utilFormType == "edit"){
            this.updateU()
          }
        }        
      });
    },
    saveU(){
          this.$http.post("api/util", this.utilData).then(response=>{
            swal({
                position: 'top-right',
                type: 'success',
                title: 'Guardado exitosamente',
                showConfirmButton: false,
                timer: 1700                        
            }).then(()=>{
                
            })
          }, (error)=>{
              var message = error.body.errors ? error.body.errors : 'Hubo un error al guardar'
                  swal(
                      'Oops...',
                      message,
                      'error'
                  )
          })
    },
    updateU(){
      this.$http.put("api/util/"+this.$route.params.id, this.utilData).then(response=>{
            console.log(response)
            swal({
                position: 'top-right',
                type: 'success',
                title: 'Guardado exitosamente',
                showConfirmButton: false,
                timer: 1700                        
            }).then(()=>{
                
            })
          }, (error)=>{
              var message = error.body.errors ? error.body.errors : 'Hubo un error al guardar'
                  swal(
                      'Oops...',
                      message,
                      'error'
                  )
          })
    }
    },
    watch : {

    },
    components :{
      'v-select' : vueSelect,
      'modal' : VueStrap.modal,
    }
  }
</script>