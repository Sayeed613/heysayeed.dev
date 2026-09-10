import { useState } from "react";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Work from "./components/Work";
import Services from "./components/Services";
import Contact from "./components/Contact";
import ScrollProgress from "./components/ScrollProgress";
import ParallaxBg from "./components/ParallaxBg";
import PageTransition from "./components/PageTransition";
import CursorOverlay from "./components/CursorOverlay";
import { useSmoothScroll } from "./lib/useSmoothScroll";

function App() {
  const [loaded, setLoaded] = useState(false);
  useSmoothScroll(loaded);

  return (
    <PageTransition>
      <Loader onDone={() => setLoaded(true)} />

      {loaded && (
        <>
          <ParallaxBg />
          <ScrollProgress />
          <CursorOverlay />
          <Navbar />

          <main className="relative z-10">
            <Hero />
            <About />
            <Work />
            <Services />
            <Contact />
          </main>

          <Footer />
        </>
      )}
    </PageTransition>
  );
}

export default App;
