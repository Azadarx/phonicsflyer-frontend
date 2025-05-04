// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Social media icons with hover effects
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://facebook.com/",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: "from-blue-600 to-blue-400",
      hoverColor: "from-blue-700 to-blue-500"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: "from-pink-600 to-purple-600",
      hoverColor: "from-pink-700 to-purple-700"
    },
    {
      name: "WhatsApp",
      url: "/",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      bgColor: "from-green-600 to-green-400",
      hoverColor: "from-green-700 to-green-500"
    }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-blue-900 to-teal-900 text-white">
      {/* Reduced background elements - just 1 static div instead of animated ones */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-transparent"></div>

      {/* Footer content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand section */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-300">
                Asta Education Academy
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mb-6"></div>
            </motion.div>

            <p className="text-gray-300 mb-6 text-lg">
              Transforming lives through quality education and personalized coaching in phonics, English speaking, and life skills.
            </p>

            {/* Social icons - keep the hover animations as they're interactive */}
            <div className="flex space-x-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`h-11 w-11 rounded-lg bg-gradient-to-r ${link.bgColor} flex items-center justify-center text-white shadow-lg transform transition-all duration-300`}
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(13, 148, 136, 0.5)"
                  }}
                  onHoverStart={() => setHoveredIcon(index)}
                  onHoverEnd={() => setHoveredIcon(null)}
                >
                  {link.icon}
                  {hoveredIcon === index && (
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      className="absolute bottom-0 left-0 h-0.5 bg-white"
                    />
                  )}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              {["Home", "Courses", "About Us", "Testimonials", "Contact Us"].map((item, index) => (
                <li key={index}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, '')}`}
                    className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <span className="inline-block w-0 group-hover:w-4 transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 mr-0 group-hover:mr-2"></span>
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/enroll"
                  className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <span className="inline-block w-0 group-hover:w-4 transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 mr-0 group-hover:mr-2"></span>
                  Enroll Now
                </Link>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white">Resources</h3>
            <ul className="space-y-4">
              {[
                { name: "Phonics Course", path: "/course/phonics" },
                { name: "Spoken English", path: "/course/spoken-english" },
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Terms & Conditions", path: "/terms-conditions" }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <span className="inline-block w-0 group-hover:w-4 transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 mr-0 group-hover:mr-2"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white">Contact Info</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:inspiringshereen@gmail.com" className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                  <span className="inline-block w-0 group-hover:w-4 transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 mr-0 group-hover:mr-2"></span>
                  inspiringshereen@gmail.com
                </a>
              </li>
              {/* <li>
                <a href="tel:+918897125110" className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                  <span className="inline-block w-0 group-hover:w-4 transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 mr-0 group-hover:mr-2"></span>
                  +91 8897 125 110
                </a>
              </li> */}
              {/* <li className="text-gray-300 group">
                <span className="inline-block w-0 group-hover:w-4 transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 mr-0 group-hover:mr-2"></span>
                Opposite Sanjary Function Palace, Ftihar Chowk, Yakutpura Station Road, Hyderabad – 500023
              </li> */}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white">Newsletter</h3>
            <p className="text-gray-300 mb-4">Subscribe to get updates on our latest courses and special offers.</p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400">
            © {currentYear} Asta Education Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;