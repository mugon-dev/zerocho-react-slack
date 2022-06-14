import React, { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import loadable from '@loadable/component';

const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));

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
