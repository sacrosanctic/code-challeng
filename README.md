# How to use

1. The user registers their name and notification settings on the left.
2. The right side is used to simulate an external source. It will simulate a number between min and max every 1 second.

# How it works

- A watcher is set to monitor new temperatures. When it triggers, it loops through all the subscribers and inform the appropriate subscribers.

# Assumptions

- subscribers will receive notifications by email
- fahrenheit is not considered in this demonstration

# Limitations

- only 1 marker can be set per user subscription
- marker will not trigger if sensitivity value is set too high
- marker will not trigger if starting range is within threshold

# Considerations related to your solution

- Vue was used along with its two way binding to enable a reactive UI.
- Vuetify was used to rapidly deploy a UI
