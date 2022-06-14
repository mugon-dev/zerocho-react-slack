import React, { FC } from 'react';

import Login from '@pages/Login';
import SignUp from '@pages/SignUp';
import { Navigate, Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Navigate to={'/login'} replace />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/signup'} element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
