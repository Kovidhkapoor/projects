import React, { useEffect, useState, useContext } from 'react';
import './PFUpdate.css';
import assets from '../../assets/assets';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Upload from '../../lib/upload';
import { Appcontext } from '../../context/Appcontext';

const PFUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [uid, setUid] = useState('');
  const [prevImage, setPrevImage] = useState('');
  const { setUserData } = useContext(Appcontext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      // Check if a profile picture is already set or uploaded
      if (!image && !prevImage) {
        toast.error('Please upload a profile picture');
        return;
      }

      const docRef = doc(db, 'users', uid);

      // If an image is selected, upload it and update Firestore
      if (image) {
        const imageUrl = await Upload(image);
        await updateDoc(docRef, {
          avatar: imageUrl,
          bio: bio,
          name: name,
        });
        setPrevImage(imageUrl); // Set the new image as the previous image
      } else {
        // If no new image is selected, update the other fields
        await updateDoc(docRef, {
          bio: bio,
          name: name,
        });
      }

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat'); // Navigate to the chat screen after updating profile
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // Check if the user is authenticated and retrieve user data
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setName(docSnap.data().name || '');
          setBio(docSnap.data().bio || '');
          setPrevImage(docSnap.data().avatar || '');
        }
      } else {
        navigate('/'); // Redirect to login if not authenticated
      }
    });
  }, [navigate]);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : prevImage || assets.avatar_icon}
              alt="Profile"
            />
            Upload Profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          className="profilepic"
          src={image ? URL.createObjectURL(image) : prevImage ?  prevImage : assets.logo_icon}
          alt="Profile"
        />
      </div>
    </div>
  );
};

export default PFUpdate;
 