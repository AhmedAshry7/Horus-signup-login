"use client"
import { useState,useEffect } from 'react';
import { auth,firestore } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { toast } from 'react-hot-toast';
import { TailSpin } from 'react-loader-spinner';
import styles from "../page.module.css"
import Link from 'next/link';
import Horus from "../assets/Horus.png";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function page() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Please enter the Username';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    }
    else if (phone.length!=11) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!email.trim()){
      newErrors.email = 'Please enter your email';
    } 
    else if( !emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (validateForm()) {
        // Register user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth,email, password);
        const user = userCredential.user;

         // Now you can use the user's UID as the document ID
         const docRef = doc(firestore, 'users', user.uid);
         await setDoc(docRef, {
           username:name,
           email:email,
           phone:phone,
         });
         toast.success("Registered successfully",{position: 'bottom-center'})
         router.push('/');
         setErrors({});
      }
    } catch (error) {
      // Handle registration errors
      console.error('Error registering user:', error.message);
      toast.error("Error registering",{position: 'bottom-center'});
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
          <p className={styles.title}>Userame</p>
          <input
            type="text"
            placeholder="Username"
            className={styles.inputBox}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
           {errors.name && <span className={styles.errors}>{errors.name}</span>}
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
          <p className={styles.title}>Phone number</p>
          <input
            type="text"
            placeholder="Phone number"
            className={styles.inputBox}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
           {errors.phone && <span className={styles.errors}>{errors.phone}</span>}
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

        <div className={styles.inputcontainer}>
          <p className={styles.title}>Confirm Password</p>
          <input
            type="password"
            placeholder="Confirm Password"
            className={styles.inputBox}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <span className={styles.errors}>{errors.confirmPassword}</span>
          )}
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
            /> : 'Register'
            }
          </button>
        </div>

        <span>
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-800 hover:underline">
            Login
          </Link>
        </span>
      
      </div>

    </div>
  )
}

export default page