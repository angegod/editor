import React, { Component, useEffect, useState } from 'react';
import {Routes,Route, Link} from 'react-router-dom';

//引用分頁
import App from '../App';//首頁
import Check from './Check';//查看指定作者之文章頁面
import ParView from './ParView';//查看指定文章
import Login from './Login';//登入
import Logout from './Logout';
import Edit from './Edit';
import Type from './Type';


import '../css/menu.css';
import Test from './Test';

function Menu(){
    const [LoginLabel,setLoginLabel]=useState("");
    const [isLogin,setIsLogin]=useState(false);
   

    useEffect(()=>{
        if(localStorage.getItem("LoginUserName")===null||localStorage.getItem("LoginUserId")===null){
            setLoginLabel("尚未登入");
        }else{
            var authorName=localStorage.getItem("LoginUserName").toString();
            var authorId=localStorage.getItem("LoginUserId").toString();
            
            var label=`${authorName}(${authorId}),歡迎回來`;
            setLoginLabel(label);
            setIsLogin(true);
        
        }
        
    },[])
    //為了安全起見，這邊選單將會區分登入跟不登入兩種

    function ShowMenu(){
        if(isLogin){
            return(<>
                <div className='bg-gradient-to-r from-amber-900 '>
                    <ul style={{width:'auto'}}>
                        <li className={`menuOptions ml-10 ${(isLogin)?'':'invisible'}`}><Link to="/">新增文章</Link></li>
                        <li className={`menuOptions ml-10 ${(isLogin)?'':'invisible'}`}><Link to="/Check">檢視文章</Link></li>
                        <li className={`menuOptions ml-10`}><Link to="/Type">測試</Link></li>
                        
                        <li className={`menuOptions ml-10 ${(isLogin)?'':'invisible'}`} ><Link to="/Logout">登出</Link></li>
                        <li className='authorSpan'><span>{LoginLabel}</span></li>
                    </ul>
                </div>
            </>)
        }else{//如果還沒登入 則只顯示登入按鈕
            return(<>
                <div className='bg-gradient-to-r from-amber-900 '>
                    <ul style={{width:'auto'}}>
                        <li className={`menuOptions ml-10 ${(isLogin)?'invisible':''}`} ><Link to="/Login">登入</Link></li>
                        <li className={`menuOptions ml-10`}><Link to="/Type">測試</Link></li>
                        <li className='authorSpan'><span>{LoginLabel}</span></li>
                    </ul>
                </div>
            </>)
        }
    }
    


    return(<>
        <div className='menu'>
            <ShowMenu/>
            <Routes>
                <Route path="/" element={<App/>} />
                <Route path="/Check" element={<><Check/></>} />
                <Route path="/ParView" element={<><ParView /></>} />
                <Route path="/Login" element={<><Login/></>} />
                <Route path="/Logout" element={<><Logout/></>} />
                <Route path="/Edit" element={<><Edit /></>} />
                <Route path="/Type" element={<><Type/></>} />
                <Route path="/Test" element={<><Test/></>} />
            </Routes>
        </div>
    </>)
}

export default Menu;