import React, { Component, useEffect } from 'react';

function Logout(){
    
    useEffect(()=>{
        localStorage.clear();
        alert("已登出");
        window.location.href="http://localhost:3000/editor/Login";
    },[]);
    
    
    return(<>
          
    
    </>)


}

export default Logout;