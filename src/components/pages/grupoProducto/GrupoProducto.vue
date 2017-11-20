<template>
  <div class="container">
        <div class="row" align="center">
            <div class="col-md-12">
                <h3>Listar Grupo-Producto</h3>
                <hr>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <button class="btn btn-success" @click="openNewModal()">Nuevo</button>
            </div>
        </div>
        </br>
        <div class="row">
            <div class="col-md-4">
                  <div class="form-horizontal">
                        <div class="form-group">
                            <label class="control-label col-sm-1">Ver</label>
                            <div class="col-sm-4">
                                <input type="number" class="form-control input-sm" >                                
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
      <br>    
      <div class="row">
          <div class="col-md-12">
                <table class="table table-striped table-bordered table-condensed">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Grupo Producto</th>
                        <th>Código</th>
                        <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>TEST</td>
                            <td>ME342</td>
                            <td>
                                <button class="btn btn-info btn-sm" @click="openViewModal();">Ver</button>
                                <button class="btn btn-primary btn-sm"@click="openNewModal(); getSchool(school.id_colegio); changeFormType('edit')">Editar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            <!--<vue-simple-spinner v-if="showSpinner" size="large" message="Cargando..." :speed="0.4"></vue-simple-spinner>-->    
          </div>
      </div>
      <div class="row" align="center">
            <ul class="pagination">
                <li><a href="#">1</a></li>
                <li class="active"><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">5</a></li>
            </ul>
      </div>

    <modal :show.sync="modalNewIsOpen" effect="fade" width="400">
        <div slot="modal-header" class="modal-header" align="center">
            <h4 class="modal-title">
            Registrar Grupo Poducto
            </h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <div class="my-form">            
                <div class="row">
                    <div class="col-md-10 col-md-offset-2">
                        <form class="form-inline">
                            <div class="form-group col-md-12">
                                <label class="col-md-4">ID:</label>
                                <input type="number" class="form-control col-md-8 input-sm" id="email">
                            </div>
                            <div class="form-group col-md-12">
                                <label class="col-md-4">Grupo Producto:</label>
                                <input type="text" class="form-control col-md-8 input-sm" id="pwd">
                            </div>
                             <div class="form-group col-md-12">
                                <label class="col-md-4">Código:</label>
                                <input type="text" class="form-control col-md-8 input-sm" id="pwd">
                            </div>
                             <div class="form-group col-md-12">
                                <label class="col-md-4">Color:</label>
                                <input type="text" class="form-control col-md-8 input-sm" id="pwd">
                            </div>
                        </form>
                    </div>
                </div>
                <br>
                <div class="row">
                        <div class="col-md-5">
                            <input
                            type="text"
                            class="form-control input-sm"
                            placeholder="Buscar producto...">
                        </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-md-5">
                        <table class="table table-striped table-bordered table-condensed">
                        <thead>
                            <tr>
                            <th></th>
                            <th>Producto</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>TEST</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    <div class="col-md-2">
                       <span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>
                    </div>
                    <div class="col-md-5">
                        <table class="table table-striped table-bordered table-condensed">
                        <thead>
                            <tr>
                            <th>Producto</th>
                            <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>test2</td>
                                <td>Eliminar</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div slot="modal-footer" class="modal-footer">          
            <button type="button" class="btn btn-danger" @click="saveOrUpdateSchool()">Guardar</button>
            <button type="button" class="btn btn-primary" @click="closeModal()">Cancelar</button>        
        </div>
    </modal>
    <modal :show.sync="viewModalIsOpen" effect="fade" width="400">
        <div slot="modal-header" class="modal-header" align="center">
            <h4 class="modal-title">
            Registrar Grupo Poducto
            </h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <div class="my-form">            
                <div class="row">
                    <div class="col-md-12">
                        <form class="form-horizontal">
                            <div class="form-group col-md-12">                           
                                <label class="control-label col-sm-4" for="email">ID:</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control input-sm" id="email">
                                </div>
                            </div>
                            <div class="form-group col-md-12">
                                <label class="control-label col-sm-4" for="email">Grupo Producto:</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control input-sm" id="pwd">
                                </div>
                            </div>
                             <div class="form-group col-md-12">
                                <label class="control-label col-sm-4" for="email">Código:</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control input-sm" id="pwd">
                                </div>
                            </div>
                             <div class="form-group col-md-12">
                                <label class="control-label col-sm-4" for="email">Color:</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control input-sm" id="pwd">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="row">                  
                    <div class="col-md-12">
                        <table class="table table-striped table-bordered table-condensed">
                        <thead>
                            <tr>
                            <th>Producto</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>test2</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div slot="modal-footer" class="modal-footer">          
            <button type="button" class="btn btn-danger" @click="saveOrUpdateSchool()">Guardar</button>
            <button type="button" class="btn btn-primary" @click="closeViewModal()">Cancelar</button>        
        </div>
    </modal>
  </div>
</template>

<style>

</style>

<script>
    import VueStrap from 'vue-strap'
    import Spinner from 'vue-simple-spinner'
    import swal from 'sweetalert2'

    export default{
        data(){
           return {
                modalNewIsOpen : false,
                viewModalIsOpen : false
           }
        },
        methods : {
          openNewModal() {
              this.modalNewIsOpen = true
          },
          closeModal(){
              this.modalNewIsOpen = false
          },
         openViewModal() {
              this.viewModalIsOpen = true
          },
         closeViewModal(){
              this.viewModalIsOpen = false
          }
        },
        components :{
         'alert': VueStrap.alert,
         'modal' : VueStrap.modal,
         'vue-simple-spinner': Spinner
      }
    }
</script>
