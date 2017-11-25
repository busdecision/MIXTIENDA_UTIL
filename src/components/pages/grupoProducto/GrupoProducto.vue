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
                <button class="btn btn-success" @click="openModal('new')">Nuevo</button>
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
                        <tr v-for ="group in productGroups">
                            <td>{{group.id_grupo_producto}}</td>
                            <td>{{group.des_grupo_producto}}</td>
                            <td>{{group.cod_grupo_producto}}</td>
                            <td>
                                <button class="btn btn-info btn-sm" @click="openModal('view'); findProductGroup(group.id_grupo_producto);">Ver</button>
                                <button class="btn btn-primary btn-sm"@click="openModal('edit'); findProductGroup(group.id_grupo_producto);">Editar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <vue-simple-spinner v-if="showSpinner" size="large" message="Cargando..." :speed="0.4"></vue-simple-spinner>
          </div>
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
    <modal :show.sync="modalIsOpen" effect="fade" width="400">
        <div slot="modal-header" class="modal-header" align="center">
            <h4 class="modal-title" v-if="formType == 'new'">Registrar Grupo Poducto</h4>
            <h4 class="modal-title" v-if="formType == 'edit'">Editar Grupo Poducto</h4>
            <h4 class="modal-title" v-if="formType == 'view'">Grupo Poducto</h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <div class="my-form" @submit.prevent="validateBeforeSubmit">            
                <div class="row">
                    <div class="col-md-12">
                        <form class="form-horizontal">
                            <div class="form-group col-md-12">                           
                                <label class="control-label col-sm-4" for="email">ID:</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control input-sm" v-model="groupProductData.id_grupo_producto" :disabled="true">
                                </div>
                            </div>
                            <div class="form-group col-md-12" :class="{'has-error': errors.has('groupProductData.des_grupo_producto')}">
                                <label class="control-label col-sm-4" for="email">Grupo Producto:</label>
                                <div class="col-sm-8">
                                    <input  type="text" class="form-control input-sm"
                                            data-vv-rules="required"
                                            v-validate.initial="groupProductData.des_grupo_producto"
                                            v-model="groupProductData.des_grupo_producto"
                                            :disabled="formType == 'view'">
                                    <p class="text-danger" v-if="errors.has('groupProductData.des_grupo_producto')">Grupo Producto es requerido</p>
                                </div>
                            </div>                  

                             <div class="form-group col-md-12" :class="{'has-error': errors.has('groupProductData.cod_grupo_producto')}">
                                <label class="control-label col-sm-4" for="email">Código:</label>
                                <div class="col-sm-8">
                                    <input  type="text" class="form-control input-sm"
                                            data-vv-rules="required"
                                            v-validate.initial="groupProductData.cod_grupo_producto"
                                            v-model="groupProductData.cod_grupo_producto"
                                            :disabled="formType == 'view'">
                                    <p class="text-danger" v-if="errors.has('groupProductData.cod_grupo_producto')">Código es requerido</p>
                                </div>
                            </div>
                             <div class="form-group col-md-12" :class="{'has-error': errors.has('groupProductData.id_color')}">
                                <label class="control-label col-sm-4" for="email">Color:</label>
                                <div class="col-sm-8">
                                    <select name="" class="form-control input-sm" data-vv-rules="required" v-validate.initial="groupProductData.id_color" v-model="groupProductData.id_color" :disabled="formType == 'view'">
                                        <option value="" v-for="color in colors" v-bind:value="color.id_color">
                                            {{color.des_color}}
                                        </option>
                                    </select>
                                    <p class="text-danger" v-if="errors.has('groupProductData.id_color')">Color es requerido</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="row" v-if="formType == 'view'">
                    <div class="col-md-12">
                        <table class="table table-striped table-bordered table-condensed">
                        <thead>
                            <tr>
                            <th>Productos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in groupProductData.product">
                                <td>{{product.description}}</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
                <div class="cont" v-if="formType == 'new' || formType == 'edit' ">
                    <div class="row">
                        <div class="col-md-5">
                            <input
                            v-model ="filterProduct"
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
                              <tr v-for ="product in products">
                                    <td align="center">
                                        <label>
                                            <input
                                                v-bind:value="product"
                                                type="checkbox"
                                                v-model="leftProductsSelected">
                                        </label>
                                    </td>
                                    <td >{{product.description}}</td>
                                </tr>
                            </tbody>                            
                            </table>
                        </div>
                        <div class="col-md-2 add-product">
                            <a @click="addProductsSelected()">
                                <span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>
                            </a>
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
                                <tr v-for="(product,index) in groupProductData.product">
                                    <td>{{product.description}}</td>
                                    <td>
                                        <button class="btn btn-danger btn-sm"@click="removeProduct(index)">Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div slot="modal-footer" class="modal-footer">          
            <button v-if="formType == 'edit' || formType == 'new'" type="button" class="btn btn-danger" @click="saveOrUpdateProductGroup()">Guardar</button>
            <button type="button" class="btn btn-primary" @click="closeModal()">
                <span v-if="formType == 'edit' || formType == 'new'">Cancelar</span>
                <span v-if="formType == 'view'">Cerrar</span>
            </button>
        </div>
    </modal>
  </div>
</template>

<style>
    .add-product{
        padding-top: 8%;
    }
    .add-product a{        
        background-color: transparent;
        border: none;
    }
    .add-product span{
        font-size: 60px;
        color: red;
        cursor:pointer;
    }
    .pagination{
        cursor: pointer;
    }
    .add-product span:hover{
        color: #A50000;
    }
    .add-product span:active{
        color: #7A0000;
    }
    .table tbody{
       font-size: 12px;
    }
</style>

<script>
    import VueStrap from 'vue-strap'
    import Spinner from 'vue-simple-spinner'
    import swal from 'sweetalert2'

    export default{
        data(){
           return {
                showSpinner : false,
                modalIsOpen : false,
                productGroups : [],
                currentPage : 1,
                sizeData : 10,
                filterProduct : null,
                searchParam : null,
                totalPages : 0,
                groupProductData : {
                    id_grupo_producto :  null,
                    product : [],
                    product_groups_id : []
                },
                leftProductsSelected : [],
                colors :{},
                products : {},
                formType : ''
           }
        },
        created(){
            this.searchProductGroups()
            this.getColors()
            this.getProducts()
        },
        methods : {
          validateBeforeSubmit(){
              this.$validator.validateAll();
          },
          searchProductGroups(){
            this.showSpinner = true
            this.$http.get("api/search-product-group/"+this.searchParam+"?size="+this.sizeData+"&page="+this.currentPage)
              .then(response=>{
                  this.showSpinner = false
                  this.productGroups = response.body.data
                  this.totalPages = response.body.last_page
              })
          },  
          openModal(type) {
              this.formType = type
              this.modalIsOpen = true
          },
          closeModal(){
              this.formType = ''
              this.modalIsOpen = false,
              this.leftProductsSelected = []
              this.groupProductData = {
                    product : [],
                    id_grupo_producto :  null,
                    product_groups_id : []
                }
          },
         getNumber(num){
            return new Array(num);
         },
         changePage(page){
             if(page != 0 && page <= this.totalPages){
                this.currentPage = page
                this.searchProductGroups()
             }             
         },
         getProducts(){
             this.$http.get("api/search-product/"+this.filterProduct).then((response)=>{
                 this.products = response.body
             });
         },
         getColors(){
             this.$http.get("api/color").then((response)=>{
                 this.colors = response.body
             });
         },
         findProductGroup(id){
             this.$http.get("api/product-group/"+id).then((response)=>{
                 this.groupProductData = response.body                 
             });
         },
         addProductsSelected(){
             this.leftProductsSelected.forEach(function(element) {
                 var exists = []
                 if(this.groupProductData.product.length>0){
                     exists = this.groupProductData.product.filter(function(felem){
                        if(felem.id_product == element.id_product){
                            return felem
                        }
                    })
                 }
                 if(exists.length==0){
                     this.groupProductData.product.push(element)                 
                 }                 
             }, this)
             this.leftProductsSelected = []             
         },
         removeProduct(index){
            this.groupProductData.product.splice(index, 1)
         },
         saveOrUpdateProductGroup(){
             this.$validator.validateAll().then((res)=>{
                  if(res == true){
                    if(this.formType=='new'){
                        this.saveProductGroup()
                    }
                    else if(this.formType == 'edit'){
                        this.updateProductGroup()
                    }
                 }
             })
         },
         saveProductGroup(){
              this.$http.post("api/product-group",this.groupProductData).then(()=>{
                    this.searchProductGroups()
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
         updateProductGroup(){
            this.$http.put("api/product-group/"+this.groupProductData.id_grupo_producto,this.groupProductData).then((response)=>{
                    this.searchProductGroups()
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
         }        
        },        
        watch : {
            sizeData: function(){
                this.currentPage = 1
                this.searchProductGroups()
            },
            searchParam: function(){
                if(this.searchParam == ''){                    
                    this.searchParam = null
                }
                this.searchProductGroups()
            },
            filterProduct: function(){
                if(this.filterProduct == ''){
                    this.filterProduct =  null
                }
                this.getProducts()
            }
        },
        components :{
         'alert': VueStrap.alert,
         'modal' : VueStrap.modal,
         'vue-simple-spinner': Spinner
      }
    }
</script>
