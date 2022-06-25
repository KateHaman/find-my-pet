import consumer from "./consumer"

consumer.subscriptions.create("ChatChannel", {
  connected() {
    console.log('Connected to the chat channel');
  },

  disconnected() {
    console.log('Disconnected from the chat channel');
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
  }
});
