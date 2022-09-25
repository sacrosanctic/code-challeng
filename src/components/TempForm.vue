<template>
  <v-form ref="form" v-model="valid" v-on:submit.prevent="submitSubscription">
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-container>
            <v-row>
              <v-col style="font-size: 24px">Subscribe To Temperature</v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="user"
                  label="Email"
                  required
                  :rules="[rules.required, rules.email]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="presetValue"
                  :items="preset"
                  item-text="label"
                  item-value="threshold"
                  label="Preset"
                >
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <v-list-item-title
                        v-html="data.item.label"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-html="data.item.threshold"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="threshold"
                  label="Temperature Threshold"
                  type="number"
                  :value="threshold"
                  required
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="sensitivity"
                  label="Sensitivity"
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
                  label="Direction"
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
                  >Subscribe</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="text-left">User</th>
                      <th class="text-left">label</th>
                      <th class="text-left">threshold</th>
                      <th class="text-left">sensitivity</th>
                      <th class="text-left">direction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in subscribers" :key="index">
                      <td>{{ item.user }}</td>
                      <td>{{ item.label }}</td>
                      <td>{{ item.threshold }}</td>
                      <td>{{ item.sensitivity }}</td>
                      <td>{{ item.direction }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12" md="4">
          <v-form
            ref="form2"
            v-model="valid2"
            v-on:submit.prevent="submitTemperature"
          >
            <v-container>
              <v-row>
                <v-col style="font-size: 24px">External Source</v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="min"
                    label="min"
                    type="number"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="max"
                    label="max"
                    type="number"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-btn color="success" :disabled="!valid2" @click="runTest"
                    >Simulate (20x)</v-btn
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-sheet :height="200" id="temp-list" color="transparent">
                  <vue-scroll :ops="scrollbarOptions" style="height: inherit">
                    <div v-for="(item, index) in history" v-bind:key="index">
                      {{ item }}
                    </div>
                  </vue-scroll>
                </v-sheet>
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
  meetAlertRequirement,
  printMarkerNotification,
  randomNum,
} from "@/util.js";
import { Subscriber } from "@/models/subscriber.js";

export default {
  name: "TempForm",
  data: () => ({
    min: 95,
    max: 105,
    valid: false,
    valid2: false,
    user: "sw@scottwu.ca",
    temp: null,
    label: "boiling point",
    threshold: 100,
    sensitivity: 0.5,
    direction: "asc",
    items: ["asc", "desc"],
    presetValue: 100,
    preset: [
      { label: "boiling point", threshold: 100 },
      { label: "freezing point", threshold: 0 },
      { label: "custom", threshold: null },
    ],
    subscribers: [],
    history: [],
    tempStore: [],
    rules: {
      required: (value) => value !== null || "Required.",
      email: (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    },
    scrollbarOptions: {
      scrollPanel: {
        scrollingX: false,
      },
      bar: {
        onlyShowBarOnScroll: false,
      },
      detectResize: true,
    },
  }),
  methods: {
    runTest() {
      let count = 0;
      const intervalId = setInterval(() => {
        this.tempStore = [...this.tempStore, randomNum(this.min, this.max)];
        count++;
        if (count > 20) clearInterval(intervalId);
      }, 1000);
    },
    submitSubscription() {
      if (!this.valid) return;
      this.$refs.form.validate();
      const subscriber = new Subscriber(
        this.user,
        this.label,
        this.threshold,
        this.sensitivity,
        this.direction
      );
      this.subscribers.push(subscriber);
      this.$refs.form.reset();
      this.notifySuccess(`new subscription added (${subscriber.user})`);
    },
    submitTemperature() {
      if (!this.valid2) return;
      this.tempStore = [...this.tempStore, this.temp];
      this.$refs.form2.reset();
    },
    notifySuccess(msg) {
      this.$notify({
        group: "notify-success",
        title: "<h1>Success</h1>",
        type: "success",
        duration: 5000,
        text: `<span class="subtitle-1">${msg}</span>`,
      });
    },
    temperatureAlert(msg) {
      this.$notify({
        group: "notify-error",
        title: "<h1>Alert</h1>",
        type: "error",
        duration: 5000,
        text: `<span class="subtitle-1">${msg}</span>`,
      });
    },
  },
  watch: {
    presetValue() {
      this.threshold = this.presetValue;
    },
    tempStore(temperature) {
      const currTemp = temperature.at(-1);
      const prevTemp = temperature.at(-2);

      this.history.unshift(printCurrentTemperature(currTemp));

      if (this.subscribers.length <= 0 || temperature.length < 2) return;
      this.subscribers.forEach((v) => {
        if (meetAlertRequirement(prevTemp, currTemp, v)) {
          this.history.unshift(printMarkerNotification(v));
          this.temperatureAlert(printMarkerNotification(v));
        }
      });
    },
  },
};
</script>
