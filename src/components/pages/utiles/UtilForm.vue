<template>
  <div>    
    <div class="container panel panel-default">
      <div class="panel-body">        
              <div class="row" align="center">
        <h4>Registrar Lista de Útiles</h4>
        </br>
      </div>
      <div class="row">
        <form class="form-horizontal">
          <div class="form-group">
            <label class="control-label col-sm-2">Colegio:</label>
            <div class="col-sm-8">
              <select v-model="utilData.id_colegio" name="" id="" class="form-control input-sm">
                <option value=""></option>
                <option value="" v-for="school in schools" v-bind:value="school.id_colegio">
                  {{school.des_colegio}}
                </option>
              </select>
            </div>
            <div class="col-sm-2">
              <button class="btn btn-success btn-sm">Nuevo</button>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="pwd">Grado:</label>
            <div class="col-sm-8"> 
              <select v-model="utilData.id_grado_escolar" name="" id="" class="form-control input-sm">
                <option value=""></option>
                <option value="" v-for="grade in schoolGrades" v-bind:value="grade.id_grado_escolar">
                  {{grade.des_grado_escolar}}
                </option>
              </select>
            </div>
            <div class="col-sm-2">
              <button class="btn btn-success btn-sm">Nuevo</button>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="pwd">Periodo:</label>
            <div class="col-sm-4"> 
              <input v-model="utilData.periodo" type="text" class="form-control input-sm" :disabled="true">
            </div>
            <div class="col-sm-4">
              <button class="btn btn-danger btn-sm">Verificar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="pwd">Cod Lista:</label>
            <div class="col-sm-8"> 
              <input v-model="utilData.id_lista_archivo" type="text" class="form-control input-sm">
            </div>            
          </div>
        </form>
      </div>
      <div class="row">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-2">Grupo producto:</label>
              <div class="col-sm-4">
                <input v-model="tempProductGroup.grupo_producto" type="text" class="form-control input-sm" placeholder="Buscar">
              </div>
              <label class="control-label col-sm-2">Cantidad:</label>
              <div class="col-sm-2">
                <input v-model="tempProductGroup.cantidad" type="number" class="form-control input-sm" >
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
                      {{product.grupo_producto}}
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
      <pre>{{utilData}}</pre>
      <pre>{{tempProductGroup}}</pre>
        <hr>
        <div class="row" align="center">
          <button class="btn btn-primary" @click="saveUtil()">Guardar</button>
          <button class="btn btn-danger">Cancelar</button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        schools : {},
        schoolGrades : {},
        parameter : {},
        utilData: {
          periodo : 0,
          grupo_producto : []
        },
        tempProductGroup : {}
      }
    },
    created(){
      this.getSchools()
      this.getSchoolGrades()
      this.getParameter(1)
    },
    methods : {
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
      if(this.tempProductGroup.grupo_producto){
        this.utilData.grupo_producto.push(this.tempProductGroup)
        this.tempProductGroup = {}
      }
    },
    removeProduct(index){
        this.utilData.grupo_producto.splice(index, 1)
    },
    saveUtil(){
      this.$http.post("api/util", this.utilData).then(response=>{
                
      })
    }
    }
  }
</script>