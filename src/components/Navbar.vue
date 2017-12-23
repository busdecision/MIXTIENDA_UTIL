<template>
  <div class="header clearfix">
        <nav>
          <ul class="nav nav-pills pull-right">
            <!--<li role="presentation" class="active"><a href="#">Dashboard</a></li> -->    
              <!--
                <router-link tag="li" to="/dashboard" v-if="isAuth!=null">
                <a>Dashboard</a>
              </router-link>
              -->
              <router-link tag="li" to="/colegio" v-if="isAuth">
                <a>Colegio</a>
              </router-link>
              <router-link tag="li" to="/grupo-producto" v-if="isAuth">
                <a>Grupo-producto</a>
              </router-link>
              <router-link tag="li" to="/utiles" v-if="isAuth">
                <a>Lista-utiles</a>
              </router-link>
              <router-link tag="li" to="/archivo" v-if="isAuth">
                <a>Lista-archivo</a>
              </router-link>
              <a style="margin-left:4px" tag="li" to="/utiles" class="btn btn-default" @click="cerrarSession()" v-if="isAuth">
                Cerrar session
              </a>
              <!--
              <router-link tag="li" to="/usuario/crear" v-if="isAuth!=null">
                <a>Usuarios</a>
              </router-link>
              -->
          </ul>                      
        </nav>        
        <h3 class="text-muted">E-Commerce</h3>        
      </div>      
</template>

<script>
  export default{
    data () {
      return {
        isAuth : false
      }
    },
    created(){
      this.getAuth()
    },
    methods:{
      getAuth(){
        this.isAuth = this.$auth.isAuthenticated()
      },
      cerrarSession(){
        this.$auth.destroyToken()
        this.$router.go("/login")
      }
    },
      components :{

    }
  }
</script>

<style>

</style>

