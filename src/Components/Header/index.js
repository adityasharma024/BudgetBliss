import React, { useEffect } from 'react';
import "./styles.css";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

import userImg from '../../assets/user.svg'
const Header = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    console.log("user:", user);
    console.log("loading:", loading);

    if (!user) {
      console.log("Navigating to login");
      navigate("/");
    } else {
      console.log("Navigating to dashboard");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  function logout() {
    try {
      signOut(auth).then(() => {
        // Sign-out successful.
        toast.success("Successfully Signed Out as " + user.email)

        navigate("/")
      }).catch((error) => {
        // An error happened.
      });


    }
    catch (e) {
      toast.error(e.message)

    }

  }

  return (
    <div className='navbar'>
      <p className='logo' style={{ color: "var(--white)", fontWeight: 1000, fontSize: "1.2rem" }}>Budget<span style={{ color: "yellow", fontWeight: 1000 }}>Bliss</span></p>
      {user && (
        <div style={{
          display:"flex",
          alignItems:"center",
          gap:"0.75rem"
        }}>
          <img src={user.photoURL?user.photoURL:userImg} style={{
            height:"1.5rem" ,width:"1.5rem",borderRadius:"50%"
          }}/>
          <p className='link' onClick={logout}>Logout</p>
        </div>)}
    </div>
  );
};

export default Header;
