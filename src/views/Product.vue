<template>
  <div class="about">
    <h1> {{product.name}}</h1>
    <p v-if="product">
      {{product.description}}
    </p><p  >
      {{user.name}}
    </p>
     <button @click="setUserHandler">Set name</button>
  </div> 
</template> 

<script>  
import Axios from 'axios';

export default {
  data(){
    return {
      product:{name: 'test',description: 'test',}
    }},
   computed: {
    user() {
      return this.$store.state.User.user
    }
   },
   methods:{
     setUserHandler(){
this.$store.dispatch('User/setUser', {name:'Basir'} )
     },
    async fetch(productId){
       const { data } = await Axios.get(`/api/products/${productId}`);

      // store.dispatch('User/setUser', {name:'Basir'} );
      this.product = data;
      
    }
  },
  mounted(){
    const productId = this.$route.params.productId;
    this.fetch(productId)
  } ,
   watch: {
    $route(to) {
      // react to route changes...
      this.fetch(to.params.productId)
    }
  }
} 
</script>

<style>

</style>