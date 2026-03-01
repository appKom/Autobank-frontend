import styles from './footer.module.css';

import React from 'react';

import { BsSlack, BsFacebook, BsInstagram, BsGithub } from 'react-icons/bs';

const Footer = () => {
  const year = new Date().getFullYear();
  const footerLinkSize = 35;
  const footerLinks = [
    {
      name: 'Slack',
      icon: <BsSlack size={footerLinkSize} />,
      link: 'https://onlinentnu.slack.com/',
    },
    {
      name: 'Facebook',
      icon: <BsFacebook size={footerLinkSize} />,
      link: 'http://facebook.com/LinjeforeningenOnline',
    },
    {
      name: 'Instagram',
      icon: <BsInstagram size={footerLinkSize} />,
      link: 'https://www.instagram.com/online_ntnu/',
    },
    {
      name: 'Github',
      icon: <BsGithub size={footerLinkSize} />,
      link: 'https://github.com/appKom',
    },
  ];

  return (
    <div className="bg-[#2e6e53] text-white py-10 relative z-30">
      <div className="flex justify-center items-center mb-10">
        <img
          src={`${import.meta.env.BASE_URL}resources/logo/online-white.png`}
          className="h-8"
        ></img>
        <div className="mx-3 text-3xl leading-none">Bankom</div>
      </div>

      <hr className="mx-auto w-11/12" />
      <div className="flex justify-center">
        <a href="/faq" className="inline-block pt-10 text-l hover:text-[#282c34] w-auto">
          FAQ
        </a>
      </div>
      <div className="flex justify-center gap-8 pt-10 mb-10">
        {footerLinks.map((link) => {
          return (
            <a
              href={link.link}
              key={link.name}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#282c34]"
            >
              {link.icon}
            </a>
          );
        })}
      </div>
      <div className="text-center">
        <div>Feil på siden?</div>
        <div>
          Ta kontakt med{' '}
          <a href="mailto:appkom@online.ntnu.no" className="hover:text-[#282c34]">
            Appkom
          </a>
        </div>
        <div className="pt-10 text-gray-400">
          ©Online Linjeforening {year}. Alle rettigheter reservert.
        </div>
      </div>
    </div>
  );
};

export default Footer;
