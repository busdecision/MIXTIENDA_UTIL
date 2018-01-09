<template>
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            <div class="panel panel-default"> 
                <div class="panel-body">
                    <h4 align="center">Acceso al Sistema</h4>
                    <hr>
                    <div class="form-group">
                        <input 
                            v-model="email"
                            class="form-control"
                            type="email"
                            placeholder="Email">
                    </div>
                    <div class="form-group">
                        <input
                            v-model="password"
                            class="form-control"
                            type="password"
                            placeholder="Password">
                    </div>
                    <vue-simple-spinner v-if="showSpinner" size="short" :speed="0.5" line-fg-color="green"> </vue-simple-spinner>
                    <button @click="login()" class="btn btn-success pull-right" align="center" :disabled="showSpinner">
                        <span>Iniciar Sesión</span>                        
                    </button>                    
                </div>
            </div>
        </div>        
    </div>
</template>
<script>
import config from '../../../../config.json'
import swal from 'sweetalert2'
import Spinner from 'vue-simple-spinner'

    export default{
        data(){
            return {
                email : '',
                password : '',
                showSpinner : false
            }
        },
        methods:{
            login(){
                var data ={
                    	client_id: config.clientId,
	                    client_secret : config.clientSecret,
	                    grant_type :  "password",
	                    username: this.email,
                        password: this.password                        
                }
                this.showSpinner = true
                this.$http.post("oauth/token", data)
                    .then(response=>{
                        this.$auth.setToken(response.body.access_token, response.body.expires_in + Date.now())
                        this.$router.go("/colegio")                        
                    }, (err)=>{
                        this.showSpinner = false
                        swal(
                        'Invalido',
                        'Credenciales invalidas',
                        'error'
                        )                    
                    })
            }
        },
        components:{
            'vue-simple-spinner': Spinner
        }
    }
</script>
<style>

</style>

