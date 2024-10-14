import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import { useUsers } from '../context/UserContext';
import SearchPage from './SearchPage'; // Import your SearchPage component

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const navigate = useNavigate();
  const { logoutUzer, currentUser, setCurrentUser } = useAuth();
  const {isSearchOpen, setIsSearchOpen} = useUsers(); // State for controlling search overlay
  const searchRef = useRef(null);

  useEffect(() => {
    //console.log('User Changed');
  }, [currentUser]);

  const navigation = [
    { name: 'Home', href: '/project-bazaar-src', show: currentUser ? true : false },
    { name: 'Projects', href: '/project-bazaar-src/titles', show: currentUser ? true : false },
    { name: 'Register', href: '/project-bazaar-src/register', show: currentUser ? false : true },
    { name: 'Sign in', href: '/project-bazaar-src/login', show: currentUser ? false : true },
    { name: 'Add', href: '/project-bazaar-src/project/form', show: currentUser?.email===import.meta.env.VITE_EMAIL ? true : false },
  ];

  function logOut() {
    logoutUzer();
    setCurrentUser(null);
    navigate('/project-bazaar-src/login');
  }

  // const truncate = (str, maxLength=15) => {
  //   if (str.length <= maxLength) return str;
  //   return str.slice(0, maxLength) + '...';
  // };

  // useEffect(() => {
  //   //console.log(currentUser);
  // }, [currentUser]);

  // Close search page when clicking outside
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <Disclosure as="nav" className="bg-gray-800 top-0 right-0 left-0">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center font-mono text-white text-4xl">
              <NavLink to={'/project-bazaar-src/'}>Project-Lo</NavLink>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={({ isActive }) =>
                        classNames(
                          'rounded-md px-3 py-2 text-sm font-medium',
                          item.show ? '' : 'hidden ',
                          isActive ? 'bg-gray-900 text-cyan-500' : 'text-white hover:bg-gray-700 hover:text-white'
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Toggle Search Overlay */}
            {/* <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 mx-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Search</span>
              <IoSearchOutline size={25} />
            </button> */}

            {/* Notifications */}


            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              {currentUser && (
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none ring-2 ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      src={
                        'https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg'
                      }
                      alt="User Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
              )}
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                <span className="text-blue-700 font-mono p-2 m-auto">
                  {currentUser && (currentUser?.displayName)}
                </span>

                <MenuItem>
                  <NavLink
                    onClick={() => {
                      confirm('Do you wanna LOGOUT?') ? logOut() : null;
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </NavLink>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {currentUser && currentUser?.username}
          {navigation.map((item) => {
            return (
              <NavLink
                key={item.name}
                to={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={({ isActive }) =>
                  classNames(
                    'block rounded-md px-3 py-2 text-base font-medium hover:cursor-pointer',
                    item.show ? '' : 'hidden ',
                    isActive ? 'bg-gray-900 text-cyan-300' : 'text-white hover:bg-gray-700 hover:text-white'
                  )
                }
              >
                <DisclosureButton>{item.name}</DisclosureButton>
              </NavLink>
            );
          })}
        </div>
      </DisclosurePanel>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
        >
          <div
            ref={searchRef}
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
          >
            <SearchPage  />
          </div>
        </div>
      )}
    </Disclosure>
  );
}
