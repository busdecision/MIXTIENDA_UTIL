<template>
  <div class="header clearfix">
        <nav>
          <ul class="nav nav-pills pull-right">
            <!--<li role="presentation" class="active"><a href="#">Dashboard</a></li> -->    
            <router-link tag="li" to="/dashboard" v-if="isAuth!=null">
                <a>Dashboard</a>
              </router-link>
              <router-link tag="li" to="/colegio" v-if="isAuth!=null">
                <a>Colegio</a>
              </router-link>
              <router-link tag="li" to="/grupo-producto" v-if="isAuth!=null">
                <a>Grupo-producto</a>
              </router-link>
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
      console.log("sdsds")
      this.isAuth = this.$auth.isAuthenticated()
    },
  }
</script>

<style>

</style>

