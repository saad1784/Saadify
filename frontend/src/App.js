import './App.css';
import {Route, BrowserRouter as Router,Routes} from "react-router-dom";
import Header from './component/layout/Header.jsx';
import Footer from './component/layout/Footer.jsx';
import useUserRoutes from "./component/routes/UserRoutes.jsx";
import useAdminRoutes from "./component/routes/AdminRoutes.jsx";
import {Toaster} from "react-hot-toast";
import NotFound from './component/layout/NotFound.jsx';

function App() {
  const userRoutes=useUserRoutes();
  const adminRoutes=useAdminRoutes();
  return(
    <Router>
    <div className="App">
      <Toaster position="top-center" />
    <Header />
    <div id="align">
<Routes >{userRoutes}{adminRoutes}<Route path="*" element={<NotFound />}/></Routes>
</div>
   <Footer />

    </div>
    </Router>
  );
}

export default App;
