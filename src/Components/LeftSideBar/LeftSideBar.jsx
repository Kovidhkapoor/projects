import React, { useContext, useEffect, useState } from 'react';
import './LeftSideBar.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/Firebase';
import { Appcontext } from '../../context/Appcontext';
import { toast } from 'react-toastify';

const LeftSideBar = () => {
    const { userData, chatData, chatUser,setChatUser,setMessagesId,messagesId,chatvisual,setChatVisual, } = useContext(Appcontext);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);

    const inputHandler = async (e) => {
        try {
            const input = e.target.value;
            if (input) {
                setShowSearch(true);
                const userRef = collection(db, 'users');
                const q = query(userRef, where("username", "==", input.toLowerCase()));
                const querySnap = await getDocs(q);

                if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
                    const searchUserId = querySnap.docs[0].data().id;
                    const seenMembers = new Set(chatData.map(item => item.rId));

                    if (!seenMembers.has(searchUserId)) {
                        setUser(querySnap.docs[0].data());
                    } else {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } else {
                setShowSearch(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addChat = async () => {
        const messagesRef = collection(db, "messages");
        const chatsRef = collection(db, "chats");
        try {
            const newMessageRef = doc(messagesRef);
            await setDoc(newMessageRef, {
                createAt: serverTimestamp(),
                messages: []
            });

            await updateDoc(doc(chatsRef, user.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: userData.id,
                    updatedAt: Date.now(),
                    messageSeen: true
                })
            });
            const uSnap = await getDoc(db,"users",user.id);
            const uData = uSnap.data();
            setChat({
                    messagesId:newMessageRef.id,
                    lastMessage:"",
                    rId:user.id,
                    updatedAt:Date.now(),
                    messageSeen:true,
                    userData:uData
            })

            setShowSearch(false)
            setChatVisual(true)

            await updateDoc(doc(chatsRef, userData.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: user.id,
                    updatedAt: Date.now(),
                    messageSeen: true
                })
            });

        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    const setChat = async (item) => {
        try {
            setMessagesId(item.messageId);
        setChatUser(item)
        const userChatsRef = doc(db,'chats',userData.id);
        const userChatsSnapshot = await getDoc(userChatsRef);
        const userChatsData   = userChatsSnapshot.data();
        const chatIndex = userChatsData.chatsData.findIndex((c)=>c.messageId=== item.messageId );
        userChatsData.chatsData[chatIndex].messageSeen =true;
        await updateDoc(userChatsRef,{
            chatsData:userChatsData.chatsData
        })  
            setChatVisual(true);
        } catch (error) {
            toast.error(error.message)
            
        }
        

        
    };

    useEffect(()=>{
        const updateChatUserData = async()=>{
            if(chatUser){
                const userRef=doc(db,"users",chatUser.userData.id);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.data();
                setChatUser(prev=>({...prev,userData:userData}))

            }

        }
        updateChatUserData();

    },[chatData])

    return (
        <div className={`Leftsidebar ${chatvisual?  "hidden" : ""}`}>
            <div className='Lefttop'>
                <div className='Leftnav'>
                    <img src={assets.logo} alt="#" className='logo' />
                    <div className='menu'>
                        <img src={assets.menu_icon} alt="" />
                        <div className='sub-menu'>
                            <p onClick={() => navigate('/profile')}>Edit Profile</p>
                            <hr />
                            <p>Logout</p>
                        </div>
                    </div>
                </div>
                <div className='Leftsearch'>
                    <img src={assets.search_icon} alt="" />
                    <input onChange={inputHandler} type="text" placeholder='Search here..' />
                </div>
            </div>
            <div className='Leftlist'>
                {showSearch && user
                    ? <div onClick={addChat} className='Lfriends add-user'>
                        <img src={user.avatar} alt="" />
                        <p>{user.name}</p>
                    </div>
                    : chatData.map((item) => (
                        <div onClick={() => setChat(item)} key={item.messageId} className={`Lfriends ${item.messageSeen  ||   item.messageId  === messagesId ?  "" : "boder"  }`}>
                            <img src={item.userData.avatar} alt="" />
                            <div>
                                <p>{item.userData.name}</p>
                                <span>{item.lastMessage}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default LeftSideBar;
