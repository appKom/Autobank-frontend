import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogOutIcon from '../../icons/LogOutIcon';
import useAutobankStore from '../../store/autobankstore';
import '../../styles/navbar.css';
import Button from './Button';

type NavItem = { name: string; path: string };

const USER_ROUTES: NavItem[] = [
  { name: 'Kvittering', path: '/kvittering' },
  { name: 'Utstyrspotten', path: '/soknad' },
  { name: 'Min side', path: '/minside' },
];

const ADMIN_ROUTE: NavItem = { name: 'Admin', path: '/admin' };

const LOGO_WHITE = `${import.meta.env.BASE_URL}resources/logo/online-logo-white.png`;
const LOGO_BLUE = `${import.meta.env.BASE_URL}resources/logo/online-logo-blue.png`;

type MenuProps = {
  isAuthenticated: boolean;
  userName?: string;
  navItems: NavItem[];
  login: () => void;
  logout: () => void;
};

const Logo = () => (
  <Link className="flex items-center" to="/">
    <img src={LOGO_WHITE} className="h-12 w-auto cursor-pointer" />
    <p className="text-[25px] ml-3 font-semibold text-white">Autobank</p>
  </Link>
);

const MenuToggle = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
  const iconClass =
    'cursor-pointer text-white h-9 absolute top-3 right-3 transition-transform transform';

  return (
    <button onClick={onToggle} className="flex justify-end lg:hidden" aria-label="Meny">
      <Bars3Icon
        className={`${iconClass} ${isOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'}`}
      />
      <XMarkIcon
        className={`${iconClass} ${isOpen ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0 hidden'}`}
      />
    </button>
  );
};

/** Large screens: links + logout + profile button in a row. */
const DesktopMenu = ({ isAuthenticated, userName, navItems, login, logout }: MenuProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const pillButtonClass =
    'flex rounded-[15px] items-center justify-center p-4 h-[50px] bg-white relative z-20';

  if (!isAuthenticated) {
    return (
      <div className="hidden lg:flex absolute right-[20px] gap-10 items-center">
        <button onClick={login} className={pillButtonClass}>
          <img src={LOGO_BLUE} className="h-5 mr-2" />
          <span>Logg inn</span>
        </button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex absolute right-[20px] gap-10 items-center">
      <nav className="flex">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative text-white text-[20px] p-3 ml-4 rounded-[10px] hover:bg-[#1A4B36] ${
              pathname === item.path ? 'active-link' : ''
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <Button
        title="Logg ut"
        color="white"
        className="inline-flex"
        icon={<LogOutIcon className="w-4 h-4" />}
        onClick={logout}
      />

      <button onClick={() => navigate('/minside')} className={pillButtonClass}>
        <img src={LOGO_BLUE} className="h-5 mr-2" />
        <p>{userName}</p>
      </button>
    </div>
  );
};

/** Small/medium screens: dropdown opened by the hamburger toggle. */
const MobileMenu = ({
  isAuthenticated,
  userName,
  navItems,
  login,
  logout,
  onClose,
}: MenuProps & { onClose: () => void }) => {
  const navigate = useNavigate();

  const rowClass = 'flex items-center justify-center w-full p-4 h-[50px] relative z-20';

  if (!isAuthenticated) {
    return (
      <div className="lg:hidden absolute top-12 right-0 z-10 w-48 py-2 mt-2 text-[18px] bg-white">
        <button onClick={login} className={`${rowClass} text-black hover:bg-gray-200`}>
          <img src={LOGO_BLUE} className="h-5 mr-2" />
          <p>Logg inn</p>
        </button>
      </div>
    );
  }

  return (
    <div className="lg:hidden absolute top-12 right-0 z-10 w-48 py-2 mt-2 text-[18px] text-white bg-[#2e6e53] rounded-lg shadow-xl">
      <button
        onClick={() => {
          navigate('/minside');
          onClose();
        }}
        className={`${rowClass} rounded-[10px] hover:bg-green-900`}
      >
        <img src={LOGO_WHITE} className="h-5 mr-2" />
        <p>{userName}</p>
      </button>

      <button
        onClick={() => {
          logout();
          onClose();
        }}
        className={`${rowClass} rounded-lg hover:bg-green-900`}
      >
        <p>Logg ut</p>
        <LogOutIcon className="w-4 h-4 m-3" />
      </button>

      <hr className="border-b-2 w-full" />

      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={onClose}
          className="block text-white text-[20px] p-3 rounded-[10px] hover:bg-green-900"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userInfo, setUserInfo } = useAutobankStore();
  const { signinRedirect, removeUser, user, isAuthenticated } = useAuth();

  const navItems = userInfo?.isadmin ? [ADMIN_ROUTE, ...USER_ROUTES] : USER_ROUTES;

  const logout = () => {
    setUserInfo(null);
    removeUser();
  };

  const menuProps: MenuProps = {
    isAuthenticated,
    userName: user?.profile.name,
    navItems,
    login: () => signinRedirect(),
    logout,
  };

  return (
    <header className="relative h-16 bg-[#2e6e53]">
      <div className="fixed z-50 flex items-center justify-between w-full p-3 bg-[#2e6e53]">
        <Logo />

        <MenuToggle
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen((open) => !open)}
        />
        {isMobileMenuOpen && (
          <MobileMenu {...menuProps} onClose={() => setIsMobileMenuOpen(false)} />
        )}

        <DesktopMenu {...menuProps} />
      </div>
    </header>
  );
};

export default Navbar;
