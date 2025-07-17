import {
    Instagram,
    Twitter,
    Linkedin,
    Facebook,
  } from "lucide-react";
  import '../../../css/app.css';

  const Footer = () => {
    return (
      <footer className="bg-[#f9f9fa] text-black py-12 px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-10">
          {/* kiri*/}
          <div>
            <h2 className="text-3xl font-bold mb-2 text-pink-600">Kaskuy</h2>
            <p className="text-gray-700 mb-6 max-w-md">
              Platform digital untuk mengelola keuangan pribadi dengan mudah, efisien, dan menyenangkan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-purple-600 duration-300 ease-in-out"><Instagram /></a>
              <a href="#" className="hover:text-purple-600 duration-300 ease-in-out"><Twitter /></a>
              <a href="#" className="hover:text-purple-600 duration-300 ease-in-out"><Linkedin /></a>
              <a href="#" className="hover:text-purple-600 duration-300 ease-in-out"><Facebook /></a>
            </div>
          </div>

          {/* kanan*/}
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Produk</h3>
              <ul className="space-y-1 text-gray-800">
                <li><a href="#">Fitur</a></li>
                <li><a href="#">Harga</a></li>
                <li><a href="#">Demo</a></li>
                <li><a href="#">Testimonial</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Perusahaan</h3>
              <ul className="space-y-1 text-gray-800">
                <li><a href="#">Tentang Kami</a></li>
                <li><a href="#">Karir</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Dukungan</h3>
              <ul className="space-y-1 text-gray-800">
                <li><a href="#">Bantuan</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Dokumentasi</a></li>
                <li><a href="#">Status</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bawah */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between">
          <p>© 2025 Kaskuy. All rights reserved.</p>
          <div className="space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:underline">Kebijakan Privasi</a>
            <a href="#" className="hover:underline">Ketentuan & Persyaratan</a>
            <a href="#" className="hover:underline">Kebijakan Cookie</a>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;
