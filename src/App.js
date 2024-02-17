import photo1 from './images/DSCF7157.jpeg';
import photo2 from './images/WISPACEPROG12814.jpeg'; 
import photo3 from './images/WISPACEPROG12849.jpeg';
import photo4 from './images/WISPACEPROG12881.jpeg';
import showerPoster1 from './images/426270568_10160065350283315_748515258453764870_n.jpg';

import ImageSlider from './ImageSlider.js';
import ShowList from './ShowList.js';


const images = [
  {img: photo1, alt: "Wisconsin Space Program"},
  {img: photo2, alt: "Wisconsin Space Program"},
  {img: photo3, alt: "Wisconsin Space Program"},
  {img: photo4, alt: "Wisconsin Space Program"}
];

const shows = [
  {
    date: "3/15/2024",
    time: "8:00 PM",
    cover: "$10", 
    venue: "Linneman's Riverwest Inn", 
    address: "1001 E Locust St, Milwaukee, WI 53212",
    googleMapLink: "https://maps.app.goo.gl/tqP5Nrn6k6EiDsx28",
    eventPage: "https://www.facebook.com/events/1100728137631051?ref=newsfeed",
    showPoster: showerPoster1

  },
];

function App() {
  return (
    <div className="App">
      <header>
        <h1>Wisconsin Space Program</h1>
      </header>
      <ShowList 
          shows={
            shows
          }
      />
      <ImageSlider 
          images={
            images
          }
        />
      
    </div>
  );
}

export default App;
