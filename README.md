# OLX
Code of application of OLX using Html, Css, JavaScript

### Environment
After downloading source code Install firebase tools
```Ruby
  npm install -g firebase-tools
```

write and deploy your functions , for more visit : https://firebase.google.com/docs/functions/get-started
```Ruby
  npm install firebase-functions@latest firebase-admin@latest --save
  npm install -g firebase-tools
  firebase login
  firebase init functions
```

Go to project > functions > index.js and paste this code and edit 'PASTE_YOUR_AUTH_DOMAIN_HERE' 
```Ruby
  const functions = require('firebase-functions');
  const admin = require('firebase-admin');
  admin.initializeApp(functions.config().firebase);


  exports.noti = functions.firestore
    .document('messages/{message_id}').onWrite((change, context) => {
      const payload = {
          notification: {
              title: 'New Message:',
              body: change.after.data().message,
              status: 'Wohoo its work',
              click_action: 'PASTE_YOUR_AUTH_DOMAIN_HERE/layout/message.html?id='+change.after.data().sender_id+'&adid='+change.after.data().ad_id
          }
      }
      const receiverId = change.after.data().reciever_id;

      return admin.firestore().collection('users').doc(receiverId).get()
      .then((snapshot) => {
          const data = snapshot.data();
          const token = data.token;
          return admin.messaging().sendToDevice(token, payload);
      });
  });
```

Deploy project on firebase and also deploy firebase functions and youre done :)

### Contributors
  - Salman <salmanmemon569@yahoo.com>
