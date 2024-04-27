import React, { useState } from 'react'
import './styles.css'
import Input from '../input';
import Button from '../Buttons';
import {  createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../Firebase';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();


const SignupSignin = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginForm, setLoginForm] = useState(false);
    const [confirmPassowrd, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    function loginUsingEmail() {

        if (email != "" && password.length != 0) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    toast.success(`Logged in as ${user.displayName || email}`);
                    navigate('/dashaboard');

                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage)
                });

        }
        else {
            toast.error("All fields are mandatory");
        }

    }
    function signUpwithEmail() {
        console.log("hi")
        setLoading(true)
        setName("");
        setPassword("");
        setConfirmPassword("");
        setPassword("");

        if (name != "" && password.length != 0 && confirmPassowrd === password) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    setLoading(true)
                    const user = userCredential.user;
                    toast.success("Account Created")
                    setLoading(false)
                    setLoginForm(true)
                    createDoc(user)
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                    setLoading(false)
                    // ..
                });
        }
        else {
            setLoading(false)
            toast.error("Enter Correct inputs");


        }



    }
    async function createDoc(user) {
        setLoading(true);
        if (!user) {
            return;
        }

        const useRef = doc(db, "users", user.uid);
        const userData = await getDoc(useRef);

        try {
            await setDoc(doc(db, "user", user.uid), {
                name: user.displayName ? user.displayName : name,
                email: user.email,
                photoURL: user.photoURL ? user.photoURL : "",
                createdAt: new Date()

            });
            toast.success("Doc Created");
            setLoading(false);
        } catch (error) {
            toast.error(error.message);
        }

    }
    function signupUsingGoogle() {
        setLoading(true);
        try{
            signInWithPopup(auth, provider)
            .then((result) => {
               
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                createDoc(user);
                toast.success("User Authenticated as" + user.email)
                setLoading(false);
                navigate('/dashboard')
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                toast.error(errorMessage)
                
                // ...
            });

        }
        catch(e){
            toast.error(e.message);


        }
        
    }

    return (
        <>{loginForm ? <><div className='signup-wrapper'>
            <h2 className='title'>
                Login on <span style={{ color: "var(--theme)" }}>BudgetBliss</span>
            </h2>
            <form>

                <Input type="email" label={"Email"} state={email} setState={setEmail} placeholder={"adityasharma@gmail.com"}></Input>
                <Input type="password" label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"}></Input>

                <Button disabled={loading} text={loading ? "Loading..." : "Login using Email and Password"} onClick={loginUsingEmail} />
                <p className='mid-text'>Or</p>
                <Button  text={loading ? "Loading" : "Continue with Google"} blue={true} onClick={signupUsingGoogle} />
                <p className='mid-text'>Or</p>
                <p className='mid-text'>Don't Have Account?<span className='login-signup' onClick={() => setLoginForm(false)}>Signup</span></p>

            </form>
        </div></> :
            <div className='signup-wrapper'>
                <h2 className='title'>
                    Sign Up on <span style={{ color: "var(--theme)" }}>BudgetBliss</span>
                </h2>
                <form>
                    <Input label={"Full Name"} state={name} setState={setName} placeholder={"Aditya Sharma"}></Input>
                    <Input type="email" label={"Email"} state={email} setState={setEmail} placeholder={"adityasharma@gmail.com"}></Input>
                    <Input type="password" label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"}></Input>
                    <Input type="password" label={"Confirm Passoword"} state={confirmPassowrd} setState={setConfirmPassword} placeholder={"Example@123"}></Input>
                    <Button disabled={loading} text={loading ? "Loading..." : "Signup using Email and Password"} onClick={() => signUpwithEmail()} />
                    <p className='mid-text'>Or</p>
                    <Button onClick={()=>signupUsingGoogle()} text={loading ? "Loading" : "Signup using Google"} blue={true} />
                    <p className='mid-text'>Or</p>
                    <p className='mid-text'>Already Have an account?<span className='login-signup' onClick={() => setLoginForm(true)}>Login</span></p>

                </form>
            </div>}
        </>

    )
}

export default SignupSignin;