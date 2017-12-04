<template>
  <div>
    <h3>Editar</h3>
  </div>
</template>
<script>
import config from '../../../../config.json'
    export  default{
        data(){
            return {
            }
        },
        created(){
            console.log(this.$route.params.id)
            console.log(config.apiUrl)
        }
    }
</script>
