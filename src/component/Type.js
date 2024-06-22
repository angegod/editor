import React, { useState,useRef, useEffect} from 'react';
import '../css/Type.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { ReactTyped } from "react-typed";
import Creatable from 'react-select/creatable';

const Test=React.memo(()=>{
    const parText=useRef(undefined);
    const [parContent,setParContent]=useState([]);//文章文本
    const options=useRef([]);//select選項\
    const colorOptions=useRef([]);//對應腳色(包括未知及旁白)的對應顏色
    const selected=useRef({});//這個可能可以優化掉
    const defaultColor='#000000';

    const MainEditor=useRef(null);//文字編輯器
    const CharSelected=useRef(null);//腳色Select標籤
    const InputColor=useRef();//顏色input
    const InputTitle=useRef();//文章標題

    const isEdit=useRef(false);//編輯模式 true代表處於編輯狀態，false代表處於新增模式
    const EditIndex=useRef(null);    

    function SaybySection(){
        const [InputAble,setInputAble]=useState(true);
        function radioHandle(val){
            if(val===2){
                const json={
                    label: '旁白',
                    value: '旁白', 
                    __isNew__: false
                };
                selected.current=json;
                setInputAble(false);
                InputColor.current.disabled=true;
                return;
            }

            if(val===3){
                const json={
                    label: '? ? ?',
                    value: 'unknown', 
                    __isNew__: false
                };
                selected.current=json;
                setInputAble(false);
                InputColor.current.disabled=false;

                selectchange(json);
                return;
            }
            setInputAble(true);
            InputColor.current.disabled=false;
            return;
        }
        
        //新增按鈕按下時 執行下面方法
        function btnOptionsSaved(){
            if(parText.current===undefined){
                alert("文章輸入不可以為空");
                return;
            }
            //更改之前文章有關指定腳色顏色
            let characters=selected.current.value;//目前所選擇的腳色
            const parser=new DOMParser();

            var oldContent=parContent;
            oldContent.forEach((element)=>{
                let doc=parser.parseFromString(element.content,'text/html');
                let p=doc.querySelector('p');
                console.log(p);
                
                if(p===undefined||p===null)
                    return;
                if(p.dataset.char===characters){
                    console.log('color changes');
                    p.dataset.color=InputColor.current.value;
                }
                element.content=p.outerHTML.toString();
            });

    
            //在p加入是誰說的，如果是旁白則略過這個環節       
            const htmldoc=parser.parseFromString(parText.current, 'text/html');
            const searchP=htmldoc.querySelector('p');
            searchP.dataset.char=characters;
            searchP.dataset.color=InputColor.current.value;

            const json={
                char:characters,
                content:searchP.outerHTML
            }
            
            //儲存新節點文章
            oldContent.push(json);
            
            setParContent((old)=>[...oldContent]);

            //儲存腳色偏好顏色
            const ColorJson={
                char:characters,
                color:InputColor.current.value
            }

            //如果腳色顏色是新增 則直接新增，反之對顏色修改
            var target=colorOptions.current.find((o)=>o.char===characters)
            if(target===undefined)
                colorOptions.current.push(ColorJson);
            else
                target.color=InputColor.current.value;
            
            //console.log(colorOptions);
            
            //先找腳色標籤

            //回到預設值
            selected.current={};
            InputColor.current.value=defaultColor;
            if(MainEditor.current!==null){        
                MainEditor.current.setData('');
            }
        }

        
       
        //腳色選擇變更
        function selectchange(c){
            if(c.__isNew__){
                const newOptions={
                    label: c.label,
                    value: c.value, 
                    __isNew__: false
                }

                options.current.push(newOptions);
                selected.current=newOptions;
                InputColor.current.value=defaultColor;//將顏色設為預設顏色(黑色)
            }else{
                var targetColor=colorOptions.current.find((o)=>o.char===c.value);
                
                if(targetColor===undefined)
                    return;
                InputColor.current.value=targetColor.color;
                selected.current=c;
            }
        }
        
        //編輯文本內容變動
        function EditSaved(){
            let UpdateText=MainEditor.current.getData();
            let characters=selected.current.value;
            let oldContent=parContent;
            let targetPar=oldContent[EditIndex.current];

            //改變腳色顏色-->options
            var targetColorOptions=colorOptions.current.find((o)=>o.char===characters)
            if(targetColorOptions===undefined||targetColorOptions===null){
                let colorJson={
                    char:characters,
                    color:InputColor.current.value
                }

                colorOptions.current.push(colorJson);
            }else{
                targetColorOptions.color=InputColor.current.value;
            }
            
            //改變腳色顏色或腳色對象-->json

            const parser=new DOMParser();
            let p=parser.parseFromString(targetPar.content,'text/html').querySelector('p');
            let newp=parser.parseFromString(UpdateText,'text/html').querySelector('p');
            p.innerHTML=newp.innerHTML;
        
            p.dataset.color=InputColor.current.value;
            p.dataset.char=characters;
            console.log(p.outerHTML);
            //改變文本內容-->JSON
            targetPar.content=p.outerHTML;
            oldContent[EditIndex.current]=targetPar;

            //同步腳色顏色
            oldContent.forEach((element)=>{
                let doc=parser.parseFromString(element.content,'text/html');
                let p=doc.querySelector('p');
                console.log(p);
                
                if(p===undefined||p===null)//防呆
                    return;
                if(p.dataset.char===characters){
                    console.log('color changes');
                    p.dataset.color=InputColor.current.value;
                }
                element.content=p.outerHTML.toString();
            });
            //更改JSON並推送
            setParContent((old)=>[...oldContent]);

            console.log(oldContent);
            
            //復原並取消編輯模式
            selected.current={};
            InputColor.current.value=defaultColor;
            if(MainEditor.current!==null){        
                MainEditor.current.setData('');
            }
            isEdit.current=false;
            EditIndex.current=null;
        }

        //文章儲存
        return(<>
            <div>
                <span className='text-black font-bold text-lg'>台詞歸屬:</span><br/>
                <div className='mt-1'>
                    <div className='w-3/4'>
                        <input type='radio' name='sayby' value={1} defaultChecked onClick={()=>radioHandle(1)}/><label className='mr-3 text-white'>角色</label>
                        <div className='flex flex-row'> 
                            <Creatable options={options.current} onChange={(choice)=>selectchange(choice)}  isDisabled={!InputAble} ref={CharSelected}/><br/>
                            <input type='color' name='color' className='rounded h-auto' ref={InputColor}/>
                        </div>
                    </div>
                    <div className='w-3/4'>
                        <input type='radio' name='sayby' value={2} onClick={()=>radioHandle(2)}/><label className='mr-3 text-white'>旁白(第三者)</label><br/>
                    </div>
                    <div className='w-3/4'>
                        <input type='radio' name='sayby' value={3} onClick={()=>radioHandle(3)}/><label className='mr-3 text-white'>未知</label>
                    </div>               
                </div>
                <div>
                    <button className='transition duration-500 bg-white rounded w-20 hover:text-white hover:bg-amber-900' onClick={()=>(isEdit.current)?EditSaved():btnOptionsSaved()}>{(isEdit.current)?'編輯':'新增'}</button>
                </div>
            </div>
        </>)
    }

    function InitSection(){

        function SavePar(){
            let par='';

            parContent.forEach((p)=>par+=p.content);

            const current=new Date();

            let json={
                id:0,
                author:'minger',
                title:InputTitle.current.value,
                createDate:current.toDateString(),
                content:par,
                nextCommentId:1,
                comment:[]
            };
         
            /*axios.post("http://localhost:5000/par/add", json).then((response) => {
                console.log(response.status, response.data);

                setHint("文章已儲存!");
            });*/            
        }

        return(<>
            <div>
                <span className='text-black font-bold text-lg'>文章設定:</span><br/>
                <div className='mt-1 mb-1'>
                    <span>文章標題:</span>
                    <input type='text' name='title' placeholder='par' className='rounded pl-2 pb-1' ref={InputTitle}/>
                    <button className='mt-5 transition duration-500 bg-white rounded w-20 hover:text-white hover:bg-amber-900' onClick={SavePar} >儲存</button>
                </div>
            </div>
        </>)
    }

    //載入編輯片段 並且將按鈕文字改成編輯
    function EditContent(index){
        let targetPar=parContent.find((p,i)=>index===i);
        EditIndex.current=index;
        //console.log(targetPar);
        MainEditor.current.setData(targetPar.content);
        
        let parser=new DOMParser();
        let p=parser.parseFromString(targetPar.content,'text/html').querySelector('p');

        InputColor.current.value=p.dataset.color;
        //console.log(document.querySelectorAll('[name="sayby"]')[0].checked);
        if(p.dataset.char==='旁白'){
            document.querySelectorAll('[name="sayby"]')[1].click();
        }
        else if(p.dataset.char==='unknown'){
            document.querySelectorAll('[name="sayby"]')[2].click();
        }else{
            let targetOptions=options.current.find((o)=>o.value===p.dataset.char);
            document.querySelectorAll('[name="sayby"]')[0].click();
            CharSelected.current.selectOption(targetOptions);
        }

        isEdit.current=true;
        return;
    }

    


    //當我送出新片段的時候，則會及時改變腳色之對應顏色
    function EffectSection(){
        let list=[];
        console.log(parContent);
        parContent.forEach((p,i) => {
            const parser=new DOMParser();
            const parElement=parser.parseFromString(p.content, 'text/html');
            const searchP=parElement.querySelector('p');
            
            let characters=searchP.dataset.char;
            let colors=searchP.dataset.color;
            //console.log(characters);            

            if(searchP===null)//防呆
                return;

            //如果是最新的對話，則使用打字特效
            if(parContent.length===i+1){
                if(searchP.dataset.char==='旁白'){
                    list.push(<>
                        <div class='blinker flex hover:bg-slate-400 [&>span:nth-child(2)]:break-all' onClick={()=>EditContent(i)}>
                            <ReactTyped strings={[p.content]} typeSpeed={50}/>
                        </div>
                    </>);
                }else{
                    list.push(<>
                        <div class='blinker flex hover:bg-slate-400 [&>span:nth-child(2)]:break-all' onClick={()=>EditContent(i)}>
                            <span className='font-bold break-keep' style={{color:`${colors}`}} data-char={characters}>{(characters==='unknown')?'???':characters}:</span>
                            <ReactTyped strings={[p.content]} typeSpeed={50}/>
                        </div>
                    </>);
                }
            }else{//反之則不使用打字特效
                if(searchP.dataset.char==='旁白'){//旁白
                    console.log('旁白');
                    list.push(<>
                        <div className='text-white hover:bg-slate-400 [&>p]:break-all' dangerouslySetInnerHTML={{__html:searchP.outerHTML}} onClick={()=>EditContent(i)}></div>
                    </>)                    
                }else{
                    let content=`<span style="color:${colors}"  data-char=${characters}>${(characters==='unknown')?'???':characters}</span>:`+searchP.outerHTML;
                    list.push(<>
                        <div className='text-white flex [&>span]:font-bold [&>span]:break-keep [&>p]:break-all hover:bg-slate-400' dangerouslySetInnerHTML={{__html:content}} onClick={()=>EditContent(i)}></div>
                    </>)
                }
            }
        });

        return(<>
            <div className='flex flex-col [&>div]:mt-2 [&>div]:mb-2' id="effect">
                {list}
            </div>
        
        </>)
    }

    return(<>
        <div className='w-3/5 bg-gray-500 ml-auto mr-auto rounded-md mt-10 pt-10 pb-10 flex flex-col' >
            <div className='w-4/5 ml-auto mr-auto flex flex-row flex-wrap '>
                <EffectSection />
            </div>
            <hr className='w-4/5 ml-auto mr-auto'/>
            <div className='w-4/5 ml-auto mr-auto flex flex-row flex-wrap mt-3'>
                <div className='w-2/5 flex flex-col mb-5 max-lg:w-[100%]'>
                    <InitSection />
                    <SaybySection />
                </div>
                <div className='w-3/5 editor max-lg:w-[100%]'>
                    <CKEditor 
                        editor={ Editor }
                        data=""
                        onInit={ editor => {
                            // You can store the "editor" and use when it is needed.
                            const data = editor.getData();
                            parText.current=data;
                        } }
                        
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            parText.current=data;
                        }}

                        onBlur={ ( event, editor ) => {
                            //console.log( 'Blur.', editor );
                        } }
                        
                        onFocus={ ( event, editor ) => {
                            //console.log( 'Focus.', editor );
                        } }

                        onReady={(editor) => {
                            MainEditor.current=editor;
                        
                        }} />
                </div>
               
            </div>
           
        </div>
    </>)
})

export default Test;