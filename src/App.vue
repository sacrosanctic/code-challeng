<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <MyHeader></MyHeader>
    </v-app-bar>

    <v-main>
      <TempForm />
    </v-main>
  </v-app>
</template>

<script>
import TempForm from "./components/TempForm.vue";
import MyHeader from "./components/MyHeader.vue";

export default {
  name: "App",

  components: { TempForm, MyHeader },

  data: () => ({
    //
  }),
};
</script>
