<template>
  <div>    
    <div class="container panel panel-default">
      <div class="panel-body" @submit.prevent="validateBeforeSubmit">
        <div class="row" align="center">
          <h4>Registrar Lista de Útiles</h4>
          </br>
        </div>
      <div class="row">
        <form class="form-horizontal">
          <div class="form-group">
            <label class="control-label col-sm-2">Colegio:</label>
            <div class="col-sm-8" :class="{'has-error': errors.has('utilData.id_colegio')}">
              <select v-model="utilData.id_colegio" class="form-control input-sm" data-vv-rules="required" v-validate.initial="utilData.id_colegio">
                <option value=""></option>
                <option value="" v-for="school in schools" v-bind:value="school.id_colegio">
                  {{school.des_colegio}}
                </option>
              </select>
              <p class="text-danger" v-if="errors.has('utilData.id_colegio')">Colegio es requerido</p>
            </div>
            <div class="col-sm-2">
              <button class="btn btn-success btn-sm">Nuevo</button>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="pwd">Grado:</label>
            <div class="col-sm-8" :class="{'has-error': errors.has('utilData.id_grado_escolar')}"> 
              <select v-model="utilData.id_grado_escolar" class="form-control input-sm" data-vv-rules="required" v-validate.initial="utilData.id_grado_escolar">
                <option value=""></option>
                <option value="" v-for="grade in schoolGrades" v-bind:value="grade.id_grado_escolar">
                  {{grade.des_grado_escolar}}
                </option>
              </select>
              <p class="text-danger" v-if="errors.has('utilData.id_grado_escolar')">Grado es requerido</p>
            </div>
            <div class="col-sm-2">
              <button class="btn btn-success btn-sm">Nuevo</button>
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
              <button class="btn btn-danger btn-sm" type="button" @click="verifyPeriod()">Verificar</button>
            </div>
          </div>
          <div class="form-group" :class="{'has-error': errors.has('utilData.id_lista_archivo')}">
            <label class="control-label col-sm-2" for="pwd">Cod Lista:</label>
            <div class="col-sm-8"> 
              <input v-model="utilData.id_lista_archivo" type="text" class="form-control input-sm" data-vv-rules="required" v-validate.initial="utilData.id_lista_archivo">
              <p class="text-danger" v-if="errors.has('utilData.id_lista_archivo')">Código es requerido</p>
            </div>            
          </div>
        </form>
      </div>
      <div class="row">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-2">Grupo producto:</label>
              <div class="col-sm-6">
                <v-select                  
                  :options="productGroupList"        
                  label="des_grupo_producto"
                  :on-change="productSelected"
                ></v-select>
              </div>
              <label class="control-label col-sm-1">Cantidad:</label>
              <div class="col-sm-2">
                <input v-model="tempProductGroup.cantidad" type="number" class="form-control input-sm"  min="0">
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-2" for="email">Des detalle:</label>
              <div class="col-sm-6">
                <input v-model="tempProductGroup.detalle" type="text" class="form-control input-sm">
              </div>              
              <div class="col-sm-2">
                <button class="btn btn-primary" @click="addProduct()" type="button"> <span class="glyphicon glyphicon-plus"></span></button>
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
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, index) in utilData.grupo_producto">
                    <td >
                      {{product.des_grupo_producto}}
                    </td>
                    <td>
                      {{product.detalle}}
                    </td>
                    <td>
                      {{product.cantidad}}
                    </td>
                    <td>
                      <button class="btn btn-danger btn-sm" @click="removeProduct(index)">Eliminar</button>
                    </td>
                  </td>
                  </tr>
                </tbody>
              </table>
      </div>
        <hr>
        <div class="row" align="center">
          <button class="btn btn-primary" @click="saveUtil()">Guardar</button>
          <button class="btn btn-danger">Cancelar</button>
        </div>
      </div>      
    </div>
  </div>
</template>
<style>
body, .panel, .form-control{
  /*background-color: black;*/
}
</style>

<script>
import vueSelect from 'vue-select'
import swal from 'sweetalert2'

  export default{
    data(){
      return {
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
      this.getSchools()
      this.getSchoolGrades()
      this.getParameter(1)
      this.getProductGroup()
    },
    methods : {
    validateBeforeSubmit(){
        this.$validator.validateAll();
    },
    verifyPeriod(){
      this.$http.post("api/verify-period",
          {
            id_colegio: this.utilData.id_colegio,
            id_grado_escolar: this.utilData.id_grado_escolar,
            period : this.utilData.periodo
            }).then(response=>{
        this.verifyParam = response.body.result
      })      
    },
    productSelected(item){
      this.tempProductGroup = item
    },
    getProductGroup(){
      this.$http.get("api/product-group").then(response=>{
        this.productGroupList = response.body
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
      if(this.tempProductGroup.des_grupo_producto){
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
        }        
      });
    }
    },
    components :{
      'v-select' : vueSelect
    }
  }
</script>