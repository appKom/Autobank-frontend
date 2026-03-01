import Navbar from "./components/universal/Navbar";
import "./App.css";
import Router from "./pages/Router";
import { logoutUser } from "./utils/userutils";
import useAutobankStore from "./store/autobankstore";
import Footer from "./components/universal/Footer";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { Analytics } from "@vercel/analytics/react"



function App() {

  const auth = useAuth();
   if (auth.isAuthenticated) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${auth.user?.access_token}`
  }

  return (
   
      <div className="App bg-[#2e6e53]">
        <Navbar />
        <Router/>
             <Footer />
        <Analytics />
      </div>  


  );
}

export default App;
