<template>
  <div>      
      <div class="panel panel-default">        
        <div class="panel-body">
            <div class="row" align="center">
                <h4>Nuevo usuario</h4>
            </div>
            <hr>
            <form class="form-horizontal">
            <div class="form-group" :class="{'has-error': errors.has('userData.name') }">
                <label class="control-label col-sm-3" for="email">Nombre:</label>
                <div class="col-sm-8">
                <input type="email" class="form-control" v-model="userData.name" v-validate.initial="userData.name"  data-vv-rules="required">
                <p class="text-danger" v-if="errors.has('userData.name')">Nombre es requerido</p>
                </div>
            </div>
            <div class="form-group" :class="{'has-error': errors.has('userData.email') }">
                <label class="control-label col-sm-3" for="email">Email:</label>
                <div class="col-sm-8">
                <input type="email" class="form-control" id="email" v-model="userData.email" v-validate.initial="userData.email"  data-vv-rules="required">
                <p class="text-danger" v-if="errors.has('userData.email')">Email es requerido</p>
                </div>
            </div>
            <div class="form-group" :class="{'has-error': errors.has('userData.password1') }">
                <label class="control-label col-sm-3" for="pwd">Contraseña:</label>
                <div class="col-sm-8"> 
                <input type="password" class="form-control" v-model="userData.password1" v-validate.initial="userData.password1"  data-vv-rules="required">
                <p class="text-danger" v-if="errors.has('userData.password1')">Contraseña es requerida</p>
                </div>
            </div>
            <div class="form-group" :class="{'has-error': errors.has('userData.password1') }">
                <label class="control-label col-sm-3" for="pwd">Repita contraseña:</label>
                <div class="col-sm-8"> 
                <input type="password" class="form-control" v-model="userData.password2" v-validate.initial="userData.password2"  data-vv-rules="required">
                <p class="text-danger" v-if="errors.has('userData.password2')">Repita su contraseña</p>
                </div>
            </div>            
            <div class="form-group" align="center"> 
                <div class="col-sm-offset-2 col-sm-9">
                <button type="button" class="btn btn-primary" @click="saveUser()">Guardar</button>
                <button type="button" class="btn btn-danger">Cancelar</button>
                </div>
            </div>
            </form>
        </div>
    </div>
  </div>
</template>
<script>
import swal from 'sweetalert2'
    export default{
      data(){
          return{
              userData : {

              }
          }
      },
      methods : {
          saveUser(){
              this.$validator.validateAll().then((res)=>{
                  if(res){
                      if(this.userData.password1 == this.userData.password2){
                          this.save()
                      }else{
                        swal(
                        'Las contraseñas deben coincidir',
                        'porfavor ingrese nuevamente',
                        'error'
                        )
                      }
                  }
              })              
          },
          save(){
            this.$http.post("api/user", this.userData).then(response=>{
                swal({
                    position: 'top-right',
                    type: 'success',
                    title: 'Guardado exitosamente',
                    showConfirmButton: false,
                    timer: 1700                        
                }).then(()=>{                    
                    //this.userData = {}
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
      }
    }
</script>