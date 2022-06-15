import React, { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import loadable from '@loadable/component';

// 코드 스플리팅
const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/channel'));

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Navigate to={'/login'} replace />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/signup'} element={<SignUp />} />
        <Route path={'/workspace/channel'} element={<Channel />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
