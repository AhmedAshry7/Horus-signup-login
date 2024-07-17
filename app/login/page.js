"use client"
import { useState,useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { TailSpin } from 'react-loader-spinner';
import styles from "../page.module.css"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Horus from "../assets/Horus.png";
import Image from 'next/image';

function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    try {
      if (validateForm()) {
        // Register user with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth,email, password);
        const user = userCredential.user;
        if(user){
          toast.success("Logged in successfully",{position: 'bottom-center'})
          router.push('/');
        }
        setErrors({});
      }
    } catch (error) {
      // Handle registration errors
      console.error('Error logging in user:', error.message);
      toast.error("invalid email or password",{position: 'bottom-center'});
      setErrors({});
    }
    setLoading(false);
    
  };
  return (
    <div className={styles.page}>

      <div className={styles.mainForm}>
    
        <div className={styles.head}>
        <Image
          src={Horus}
          alt="search icon"
          className={styles.HorusIcon}
        />
          <h1 className={styles.headTitle}>Horus</h1>
        </div>
        
        
        <div className={styles.inputcontainer}>
          <p className={styles.title}>Email</p>
          <input
            type="text"
            placeholder="Email"
            className={styles.inputBox}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
           {errors.email && <span className={styles.errors}>{errors.email}</span>}
        </div>

        <div className={styles.inputcontainer}>
          <p className={styles.title}>Password</p>
          <input
            type="password"
            placeholder="Enter Password"
            className={styles.inputBox}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className={styles.errors}>{errors.password}</span>}
        </div>

        <div>
          <button className={styles.submit} onClick={handleSubmit}>
            {
              loading? <TailSpin
              visible={true}
              height="20"
              width="80"
              color="#22b6af"
              ariaLabel="tail-spin-loading"
              radius="0.5"
              wrapperStyle={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "40px",
              }}
              wrapperClass=""
            /> : 'Log in'
            }
          </button>
        </div>

        <span>
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-800 hover:underline">
          Register
          </Link>
        </span>
      
      </div>

    </div>
  )
}

export default page