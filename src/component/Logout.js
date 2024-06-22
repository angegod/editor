import React, { Component, useEffect } from 'react';

function Logout(){
    
    useEffect(()=>{
        localStorage.clear();
        alert("已登出");
        window.location.href=`${window.location.origin}/editor/Login`;
    },[]);
    
    
    return(<>
          
    
    </>)


}

export default Logout;