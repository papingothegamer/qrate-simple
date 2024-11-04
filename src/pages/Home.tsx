// src/pages/Home.tsx
import React from 'react';
import QRCodeGenerator from '../components/QRCodeGenerator';

const Home: React.FC = () => (
  <main className="min-h-screen flex items-center justify-center bg-gray-100">
    <QRCodeGenerator />
  </main>
);

export default Home;
