import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <FiGlobe className="h-5 w-5" />
      </label>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100/80 backdrop-blur-lg rounded-box w-52">
        <li><button onClick={() => changeLanguage('en')}>English</button></li>
        <li><button onClick={() => changeLanguage('fr')}>Français</button></li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
