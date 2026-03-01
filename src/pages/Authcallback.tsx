import { useEffect, useState } from "react";
import Navbar from "../components/universal/Navbar";
import Spinner from "../components/universal/Spinner";
import { Link, useNavigate } from "react-router-dom";
import useAutobankStore from "../store/autobankstore";
import { checkCookie, setCookie } from "../api/authAPI";
import { useAuth } from "react-oidc-context";


export interface checkUserResponse {
  success: boolean;
  isadmin: boolean;
  issuperadmin: boolean;
  expiresat: string;
  fullname: string;
}

const Authcallback = () => {


  const { setUserInfo } = useAutobankStore();
  const auth = useAuth();
  const { isAuthenticated, user } = auth;
  const navigate = useNavigate();
  const [loadingStatus, setLoadingStatus] = useState("Henter informasjon");

  const [redirectNotWorking, setRedirectNotWorking] = useState(false);


  const storeUser = async () => {
    try {
      if (isAuthenticated && user) {
        setLoadingStatus("Sjekker informasjon");
        const data = await checkCookie();
        

        setLoadingStatus("Gyldig informasjon");
    
        setUserInfo(data);

        setLoadingStatus("Videresender");
        setTimeout(() => {
          setRedirectNotWorking(true);
        }
          , 2000);
        navigate("/");
      }
    } catch (e) {
      setLoadingStatus("Feil oppstod");
      console.error(e);
    }
  };

  useEffect(() => {
    storeUser();
  }, [isAuthenticated, user]);

  return (
    <div>
      <div className="mt-[100px] font-bold text-xl text-white">
        <Spinner size={4} color="green" />
        <p className="mt-[20px] text-green">Vennligst vent</p>
        {!redirectNotWorking && <p className="mt-[20px] text-sm text-green">{loadingStatus}</p>}
        {redirectNotWorking && <Link className="underline" to="/">Videresend manuelt.</Link>}
      </div>
    </div>
  );
};

export default Authcallback;
