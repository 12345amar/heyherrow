/* eslint-disable */
let client;

self.addEventListener('push', (e) => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: './images/logoCircle.png',
  });
  if (client) {
    client.postMessage({
      msg: data.message,
    });
  }
});

self.addEventListener('fetch', (event) => {
  event.waitUntil(async function () {
    if (!event.clientId) return;
    client = await clients.get(event.clientId);
  }());
});
