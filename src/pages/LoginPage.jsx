import React, { useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './LoginPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const LoginPageContent = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  return null; 
};

const LoginPage = () => {
  return (
  <div className="login-page">
    <div className="auth-container">
      <div className="custom-auth-box">
        <Authenticator>
          <LoginPageContent />
        </Authenticator>
      </div>
    </div>
  </div>
);

};

export default LoginPage;
