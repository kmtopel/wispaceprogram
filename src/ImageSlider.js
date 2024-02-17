//create react compoonent
import React from 'react';

class ImageSlider extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var slideIndex = 0;
        const numSlides = this.props.images.length;
        
        const decrementSlideIndex = () => {  
            if (slideIndex > 0) {
                slideIndex--;
            }
            else {
                slideIndex = numSlides - 1;
            }
            console.log(slideIndex);
        }

        const incrementSlideIndex = () => {
            if (slideIndex < numSlides - 1) {
                slideIndex++;
            }
            else {
                slideIndex = 0;
            }
            console.log(slideIndex);
        }

        return (
            // return all images saved in props as images
            <div className="imgSlider">
                <button onClick={decrementSlideIndex}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <div className='imgSlider__wrapper'>
                    <div className='imgSlider__slider'>
                        {
                            this.props.images.map((image, i) => {
                                return (
                                    <img 
                                        width="100%"
                                        height="auto"
                                        className={i === 0 ? 'active' : ''}
                                        key={i} 
                                        src={image.img} 
                                        alt={image.alt} 
                                    />
                                )
                            })
                        } 
                    </div>
                    <div class="imgSlider__thumbnails">
                      {
                            this.props.images.map((image, i) => {
                                let index = 'thumbnail-' + i;
                                return (
                                    <a href="#" key={index}>
                                        <img 
                                            id={index}
                                            src={image.img} 
                                            alt={image.alt} 
                                        />
                                    </a>
                                )
                            })
                        } 

                    </div>
                </div>
                <button onClick={incrementSlideIndex}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
            </div>
        )
    }
}

export default ImageSlider;
