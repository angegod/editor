import React, { Component } from 'react';
import { useEffect,useState } from 'react';
import '../css/App.css';
import axios from "axios";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import { useLocation, useNavigate } from 'react-router-dom';


function Edit(){
    const navigate=useNavigate();
    const location=useLocation();
    const [id,setId]=useState(null);
    const [author,setAuthor]=useState(null);
    const [parTitle,setParTitle]=useState("");
    const [hint,setHint]=useState("");
    const [parData,setParData]=useState();
    const [parContent,setParContent]=useState("");
    const [parDate,setParDate]=useState("");
    const user=localStorage.getItem("LoginUserId");
    

    useEffect(()=>{
        
        if(localStorage.getItem("LoginUserName")===null||localStorage.getItem("LoginUserId")===null)//如果沒有登入資訊
            navigate('/Login');

        if(location.state===null)//如果沒有文章資訊 則跳回檢視頁面
            navigate('/Check');

        //如果該登入作者不是該文章之使用者
        if(user!==author){
            alert("你無權進行操作，即將返回文章列表");
            navigate('/Check');
            return;
        }
        //確認沒有問題再進行初始化

        setId(location.state.id);
        setAuthor(location.state.author);
        const search={
            id:id,
            author:author,
            commentNum:3
        }

        axios.post("http://localhost:5000/par/search", search).then((response) => {
            if(response.data.length===0){
                console.log('No data Found');
            }else{
                console.log(response.data);
                setParData(response.data[0]);
                //初始文章內容
                setParContent(response.data[0].content);
                //初始標題
                setParTitle(response.data[0].title);
    
                setParDate(response.data[0].createDate);
                //setParContent,setMoreEnable,setCommentList,setCommentNum,
            }
        });
    },[])

    


    function btnClickHandle(){
            //const current=new Date();
            
            //編輯時目前採用不清空留言的作法
            let json={
                id:id,//文章ID
                author:user,
                title:parTitle,
                createDate:parDate,//這邊目前先採取先不變文章
                content:parContent,
            }
            
            console.log(json);

            
            axios.post("http://localhost:5000/par/Edit", json).then((response) => {
                if(response.data==="Ok200"){
                    setHint("文章已儲存!");
                }else{
                    setHint("發生錯誤，請稍後再試");
                }

                
            });
       }


      return (<>
        <div className='main'>
            <div className="App">
                <div className='title'>
                    <input type='text' onChange={(e)=>setParTitle(e.target.value)} placeholder='文章標題' value={parTitle} required/>
                </div>
                <CKEditor 
                  editor={ Editor }
                  data={parContent}
                  onInit={ editor => {
                      // You can store the "editor" and use when it is needed.
                      const data = editor.getData();
                      setParData(data);
                      console.log( 'Editor is ready to use!', editor );
                  } }
                  onChange={ ( event, editor ) => {
                      const data = editor.getData();
                      setParContent(data);
                      //console.log( { event, editor, data } );
                     
                      
                  }}
                  
                  onBlur={ ( event, editor ) => {
                      //console.log( 'Blur.', editor );
                  } }
                  onFocus={ ( event, editor ) => {
                      //console.log( 'Focus.', editor );
                  } }

                  onReady={(editor) => {
                    editor.ui.view.editable.element.style.minHeight = "500px";
                 }}/>
                
                <div className='button'>
                    <button onClick={btnClickHandle} className='bg-red-800 rounded-md w-20 text-white font-bold'>送出文章</button>
                </div>
                <div className='hint' style={{display:`${hint===""?"none":"block"}`}}>
                    <span className='text-white'>{hint}</span>
                </div>
               
            </div>
           
        </div>
            
        
    </>);
}

export default Edit;