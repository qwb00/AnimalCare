import React from 'react';

function Footer() {
  return (
    <footer className="bg-white py-8">
      {/* Container with two sections */}
      <div className="max-w-[1024px] mx-auto flex justify-center items-start">
        
        {/* Contact information section */}
        <div className="w-1/2 pr-8 text-start">
          <h3 className="text-2xl text-center font-bold mb-4">Contact info:</h3>
          <p className="text-gray-600 mb-2"><span className="font-bold">Address:</span> Happy Paws Animal Shelter, 1234 Příběnická, 110 00 Prague</p>
          <p className="text-gray-600 mb-2"><span className="font-bold">Phone:</span> +420 123 456 789</p>
          <p className="text-gray-600 mb-2"><span className="font-bold">Email:</span> contact@happypaws.cz</p>
          <p className="text-gray-600 mb-2"><span className="font-bold">Working hours:</span></p>
          <p className="text-gray-600">Monday – Sunday: 9:00 AM – 6:00 PM</p>
        </div>

        {/* Social media section */}
        <div className="w-1/2 pl-8 text-end">
          <h3 className="text-2xl text-center font-bold mb-4">Follow us:</h3>
          <p className="text-gray-600 mb-2"><span className="font-bold">Instagram:</span> <a href="https://instagram.com/happypaws_cz" className="text-blue-500">instagram.com/happypaws_cz</a></p>
          <p className="text-gray-600 mb-2"><span className="font-bold">Facebook:</span> <a href="https://facebook.com/happypaws.cz" className="text-blue-500">facebook.com/happypaws.cz</a></p>
          <p className="text-gray-600 mb-2"><span className="font-bold">Snapchat:</span> <a href="https://snapchat.com/add/happypaws_cz" className="text-blue-500">happypaws_cz</a></p>
          <p className="text-gray-600"><span className="font-bold">TikTok:</span> <a href="https://tiktok.com/@happypaws_cz" className="text-blue-500">tiktok.com/@happypaws_cz</a></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
