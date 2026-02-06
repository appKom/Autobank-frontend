import React, { useEffect, useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import LogOutIcon from "../../icons/LogOutIcon";
import Button from "./Button";
import {
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { checkUserResponse } from "../../pages/Authcallback";
import useAutobankStore from "../../store/autobankstore";
import { useAuth } from "react-oidc-context";
import "../../styles/navbar.css";

type NavdropdownProps = {
  user?: checkUserResponse | null;
  name: string | undefined;
  logout: () => void;
  login: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const routes = [
  { name: "Kvittering", path: `${import.meta.env.BASE_URL}kvittering` },
  // { name: "Søknad", path: `${import.meta.env.BASE_URL}soknad` },
  { name: "Min side", path: `${import.meta.env.BASE_URL}minside` },
];

const NavDropdown = (props: NavdropdownProps) => {
  console.log(props.isAuthenticated);
  return (
    <div
      className={`lg:hidden absolute top-12 right-0 z-10 w-48 py-2 mt-2 text-[18px] text-white border border-none cursor-pointer ${
        props.isAuthenticated ? "bg-[#2e6e53] rounded-lg shadow-xl" : "bg-white"
      }`}
    >
      {props.isAuthenticated ? (
        <div>
          <div className="">
            <button className="hover:bg-green-900 flex items-center w-full rounded-[10px] justify-center relativ p-4  h-[50px] bg-[#2e6e53] justify-self-end relative z-20 ">
              <img
                src={`${
                  import.meta.env.BASE_URL
                }resources/logo/online-logo-white.png`}
                className="h-5 mr-2"
              ></img>
              <p>{props.name}</p>
            </button>
          </div>

          <div className="flex hover:bg-green-900 items-center w-full rounded-lg justify-center relativ p-4  h-[50px] bg-[#2e6e53] justify-self-end relative z-20">
            <button
              onClick={() => props.logout()}
              className="flex items-center w-full justify-center relativ p-4 h-[50px] justify-self-end relative z-20"
            >
              <p>Logg ut</p>
              <LogOutIcon className="w-4 h-4 m-3" />
            </button>
          </div>
          <hr className="border-b-2 w-full "></hr>
          {props.isAdmin && (
            <div
              className="text-white text-[20px] p-3 rounded-[10px] hover:bg-green-900 cursor-pointer"
              key="admin"
            >
              <a href={"/admin"}>Admin</a>
            </div>
          )}
          {routes.map((route) => (
            <div
              className="text-white text-[20px] p-3 rounded-[10px] hover:bg-green-900 cursor-pointer"
              key={route.name}
            >
              <a href={route.path}>{route.name}</a>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex hover:bg-gray-200 items-center w-full justify-center relativ p-4 h-[50px] bg-white justify-self-end relative z-20">
          <button
            onClick={() => props.login()}
            className="flex items-center w-full justify-center relativ p-4 h-[50px] justify-self-end relative z-20 text-black"
          >
            <img
              src="resources/logo/online-logo-blue.png"
              className="h-5 mr-2"
            ></img>
            <p>Logg inn</p>
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [showNavDropdown, setShowNavDropdown] = useState<Boolean>(false);

  const { userInfo, setUserInfo } = useAutobankStore();

  const toggleNavbarDropdown = () => {
    setShowNavDropdown(!showNavDropdown);
  };

  const { signinRedirect, removeUser, user, isAuthenticated } = useAuth();

  const isAdmin = (): boolean => {
    return userInfo != null && userInfo.isadmin;
  };

  const logout = () => {
    setUserInfo(null);
    removeUser();
  };

  const location = window.location.pathname;

  return (
    <div className="relative">
      <div className="bg-[#2e6e53] flex h-16">
        <div className="flex items-center justify-between p-3 w-full fixed z-50 bg-[#2e6e53]">
          <a className="flex items-center" href="/">
            <img
              src={`${
                import.meta.env.BASE_URL
              }resources/logo/online-logo-white.png`}
              className="h-12 w-auto cursor-pointer"
            ></img>
            <p className="text-[25px] ml-3 font-semibold text-white ">
              Autobank
            </p>
          </a>

          {/* Navbar small-medium width */}
          <button
            onClick={toggleNavbarDropdown}
            className="flex justify-end abolute lg:hidden"
          >
            <Bars3Icon
              className={`cursor-pointer text-white h-9 justify-self-end absolute top-3 right-3 transition-transform transform ${
                showNavDropdown ? "rotate-45 opacity-0" : "rotate-0 opacity-100"
              }`}
            />
            <XMarkIcon
              className={`cursor-pointer text-white h-9 justify-self-end absolute top-3 right-3 transition-transform transform ${
                showNavDropdown
                  ? "rotate-0 opacity-100"
                  : "rotate-45 opacity-0 hidden"
              }`}
            />
          </button>
          {showNavDropdown && (
            <NavDropdown
              user={userInfo}
              logout={logout}
              login={signinRedirect}
              name={user?.profile.name}
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin()}
            />
          )}

          {/* Navbar large width */}
          {isAuthenticated ? (
            <div className="hidden lg:flex justify-self-end absolute right-[20px] gap-10 items-center">
              <div className="flex justify-self-end md:static right-[20px] gap-10 items-center">
                <div
                  className={
                    (showNavDropdown ? "" : "hidden") +
                    " border-[1px] border-green-800 flex rounded-[10px] flex-col absolute top-[50px] left-[-70px] bg-[#2e6e53] md:border-0 md:flex-row md:flex md:column md:static md:bg-inherit"
                  }
                >
                  {userInfo?.isadmin && (
                    <a
                      className={`relative text-white text-[20px] p-3  md:ml-4 rounded-[10px] hover:bg-green-800 cursor-pointer ${
                        location === `${import.meta.env.BASE_URL}admin`
                          ? "active-link"
                          : ""
                      }`}
                      href={"/admin"}
                      key={"admin"}
                    >
                      Admin
                    </a>
                  )}

                  {routes.map((route) => (
                    <a
                      className={`relative text-white text-[20px] px-3 py-2 md:ml-4 rounded-[10px] hover:bg-[#1A4B36] cursor-pointer ${
                        location === route.path ? "active-link" : ""
                      }`}
                      href={route.path}
                      key={route.name}
                    >
                      {route.name}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <Button
                  title="Logg ut"
                  color="white"
                  className="inline-flex"
                  icon={<LogOutIcon className="w-4 h-4" />}
                  onClick={() => logout()}
                />
              </div>
              <div>
                <button className="flex rounded-[15px] items-center justify-center relativ p-4  h-[50px] bg-white justify-self-end relative z-20">
                  <img
                    src={`${
                      import.meta.env.BASE_URL
                    }resources/logo/online-logo-blue.png`}
                    className="h-5 mr-2"
                  ></img>
                  <p>{user?.profile.name}</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden  lg:flex justify-self-end absolute right-[20px] gap-10 items-center">
              <button
                onClick={() => signinRedirect()}
                className="flex rounded-[15px] items-center justify-center relativ p-4  h-[50px] bg-white justify-self-end relative z-20"
              >
                <img
                  src="resources/logo/online-logo-blue.png"
                  className="h-5 mr-2"
                ></img>
                <a>Logg inn</a>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
