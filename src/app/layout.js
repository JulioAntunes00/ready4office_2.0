import "./globals.css";

export const metadata = {
  title: "Ready4Office",
  description: "Ferramentas PDF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}