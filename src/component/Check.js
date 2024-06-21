import React, { useRef } from 'react';
import { useEffect,useState } from 'react';
import axios from 'axios';
import '../css/check.css';
import {Link} from 'react-router-dom';



function Check(){
    
    const [parTotal,setParTotal]=useState([]);
    const pageNumber=useRef(1);//預設搜尋結果頁數為第一頁 顯示目前所在頁數
    const pageCount=useRef(5);
    const MaxPageNumber=useRef(1);
    const [searchText,setSearchText]=useState("");
    
    //改由按鈕觸發
    function getData(){
        const search={
            author:searchText,//改由使用者輸入作者，目前無法做關鍵字
            pagenumber:pageNumber.current,//目前頁數
            pagecount:pageCount.current //一頁需有幾筆資料
        }
        console.log(pageNumber);

        axios.post("http://localhost:5000/par/get", search).then((response) => {
            if(response.data.length===0){
                console.log('No data Found');
                setParTotal([]);
                MaxPageNumber.current=1;
            }else{
                console.log(JSON.parse(response.data.content).length);
                setParTotal(JSON.parse(response.data.content));
                MaxPageNumber.current=parseInt((JSON.parse(response.data.content).length/pageCount.current))+1;
            }
        });
    }

    function changePageNumber(value){
        const newvalue=pageNumber+value;
        pageNumber.current=newvalue;
        getData();
    }
    
    //文章訊息:標題 作者 創作日期 檢視文章按鈕
    function SearchResult(){
        if(parTotal.length!==0){
            const list=parTotal.map((item,index)=><>
                <div className='parDetails' key={'search'+index}>
                    <div className='title'>
                        <Link to="/ParView" state={{id:item.id,author:item.author}}><span className='text-gray-400 font-bold'>{item.title}</span></Link>
                    </div>
                    <div className='author'>
                        <span>{item.author}</span>
                    </div>
                    <div className='createDate'>
                        <span>{item.createDate}</span>
                    </div>
                </div>
            </>)
    
            return(<    >
                <div className='searchTotal pt-5'>
                    {list}
                    <div className='pagescount'>
                        <div className='PageNumBtn'>
                            <button disabled={pageNumber.current===1} onClick={()=>changePageNumber(-1)}>上一頁</button>
                        </div>
                        <span className='text-white'>目前為第{pageNumber.current}頁/總共有{MaxPageNumber.current}頁</span>
                        <div className='PageNumBtn'>
                            <button disabled={pageNumber.current===MaxPageNumber.current} onClick={()=>changePageNumber(1)}>下一頁</button>
                        </div>
                    </div>
                </div>
    
                
            </>)
        }else{
            return(<>
                <div className='searchTotal'>
                    <h2 className='text-white mt-10 text-2xl'>該作者尚無發表文章或該名作者不存在!QAQ</h2>
                </div></>)
        }
    }

    return(<>
        <div className='searchInput'>
            <input type='text' placeholder='作者搜尋' className='rounded w-1/4 pl-2' onChange={(e)=>setSearchText(e.target.value)}/>
            <button className='bg-blue-500 w-20 rounded text-white ml-2.5 h-10' onClick={getData}>搜尋</button>
        </div>
        <SearchResult/>
    </>)
}

export default Check;