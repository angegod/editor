import React, { useState } from 'react';
import '../css/Login.css';
import axios from 'axios';
function Login(){
    const [account,setAccount]=useState("");
    const [password,setPassword]=useState("");
    
    function LoginHandle(){
        const json={
            account:account,
            password:password
        };

        //回傳建議必須要包含帳號ID
        axios.post("http://192.168.0.64:5000/sql/login", json).then((response) => {
            if(response.data!==null){
                alert("歡迎回來,"+response.data.accName);
                localStorage.setItem("LoginUserId",response.data.accId);
                localStorage.setItem("LoginUserName",response.data.accName);
                window.location.href="http://localhost:3000/editor/Check";
            }else{
                alert("帳號或密碼輸入有誤");
            }
            
        }).catch(err=>console.log('目前無法連線'));
    }


    return(<>
        <div className='LoginSection'>
            <div className='Login'>
                <div className='form'>
                    <div className='loginLabel mb-5'>
                        <span className='text-amber-800 text-2xl font-bold '>登入LOGIN</span>
                    </div>
                    <div className='input mb-10'>
                        <span className='text-black mb-5'>帳號:</span>
                        <input type='text'  placeholder='使用者名稱' onChange={(e)=>setAccount(e.target.value)}/>
                    </div>
                    <div className="input mb-10">
                        <span className='text-black mb-5'>密碼:</span>
                        <input type='password'  placeholder='密碼' onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                    <div className='submit'>
                        <button onClick={LoginHandle}>Login</button>
                    </div>
                    <div className=''>
                        
                    </div>
                </div>
            </div>
        </div>   
    </>)
}

export default Login;