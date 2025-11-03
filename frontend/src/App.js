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
    // Fire PageView only once per session
    if (typeof window !== "undefined" && window.fbq) {
      if (!sessionStorage.getItem("pageviewFired")) {
        fbq('track', 'PageView');
        sessionStorage.setItem("pageviewFired", "true");
      }
    }

    // Clear sessionStorage flag when user leaves the website
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