/* global fbq */
import './App.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from './component/layout/Header.jsx';
import Footer from './component/layout/Footer.jsx';
import useUserRoutes from "./component/routes/UserRoutes.jsx";
import useAdminRoutes from "./component/routes/AdminRoutes.jsx";
import { Toaster } from "react-hot-toast";
import NotFound from './component/layout/NotFound.jsx';
import { useEffect } from 'react';

function App() {
  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();

  useEffect(() => {
    // Initialize Meta Pixel only once
    if (typeof window !== "undefined" && !window.fbq) {
      (function(f,b,e,v,n,t,s){
        if(f.fbq) return;
        n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq) f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
      })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', 'YOUR_PIXEL_ID'); // Replace with your Pixel ID
    }

    // Fire PageView only once per session
    if (typeof window !== "undefined" && window.fbq && !sessionStorage.getItem("pageviewFired")) {
      fbq('track', 'PageView');
      sessionStorage.setItem("pageviewFired", "true");
    }

    // Clear sessionStorage flag when user leaves
    const handleUnload = () => {
      sessionStorage.removeItem("pageviewFired");
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />
        <div id="align">
          <Routes>
            {userRoutes}
            {adminRoutes}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;