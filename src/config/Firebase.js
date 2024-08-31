import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBElwAatXfdrufoSOQ_f49wna73vMiCORk",
  authDomain: "quick-chat-app-71584.firebaseapp.com",
  projectId: "quick-chat-app-71584",
  storageBucket: "quick-chat-app-71584.appspot.com",
  messagingSenderId: "782843715473",
  appId: "1:782843715473:web:dba985184cdc8d479f4430"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    try {
        // Create a new user
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        // Set user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey, There I am using the app",
            lastseen: Date.now()
        });

        // Initialize chat data for the user
        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        });

        toast.success("User signed up successfully");
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join("")); 
    }
}
const login = async (email,password) =>{
    try {
        await signInWithEmailAndPassword(auth,email,password);
        toast.success("LoginSucess");
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(""));
        
    }

}
const logout= async ()=>{
    try {
           await  signOut(auth);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(""));
        
    }
  
}

const resetPass = async(email)=>{
    if(!email){
        toast.error("Enter your Email");
        return null;

    }
    try {
        const userRef = collection(db,'users');
        const q = query(userRef,where("email","==",email))
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth,email);
            toast.success("Reset  Email Sent")
        }
        else{
            toast.error("Email doesn't exists")
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message)
        
    }

}
export { signup ,login,logout,auth,db,resetPass};
