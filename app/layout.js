import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Kolkata Society Market",
  description: "A marketplace built for society shopping in Kolkata.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}