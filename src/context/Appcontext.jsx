import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/Firebase";
import { useNavigate } from "react-router-dom";

export const Appcontext = createContext();

const AppcontextProvider = (props) => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState([]);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const [chatvisual,setChatVisual] = useState(false);


    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();   
            setUserData(userData);
            if (userData.avatar && userData.name) {
                navigate('/chat');
            } else {
                navigate('/profile');
            }

            await updateDoc(userRef, {
                lastseen: Date.now()
            });

            setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef, {
                        lastseen: Date.now()
                    });
                }
            }, 60000);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, 'chats', userData.id);
            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data().chatsData;
                const tempData = [];
                const seenMembers = new Set(); // To track seen members

                for (const item of chatItems) {
                    if (!seenMembers.has(item.rId)) {
                        seenMembers.add(item.rId);
                        const userRef = doc(db, 'users', item.rId);
                        const userSnap = await getDoc(userRef);
                        const userData = userSnap.data();
                        tempData.push({ ...item, userData });
                    }
                }

                setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
            });

            return () => {
                unSub();
            };
        }
    }, [userData]);

    const value = {
        userData, setUserData,
        chatData, setChatData,
        loadUserData,
        messages,setMessages,
        messagesId,setMessagesId,
        chatUser,setChatUser,
        chatvisual,setChatVisual

    };

    return (
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    );
};

export default AppcontextProvider;
