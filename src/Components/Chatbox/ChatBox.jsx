import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { Appcontext } from '../../context/Appcontext'
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../config/Firebase'
import { toast } from 'react-toastify'
import Upload from '../../lib/upload'
const ChatBox = () => {

   const{userData,messagesId,chatUser,messages,setMessages,setChatVisual, chatvisual} =useContext(Appcontext);
   const [input,setInput] = useState("");
   const sendmessage = async ()=>{
    try {
      if(input && messagesId){
        await updateDoc(doc(db,'messages',messagesId),{
          messages:  arrayUnion({
            sId:userData.id,
            text:input,
            createdAt: new Date()
          })
        })
        const userIDs = [chatUser.rId,userData.id];

        userIDs.forEach(async(id) =>{
          const userChatsRef = doc(db,'chats',id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if(userChatsSnapshot.exists()){
            const userChatData =  userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c)=>c.messageId === messagesId);
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0,30);
            userChatData.chatsData[chatIndex].updatedAt= Date.now();
            if(userChatData.chatsData[chatIndex].rId ===  userData.id ){

              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef,{
              chatsData:userChatData.chatsData
            })

          }

        })


      }
    } catch (error) {
      toast.error(error.message)
      
    }
    setInput("");
   }

   const sendImage = async (e)=>{
    try {
      const fileUrl = await Upload(e.target.files[0]);
      if(fileUrl && messagesId){
        await updateDoc(doc(db,'messages',messagesId),{
          messages:  arrayUnion({
            sId:userData.id,
            image:fileUrl,
            createdAt: new Date()
          })
        })
        const userIDs = [chatUser.rId,userData.id];

        userIDs.forEach(async(id) =>{
          const userChatsRef = doc(db,'chats',id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if(userChatsSnapshot.exists()){
            const userChatData =  userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c)=>c.messageId === messagesId);
            userChatData.chatsData[chatIndex].lastMessage = "Image";
            userChatData.chatsData[chatIndex].updatedAt= Date.now();
            if(userChatData.chatsData[chatIndex].rId ===  userData.id ){

              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef,{
              chatsData:userChatData.chatsData
            })

          }

        })



      }
      
    } catch (error) {
      toast.error(error.message)
      
    }

   }


   const convertTimestam =(Timestamp) =>{
    let Date = Timestamp.toDate();
    const hour = Date.getHours();
    const minute = Date.getMinutes();
    if( hour>12){
      return hour-12 + ":" + minute + "PM";

    }
    else{
      return hour + ":" + minute + "AM"
    }
   }



   useEffect(()=>{
    if(messagesId){
      const unSub = onSnapshot(doc(db,'messages',messagesId),(res)=>{
        setMessages(res.data().messages.reverse())
      

      })
      return()=>{
        unSub();
      }

    }


   },[messagesId])

  return  chatUser ? (
    <div>
       <div className={`chat-box  ${chatvisual ?"":"hidden"}` }>
        <div className='chat-user'>
            <img src={chatUser.userData.avatar} alt="" />
            <p>{chatUser.userData.name} {Date.now()-chatUser.userData.lastseen <= 70000 ? <img className='dot' src={assets.green_dot} alt="" />:null} </p>
            <img src={assets.help_icon} alt="" className='help' />
            <img   onClick={()=>setChatVisual(false)} src={assets.arrow_icon} className='arrow' alt="" />
        </div>

        <div className='chatmessage'>
          {messages.map((msg,index)=>(
             <div   key={index} className={msg.sId ===  userData.id ? "sendermessage" : "Receiver-msg"}>
              {msg["image"]
              ? <img   className='msg-img' src={msg.image} alt="" />
              :   <p className='message'> {msg.text} </p>
              }
          
               <div>
                 <img src={msg.sId ===  userData.id ?  userData.avatar : chatUser.userData.avatar} alt="" />
                 <p>{convertTimestam(msg.createdAt)}</p>
               </div>
           </div>

          ))}
         
        
        </div>

        <div className='chat-input'>
          <input  onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Send a message' />
          <input  onChange={sendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
         <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" />
          </label> 
          <img   onClick={sendmessage} src={assets.send_button} alt="" />
        </div>
      
    </div>
    </div>
  ) 
  :<div className={`chat-welcome  ${chatvisual ?"":"hidden"}` }>
    <img src={assets.logo_icon} alt="" />
    <p>chat anytime,anywhere</p>

  </div>
}

export default ChatBox
