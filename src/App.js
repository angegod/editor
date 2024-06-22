import React, { useEffect, useState } from 'react';
import './css/App.css';
import axios from "axios";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import { useNavigate } from 'react-router-dom';


function App(){
    const [parData,setParData]=useState();
    //const [ParRecord,setParRecord]=useState([]);
    const [parTitle,setParTitle]=useState("");
    const [hint,setHint]=useState("");
    const user=localStorage.getItem("LoginUserId");
    const navigate=useNavigate();
       
    if(localStorage.getItem("LoginUserName")===null||localStorage.getItem("LoginUserId")===null){
        navigate('/Login');//如果沒有登入資訊，則直接跳回登入頁面
    }

    function btnClickHandle(){
            const current=new Date();

            let json={
                id:0,
                author:user,
                title:parTitle,
                createDate:current.toDateString(),
                content:parData,
                nextCommentId:1,
                comment:[]
            }
            
            console.log(json);

             
            axios.post("http://localhost:5000/par/add", json).then((response) => {
                console.log(response.status, response.data);

                setHint("文章已儲存!");
            });
       }


      return (<>
        <div className='main'>
            <div className="App">
                <div className='title'>
                    <input type='text' onChange={(e)=>setParTitle(e.target.value)} placeholder='文章標題' required/>
                </div>
                <CKEditor 
                  editor={ Editor }
                  data="<p>Hello from CKEditor 5!</p>"
                  onInit={ editor => {
                      // You can store the "editor" and use when it is needed.
                      const data = editor.getData();
                      setParData(data);
                      console.log( 'Editor is ready to use!', editor );

                      var textarea=document.querySelector("textarea");

                      textarea.id="textarea";
                  } }
                  onChange={ ( event, editor ) => {
                      const data = editor.getData();
                      setParData(data);
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
                <div className='hint' style={{display:`${hint===""?"none":"block"}`}}>
                    <span className='text-white'>{hint}</span>
                </div>
                <div className='button'>
                    <button onClick={btnClickHandle} className='bg-red-800 rounded-md w-20 text-white font-bold'>送出文章</button>
                </div>
               
            </div>
           
        </div>
            
        
    </>);
  
}

export default App
