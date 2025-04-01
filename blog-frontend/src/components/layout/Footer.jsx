import React from "react";
const Footer = () => {
    return (
      <footer className=" bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Blog System. All rights reserved.</p>
            <p className="mt-2 text-gray-400">A Laravel & React Project</p>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer