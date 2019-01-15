console.log('... Service Worker File Running ...');

// Listner for Push Notification
self.addEventListener('push', function (event) {
  console.log('Received a push message', event);

  var notification = event.data.json().notification
  console.log(notification)
  var title = notification.title;
  var body = notification.body;
  var url=notification.click_action;
  var icon = notification.icon;
  //var image='firebase-logo.png'
  console.log(icon);
  console.log(body);
  console.log(url);


  // var tag = 'simple-push-demo-notification-tag';
  event.waitUntil(
    self.registration.showNotification(title, {
      title:title,
      body: body,
      icon: icon,
      data:url,
      // tag: tag
    })
  );
});
// on Notification Click do whatever you want...
self.addEventListener('notificationclick', function (event) {
  console.log('On notification click: ', event.notification);
  event.notification.close();
  clients.openWindow(event.notification.data);
});