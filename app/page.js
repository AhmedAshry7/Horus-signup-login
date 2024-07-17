'use client'
import Image from "next/image";
import React,{useEffect,useState} from 'react';
import { app,firestore } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";
import Horus from "../app/assets/Horus.png";


 function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const handleSignOut =()=>{
    router.push('/login');
  }
  useEffect( () => {
    // Use onAuthStateChanged to listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user!=null) {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = ({ id: docSnap.id, ...docSnap.data() })
            setUser(data);
            console.log(data);
        } else {
          console.log('No such document!');
        }
      } else {
        setUser(null);
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);
  if(user){
    return (
      <div>
        <div className={styles.head}>
            <Image
              src={Horus}
              alt="search icon"
              className={styles.HorusIcon}
            />
            <h1 className={styles.headTitle}>Welcome To Horus</h1>
            <button onClick={handleSignOut} className={styles.signout}>Sign out</button>
        </div>
        <div className={styles.body}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </div>
      </div>
  
    );
  }
  } 
  

export default Home;
