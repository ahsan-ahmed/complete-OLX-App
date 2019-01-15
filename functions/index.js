const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.Notification = functions.firestore.document('rooms/{roomId}/messages/{messageId}')
.onWrite((event) => {
    console.info(event.after.id);
    const senderId = event.after.data().senderId;
    const receiverId = event.after.data().receiverId;
    return admin.firestore().collection(`users`).doc(senderId).get().then((desh) => {
    return admin.firestore().collection(`tokens`).doc(senderId).get().then((respy) => {
        return admin.firestore().collection(`rooms`).where("users","==",{[receiverId]:true,[senderId]:true})
        .onSnapshot(querySnapshot=>{
            querySnapshot.forEach(respond=>{
            const payload = {
                notification: {
                    title: 'OLX APP',
                    body:`${respy.data().name}: ${event.after.data().message}`,
                    icon:desh.data().userUrl,
                    click_action:`templates/usersChatRoom.html#${respond.id}`
                }
            }
            console.info(payload)
            
            //userId that will receive message
            
            console.info('event***', event.after.data());
            
        const receiverId = event.after.data().receiverId;
            console.info("receiverId>>>",receiverId);
            console.info('senderId***',senderId);
            
        return admin.firestore().collection(`tokens`).doc(receiverId).get().then((res) => {
                
        if (!res.data()) return;
        const snapshot = res.data();
        const token = snapshot.token;
        console.info('token***', token);
        return admin.messaging().sendToDevice(token, payload);
            })
        })
    })
    })
})
})
