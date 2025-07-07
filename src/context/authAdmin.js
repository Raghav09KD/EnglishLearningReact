import { createContext, useState, useEffect } from 'react';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem('adminUser'));
    if (storedAdmin) {
      setAdminUser(storedAdmin);
    }
  }, []);

  const loginAdmin = (userData) => {
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setAdminUser(userData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminUser');
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
