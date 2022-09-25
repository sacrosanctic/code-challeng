<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <MyHeader></MyHeader>
    </v-app-bar>

    <v-main>
      <TempForm />
      <notifications
        group="notify-success"
        :width="350"
        position="bottom left"
      />
      <notifications group="notify-error" :width="350" position="bottom left" />
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
