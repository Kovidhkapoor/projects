import React, { useContext, useEffect, useState } from 'react'
import './RightSideBar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/Firebase'
import { Appcontext } from '../../context/Appcontext'


const RightSideBar = () => {
  const{chatUser,messages} = useContext(Appcontext);
  const[messageImages,setMessagesImages] = useState([]);
   useEffect(()=>{
    let tempVar =[];
    messages.map((msg)=>{
      if(msg.image){
        tempVar.push(msg.image)
      }
    })
  setMessagesImages(tempVar);

   },[messages])
  return  chatUser ? (
    <div className='rightsidebr'>
      <div className='right-profile'>
        <img src={chatUser.userData.avatar} alt="" />
        <h3>  {Date.now() -chatUser.userData.lastseen <=70000 ?<img src={assets.green_dot} className='dot' alt="" /> : null}  {chatUser.userData.name}  </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className='right-media'>
        <p>Media</p>
        <div>
          {messageImages.map((url,index)=>(<img onClick={()=>window.open(url)}  key={index} src={url}  alt=''/>))}
        {/*  <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />  
          */}
        </div>
        </div>  
        <button  onClick={()=>logout()}>Logout</button>    
    </div>
  )
  : (
  <div className='rightsidebr'>
    <button onClick={()=>logout()}>Logout</button>


  </div>

  )
}

export default RightSideBar
