import FrontInfo from "../components/frontpage/FrontInfo";
import Topbar from "../components/frontpage/TopBar";
import Bottombar from "../components/frontpage/BottomBar";
import Button from "../components/universal/Button";
import happy from "../resources/frontpage/happy.png";

import useAutobankStore from "../store/autobankstore";
import { useAuth } from "react-oidc-context";
export default function frontPage() {
  const { isAuthenticated, signinRedirect } = useAuth();

  return (
    <div className="bg-[#2E6E53] flex flex-col">
      <Topbar />
      <FrontInfo />
      <Bottombar />
      <div className="z-30 mb-8">
        <header className="w-full lg:w-1/2 text-white text-5xl font-bold z-30 px-10 mb-8">
          Autobank
        </header>
        <div className="flex flex-row items-center space-x-10 mx-10 mb-8">
          <div className="w-full lg:w-1/2">
            <p className="text-white text-left text-xl md:px-20">
              Trenger du økonomisk støtte til diverse arrangement? Autobank er
              et hjelpemiddel for studenter i Online som ønsker å søke om
              økonomisk støtte eller sende inn kvitteringer for personlige
              utlegg. Onlines økonomiansvarlige vil behandle dine henvendelser
              fortløpende. Følg med i din profil for å se statusoppdateringer på
              dine saker.
            </p>
          </div>
          <div className="hidden lg:block w-1/2">
            <img
              src={happy}
              alt=""
              className="money-honey px-20 h-80 min-w-full object-contain"
            />
          </div>
        </div>
        <div className="flex w-full lg:w-1/2 flex-row items-center justify-center space-x-10">
          {!isAuthenticated && (
            <Button
              title={"Logg inn ->"}
              color={"darkGreen"}
              onClick={() => signinRedirect()}
            ></Button>
          )}

          <Button title={"FAQ"} color={"white"} href="/faq"></Button>
          <Button
            title={"Kontakt"}
            color={"white"}
            href="mailto:appkom@online.ntnu.no"
          ></Button>
        </div>
      </div>
    </div>
  );
}
