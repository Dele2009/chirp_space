import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';
// import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
     apiKey: "AIzaSyDfsECzEDXsewf9g7vZ3x4j62VAhOPhx7Q",
     authDomain: "mashmall.firebaseapp.com",
     databaseURL: "https://mashmall-default-rtdb.firebaseio.com",
     projectId: "mashmall",
     storageBucket: "mashmall.appspot.com",
     messagingSenderId: "358912908530",
     appId: "1:358912908530:web:65129eb23e615add67046b",
     measurementId: "G-QNNGGRGGLK"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const googleSignIn = async () => {
     try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider)
          const { user } = result
          console.log(user)
          const idToken = await user.getIdToken();
          // const response = await axios.post('/users/auth/google', { idToken, userdetails: user })
          const response = await fetch('/users/auth/google', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify({ idToken, userdetails: user })
          });
          console.log(response.json())
          if (response && response.ok) {
               window.location.href = '/users/profile'
          }
          // .then(async (result) => {
          //
          //      await fetch('/auth/google', {
          //           method: 'POST',
          //           headers: {
          //                'Content-Type': 'application/json',
          //           },
          //           body: JSON.stringify({ idToken })
          //      });
          //      window.location.href = '/profile';
          // })
          // .catch(error => console.error(error));
     } catch (error) {
          console.log(error)
     }
};

document.getElementById('firebase-auth-with-google').addEventListener('click', googleSignIn)




// Function to initiate sign-in with redirect


// const googleSignIn = () => {
//      const provider = new GoogleAuthProvider();
//      signInWithRedirect(auth, provider);
// };

// // Handle the result of the redirect
// const handleRedirectResult = async () => {
//      try {
//           const result = await getRedirectResult(auth);
//           if (result) {
//                const { user } = result;
//                console.log('details', user)
//                const idToken = await user.getIdToken();

//                // Send the idToken and user details to your server
//                const response = await fetch('/users/auth/google', {
//                     method: 'POST',
//                     headers: {
//                          'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ idToken, userdetails: user })
//                });

//                console.log(response);
//                // Redirect to the profile page or handle accordingly
//                // window.location.href = '/profile';
//           }
//      } catch (error) {
//           console.error('Error during redirect result:', error);
//      }
// };

// // Event listener for the sign-in button
// document.getElementById('firebase-auth-with-google').addEventListener('click', googleSignIn);

// // Check for redirect result on page load
// window.addEventListener('load', handleRedirectResult);