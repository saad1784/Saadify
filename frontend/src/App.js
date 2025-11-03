/* global fbq */
import './App.css';
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Header from './component/layout/Header.jsx';
import Footer from './component/layout/Footer.jsx';
import useUserRoutes from "./component/routes/UserRoutes.jsx";
import useAdminRoutes from "./component/routes/AdminRoutes.jsx";
import { Toaster } from "react-hot-toast";
import NotFound from './component/layout/NotFound.jsx';
import { useEffect } from 'react';

// Fires PageView on every route change (SPA)
function ScrollToTopAndPixel() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fire PageView only once per route per session
    if (window.fbq && !sessionStorage.getItem(`pageviewFired_${location.pathname}`)) {
      fbq('track', 'PageView');
      sessionStorage.setItem(`pageviewFired_${location.pathname}`, 'true');
    }
  }, [location]);

  return null;
}

function App() {
  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();

  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />

        <ScrollToTopAndPixel />

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