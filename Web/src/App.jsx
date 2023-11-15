import Hero from "./components/Hero";
import { StickyNavbar } from "./components/StickyNavbar";
import ImageUpload from "./components/UploadImage";

function App() {
  return (
    <div>
      <StickyNavbar/>
      <div>
        <Hero/>
        <ImageUpload/>
      </div>
    </div>
    
  );
}
export default App;
