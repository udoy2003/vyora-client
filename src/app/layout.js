import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

export const metadata = {
  title: "VYORA",
  description: "VYORA Fitness & Wellness Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}