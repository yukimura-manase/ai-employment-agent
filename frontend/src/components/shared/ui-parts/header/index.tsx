import { useState } from "react";
import { TbRobot } from "react-icons/tb";
import { GoogleLoginButton } from "../google-login-button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <TbRobot className="w-8 h-8" />
          <h1 className="text-2xl font-bold">AI就活エージェント</h1>
        </div>

        <nav className="hidden md:flex space-x-4">
          <GoogleLoginButton />
        </nav>
      </div>
    </header>
  );
};
