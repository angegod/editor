import React, { useEffect, useState,useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import '../css/parview.css';
import Slide from '../component/Slide';
import { Link } from 'react-router-dom';

//文章檢視
function ParView(){
    const location = useLocation();
    const {id,author}=location.state;//文章ID 文章作者
    
    const [ParContent,setParContent]=useState([]);//文章內容 其實可以不用同步
    const textarea=useRef(null);
    const [commentList,setCommentList]=useState([]);//其他人(包括作者本身之留言)


    const [commentNum,setCommentNum]=useState(3);//留言數量
    const [moreEnable,setMoreEnable]=useState(true);//更多留言按鈕開啟與否
    const [isModify,setIsModify]=useState(false);
    const [showPNum,setShowPNum]=useState(1);

    const userName=localStorage.getItem("LoginUserName");
    const userId=localStorage.getItem("LoginUserId");
    
    useEffect(()=>{
        const search={
            id:id,
            author:author,
            commentNum:commentNum
        }
    
        axios.post("http://localhost:5000/par/search", search).then((response) => {
            if(response.data.length===0){
                console.log('No data Found');
            }else{
                console.log(response.data);
                setParContent(response.data[0]);
                const contentNode=document.getElementById('content');
                contentNode.innerHTML=response.data[0].content;
                var pList=document.getElementById("content").querySelectorAll("p");
                pList[0].classList.add("show");
               

                setCommentList(response.data[0].comment);
                //setParContent,setMoreEnable,setCommentList,setCommentNum,
            }
        });

        //如果文章作者跟目前使用者是同一人(需用ID區分)
        if(userId===author)
            setIsModify(true);
    },[])


    function MoreParSection(){

        let list=[];

        for(var i=1;i<=15;i++){
            list.push(<>
                <div className='ParBox' key={'parbox'+i}>
                    <div className='inner'>
                        <img src='https://preview.redd.it/im-done-done-with-jingliu-uwu-face-v0-841ydyuryzsb1.jpeg?width=1201&format=pjpg&auto=webp&s=fd5d44382d272eecbd2aa60554fb011787155daf' alt='' />
                        <span>測試標題{i}</span>
                    </div>
                </div>
            </>)
        }


        return(<>
            <Slide />
            
        </>)
    }

    //獲取日期字串
    function GetDateString(){
        const current=new Date();

        const result=current.toISOString().split('T')[0];

        return result;
    }

    function DeleteCommit(index){
        const json={
            id:index,//留言ID
            parAuthor:author,//文章作者
            parId:id
        };

        axios.post("http://localhost:5000/par/deleteComment", json).then((response) => {
            if(response.data.length===0){
                console.log('No data Found');
                return;
            }
            if(response.data==="Ok200"){
                alert("留言已刪除");
                const parsedUrl = new URL(window.location.href);
                window.location.href=parsedUrl;
            }
        });

        return;
    }

    //新增留言
    function AddComment(){
    
        const json={
            id:id,
            author:userId,//當前登入者
            parAuthor:author,//文章作者
            comment:textarea.current.value,
            createDate:GetDateString(),
            commentNum:commentNum//這樣系統才知道妳需要多少筆資料
        };

        console.log(json);

        //儲存留言資訊並重新拿回目前所展示的留言資訊
        axios.post("http://localhost:5000/par/pushComment", json).then((response) => {
            if(response.data.length===0){
                console.log('No data Found');
            }else{
                console.log(response.data);
                setCommentList(response.data);
            }
        });
    }

    function OthersComment(){
        const list=commentList.map((c,i)=><>
            <div className='comment' key={'comment'+i}>
                <div className='author flex flex-row justify-between'>
                    <span className='text-amber-900 text-base font-bold'>{c.author}</span>
                    <button className={`bg-white w-10 rounded ${(c.author===userId)?'':'hidden'}`} onClick={()=>DeleteCommit(c.id)}>刪除</button>
                    
                </div>
                <div className='details'>
                    <span className='text-black'>{c.comment}</span>
                    <span className='text-gray-700'>{c.createDate}</span>
                </div>
            </div>
            <hr className='opacity-50' key={'hr'+i}/>
        </>)
        
        
        return(<>
            {list}
        </>)
    }

    function DeletePar(){
        //console.log(author!==userId);
        const json={
            id:id,
            author:author
        }
        
        if(author!==userId){
            console.log('這不是你的文章，你無權操作!!');
            return
        };
        
        axios.post("http://localhost:5000/par/delete", json).then((response) => {
            if(response.data==="Ok200"){
                alert("文章已刪除");
                window.location.href="http://localhost:3000/editor/Check";
            }else{
                alert("發生系統性錯誤，請稍後再試");
            }    
        });
    };


    function getMoreComment(){

        let promise=new Promise((resolve,reject)=>{
            setCommentNum((num)=>num=num+3);
            resolve(commentNum+3);
        });
        promise.then((value)=>{
            const json={
                id:id,
                author:author,
                commentNum:value
            }
            console.log(json);
    
            axios.post("http://localhost:5000/par/getComment", json).then((response) => {
                if(response.data.length===0){
                    console.log('No data Found');
                }else{
                    console.log(response.data);
                    setCommentList(response.data.comment);
                    setMoreEnable((response.data.isAllGet)?false:true);
                }
            });
        })
    }
    
    function loadcontent(){//讓文章逐行顯示
        var pList=document.getElementById("content").querySelectorAll("p");

        if(pList[2*showPNum]!==undefined){
            pList[2*showPNum-1].classList.add('show');
            pList[2*showPNum].classList.add('show');

            setShowPNum((num)=>num+=1);

            //讓視窗跟著滾動
            console.log(document.getElementById("content").scrollTop);
            window.scrollTo(0,document.getElementById("content").offsetHeight-200);
        }   
        
    }
    
    return(<>
        <div className='ParView'>
            <div className='title mb-3'>
                <div className='flex flex-row justify-between'>
                    <span className='text-2xl font-bold text-amber-400 animate-bounce'>{ParContent.title}</span>
                    <div className='flex flex-row'>
                        <button className={`transition duration-500 bg-white w-20 rounded ${(isModify)?'':'hidden'} h-8 hover:bg-amber-900`} onClick={DeletePar}>
                            <span className='transition duration-500 cursor-pointer text-black text-base flex justify-center hover:text-white' style={{fontWeight:'initial'}}>刪除</span>
                        </button>
                        <button className={`transition duration-500 bg-white w-20 rounded ${(isModify)?'':'hidden'} h-8 hover:bg-amber-900`} >
                            <Link to="/Edit" state={{id:id,author:author}}>
                                <span className='transition cursor-pointer text-black text-base flex justify-center hover:text-white' style={{fontWeight:'initial'}}>編輯</span>
                            </Link>
                        </button>
                    </div>
                </div>
                
                <div className='ParDetails'>
                    <span>{ParContent.createDate}</span>
                    <span>作者:{ParContent.author}</span>
                </div>
            </div>
            <hr/>
            <div className='content mt-3' id="content" onClick={loadcontent}>

            </div>
            
            <hr/>
            <div className='MoreParSection'>
                <span className='text-black font-bold'>更多文章...</span><br/>
                <MoreParSection />
            </div>
            <hr/>
            <div className='InputComment'>
                <span className='text-black font-bold'>想留言嗎...</span><br/>
                <span>以 <label className='author font-bold'>{userName}({userId})</label> 的身分發表言論:</span>
                <textarea className='InputComment rounded-md pl-2' placeholder='想說甚麼話在這邊說喔!' ref={textarea}></textarea>
                <div className='msgButton'>
                    <button className='addComment bg-white rounded-md w-10' onClick={AddComment}>留言</button>
                </div>
            </div>
            <hr/>
            <div className='othersComment'>
                <OthersComment />
                <div className={`mt-5 moreCommentBtn ${(moreEnable)?'block':'hidden'}`}>
                    <button className='text-black' onClick={getMoreComment}>更多留言</button>
                </div>
            </div>
            
        </div>
    </>)
}

export default ParView;