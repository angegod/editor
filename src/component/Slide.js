import React, { useRef } from 'react';
import Slider from 'react-slick';
import '../css/Slide.css';

function Slide(){
    const content=[];
    let sliderRef=useRef(null);

    for(var i=1;i<=5;i++){
        content.push(<>
            <div className='row'>
                <div className='textbox bg-red-950'>
                    <span>{5*i-4}</span>
                </div>
                <div className='textbox bg-red-800'>
                    <span>{5*i-3}</span>
                </div>
                <div className='textbox bg-red-600'>
                    <span>{5*i-2}</span>
                </div>
                <div className='textbox bg-red-400'>
                    <span>{5*i-1}</span>
                </div>
                <div className='textbox bg-red-200'>
                    <span>{5*i}</span>
                </div>
            </div>
            
        </>)
    }

    function previous(){
        sliderRef.slickPrev();
    }

    function next(){
        sliderRef.slickNext();
    }

    const settings = {
        infinite: true,
        dots: true,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        cssEase: "ease-in-out",
    };
    return(<>
        <div className="slider-container flex flex-row">
            <button className="buttons" onClick={previous}>
                <img src={require('../image/left.png')} alt='left'/>
            </button>
            <Slider {...settings}  ref={slider => {
                sliderRef = slider;
            }}>
                {content}
            </Slider>
            <button className="buttons" onClick={next}>
                <img src={require('../image/right.png')} alt='right' />
            </button>
        </div>
    </>)
}

export default Slide;