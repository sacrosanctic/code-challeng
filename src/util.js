//(temp: string): string
const formatCelsius = (val) => `${val}°C`;

//([ prev:number , curr:number ]): number
export const getMagnitude = ([prev, curr]) => Math.abs(curr - prev);

//([ prev:number , curr:number ]): number
export const getDirection = ([prev, curr]) =>
  curr - prev >= 0 ? "asc" : "desc";

//([ prev:number , curr:number ]): boolean
export const passedThreshold = ([prev, curr], threshold, direction) =>
  direction === "asc"
    ? prev < threshold && threshold <= curr
    : curr <= threshold && threshold < prev;

//(temp: string): string
export const printCurrentTemperature = (temp) =>
  `the current temperature is ${formatCelsius(temp)}`;

//(label: string): string
export const printMarkerNotification = (v) =>
  `${v.user}: ${v.label} has been reached.`;

//(prev: number, curr: number, {sensitivity: number, direction: asc | desc, threshold: number}): boolean
export const meetAlertRequirement = (
  prev,
  curr,
  { sensitivity, direction, threshold }
) =>
  getMagnitude([prev, curr]) > sensitivity &&
  getDirection([prev, curr]) === direction &&
  passedThreshold([prev, curr], threshold, direction);

export const notifySuccess = (msg) => {
  this.$notify({
    group: "notify-success",
    title: "<h1>Success</h1>",
    type: "success",
    duration: 5000,
    text: `<span class="subtitle-1">${msg}</span>`,
  });
};

export const randomNum = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
