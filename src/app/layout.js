// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'Saúde em Casa',
  description: 'Organização de atendimentos domiciliares',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
