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
              <select @change="verifyPeriod(); getGrades()" v-model="utilData.id_colegio" class="form-control input-sm" data-vv-rules="required" v-validate.initial="utilData.id_colegio" :disabled="utilFormType == 'view'">
                <option value=""></option>
                <option value="" v-for="school in schools" v-bind:value="school.id_colegio">
                  {{school.des_colegio}}
                </option>
              </select>
              <p class="text-danger" v-if="errors.has('utilData.id_colegio')">Colegio es requerido</p>
            </div>
            <div class="col-sm-1">
              <a href="/colegio/crear" target="_blank" class="btn btn-success btn-sm" v-if="utilFormType != 'view' ">Nuevo</a>
            </div>
            <div class="col-sm-1">
              <button class="btn btn-info btn-sm" @click="getSchools()" v-if="utilFormType != 'view' "><span class="glyphicon glyphicon-refresh"></span></button>
            </div>
            
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="pwd">Grado:</label>
            <div class="col-sm-8" :class="{'has-error': errors.has('utilData.id_grado_escolar')}"> 
              <select @change="verifyPeriod()" v-model="utilData.id_grado_escolar" class="form-control input-sm" data-vv-rules="required" v-validate.initial="utilData.id_grado_escolar" :disabled="utilFormType == 'view'">
                <option value=""></option>
                <option value="" v-for="grade in schoolGrades" v-bind:value="grade.id_grado_escolar">
                  {{grade.des_grado_escolar}}
                </option>
              </select>
              <p class="text-danger" v-if="errors.has('utilData.id_grado_escolar')">Grado es requerido</p>
            </div>
            <div class="col-sm-1" v-if="utilData.id_colegio">
              <router-link :to="'/colegio/'+utilData.id_colegio+'/editar'" target="_blank" class="btn btn-success btn-sm link-button">
                <a >Añadir</a>
              </router-link>              
            </div>
            <div class="col-sm-1" v-if="utilData.id_colegio">
              <button class="btn btn-info btn-sm" @click="getSchools()" v-if="utilFormType != 'view' "><span class="glyphicon glyphicon-refresh"></span></button>
            </div>
            <!--
            <div class="col-sm-2">
              <button class="btn btn-success btn-sm" v-if="utilFormType != 'view' ">Nuevo</button>
            </div>
            -->
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
              <input v-model="utilData.id_lista_archivo" type="text" class="form-control input-sm" data-vv-rules="required" v-validate.initial="utilData.id_lista_archivo" :disabled="true">
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
              <label class="control-label col-sm-1 cant">Cantidad:</label>
              <div class="col-sm-2">
                <input v-model="tempProductGroup.cantidad" type="number" class="form-control input-sm"  min="0">
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-2" for="email">Referencia:</label>
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
            <table class="table table-striped table-condensed">
            <thead>
              <tr>
                  <th class="col-xs-3">Grupo Producto</th>
                  <th class="col-xs-3">Des detalle</th>
                  <th class="col-xs-3">Cantidad</th> 
                  <th v-if="utilFormType != 'view' " class="col-xs-3">Acción</th>
              </tr>
            </thead>
          </table>
          <div class="table-container">
            <table class="table table-striped table-condensed">
              <tbody>
                  <tr v-for="(product, index) in utilData.grupo_producto">
                    <td class="col-xs-3">
                      {{product.des_grupo_producto}}
                    </td>
                    <td class="col-xs-3">
                      {{product.des_detalle}}
                    </td>
                    <td class="col-xs-3">
                      {{product.cantidad}}
                    </td>
                    <td v-if="utilFormType != 'view' " class="col-xs-3">
                      <button class="btn btn-danger btn-sm" @click="removeProduct(index)">Eliminar</button>
                    </td>
                  </td>
                  </tr>
              </tbody>
            </table>
          </div>
      </div>
        <hr>
        <div class="row" align="center">
          <button class="btn btn-primary" @click="saveUtil()"  v-if="utilFormType != 'view' ">Guardar</button>
          <button class="btn btn-danger" @click="cancel()">Cancelar</button>
        </div>
      </div>      
    </div>
  </div>
</template>
<style>
body, .panel, .form-control{
  /*background-color: black;*/
}
.cant{
    margin-right: 20px;
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
import vueSelect from 'vue-select'
import swal from 'sweetalert2'

  export default{
    data(){
      return {
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
          cantidad : 1,
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
    searchProductGroups(q, loading){
      if(q.length>=3){
        loading(true)      
        this.$http.get("api/search-product-group/"+q)
        .then(response=>{
          this.productGroupList = response.body.data
          loading(false)
        })
      }
    },
    initform(){      
      this.utilFormType = this.$route.meta.type
      if(this.$route.query.listaArchivoId){
        this.utilData.id_lista_archivo = this.$route.query.listaArchivoId
      }      
      if(this.utilFormType == "edit" || this.utilFormType == "view"){
        var id = this.$route.params.id
        this.getUtil(id)
      }      
    },
    validateBeforeSubmit(){
        this.$validator.validateAll()
    },
    validateBeforeSubmitSchool(){
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
      this.tempProductGroup.cantidad = 1
    },
    getProductGroup(){
      this.$http.get("api/product-group").then(response=>{
        //this.productGroupList = response.body
      })
    },
    getSchools(){
      this.$http.get("api/school").then(response=>{
        this.schools = response.body
        this.getGrades()
        //console.log(this.schools)
      })
    },
    getGrades(){
      this.schools.filter((elem)=>{        
        if(elem.id_colegio == this.utilData.id_colegio){
          this.schoolGrades = elem.school_grades
          
        }
        })
    },
    getSchoolGrades(){
      /*
      this.$http.get("api/school-grade").then(response=>{
        //this.schoolGrades = response.body
      })
      */
    },
    getParameter(id){
      this.$http.get("api/parameter/"+id).then(response=>{
        this.utilData.periodo = response.body.valor_parametro        
      })
    },
    addProduct(){
      var check  = []
      check = this.utilData.grupo_producto.filter((felem)=>{
          if(felem.cod_grupo_producto == this.tempProductGroup.cod_grupo_producto){
              return felem
          }
      })
      
      if(this.tempProductGroup.des_grupo_producto && this.tempProductGroup.cantidad>0 && this.tempProductGroup.des_detalle){
            if(check.length== 0){
              this.utilData.grupo_producto.push(this.tempProductGroup)
            }
            else{
                swal(
                'Oops...',
                'El grupo producto ya ha sido añadido',
                'error'
                )
            }
        }
        else{                    
            swal(
                'Oops...',
                'Complete todos los campos del grupo producto',
                'error'
            )
        }      
    }
    ,
    removeProduct(index){
        this.utilData.grupo_producto.splice(index, 1)
    },
    saveUtil(){      
      this.$validator.validateAll().then((res)=>{
          if(res){
            if(this.utilData.grupo_producto.length>0){
              if(this.utilFormType == "new"){
                this.saveU()
              }
              else if(this.utilFormType == "edit"){
                this.updateU()
              }
            }
            else{              
              swal( 'Oops...', 'Añada por lo menos un grupo producto','error')
            }
          }
      });
    },
    cancel(){      
      this.$router.push("/utiles")
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
                this.$router.push("/utiles")
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
            swal({
                position: 'top-right',
                type: 'success',
                title: 'Guardado exitosamente',
                showConfirmButton: false,
                timer: 1700                        
            }).then(()=>{
                this.$router.push("/utiles")
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
      'v-select' : vueSelect
    }
  }
</script>