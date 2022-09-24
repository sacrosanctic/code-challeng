<template>
  <v-form ref="form">
    <v-container>
      <v-row>
        <v-col style="font-size: 24px"> manually send source temp </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="temp"
            label="temperature"
            type="number"
            required
          ></v-text-field>
          <v-btn color="success" @click="submit">Submit</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(item, index) in tempStore" v-bind:key="index">
          <div>
            {{ item }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
export default {
  name: "TempSource",
  data: () => ({
    temp: 0,
    tempStore: [],
    history: [],
  }),
  methods: {
    submit() {
      this.tempStore.push(this.temp);
      this.history += this.temp;
      console.log(this.tempStore);
    },
  },
};
</script>
