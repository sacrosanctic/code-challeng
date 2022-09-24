<template>
  <v-form ref="form" v-model="valid" v-on:submit.prevent="submitSubscription">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-container>
            <v-row>
              <v-col style="font-size: 24px">Subscribe To Temperature</v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="user"
                  label="user"
                  required
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="label"
                  :counter="140"
                  label="label"
                  required
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="threshold"
                  label="threshold"
                  type="number"
                  :value="threshold"
                  required
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="sensitivity"
                  label="sensitivity"
                  type="number"
                  :value="sensitivity"
                  required
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="direction"
                  :items="items"
                  label="direction"
                  :value="direction"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  :disabled="!valid"
                  color="success"
                  @click="submitSubscription"
                  >Submit</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div v-for="(item, index) in userStore" v-bind:key="index">
                  User: {{ item.user }}, label: {{ item.label }}, threshold:
                  {{ item.threshold }}, sensitivity: {{ item.sensitivity }},
                  direction:
                  {{ item.direction }}
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12" md="6">
          <v-form
            ref="form2"
            v-model="valid2"
            v-on:submit.prevent="submitTemperature"
          >
            <v-container>
              <v-row>
                <v-col style="font-size: 24px">Manual External Source</v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model.number="temp"
                    label="temperature"
                    type="number"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-btn
                    :disabled="!valid2"
                    color="success"
                    @click="submitTemperature"
                    >Submit</v-btn
                  >
                </v-col>
              </v-row>
              <v-row>
                <div v-for="(item, index) in history" v-bind:key="index">
                  {{ item }}
                </div>
              </v-row>
            </v-container>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import {
  printCurrentTemperature,
  meetMarkerRequirement,
  printMarkerNotification,
} from "../util.js";

export default {
  name: "TempForm",
  data: () => ({
    valid: false,
    valid2: false,
    user: "my name",
    temp: null,
    label: "melting point",
    threshold: 0,
    sensitivity: 0.5,
    direction: "asc",
    items: ["asc", "desc"],
    userStore: [],
    history: [],
    tempStore: [],
    rules: {
      required: (value) => value !== null || "Required.",
    },
  }),
  methods: {
    submitSubscription() {
      if (!this.valid) return;
      this.$refs.form.validate();
      const obj = {
        user: this.user,
        label: this.label,
        threshold: this.threshold,
        sensitivity: this.sensitivity,
        direction: this.direction,
      };
      this.userStore.push(obj);
      this.$refs.form.reset();
    },
    submitTemperature() {
      if (!this.valid2) return;
      this.tempStore = [...this.tempStore, this.temp];
      this.$refs.form2.reset();
    },
  },
  watch: {
    tempStore(temperature) {
      const currTemp = temperature.at(-1);
      const prevTemp = temperature.at(-2);

      this.history.unshift(printCurrentTemperature(currTemp));

      if (this.userStore.length <= 0 || temperature.length < 2) return;
      this.userStore.forEach((v) => {
        if (meetMarkerRequirement(prevTemp, currTemp, v))
          this.history.unshift(printMarkerNotification(v.label));
      });
    },
  },
};
</script>
