import React from 'react';
import { Youtube, Linkedin, Facebook, Mail, Shield, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
        <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white mt-auto border-t border-slate-600 relative z-10">
          {/* Decorative top border */}
          <div className="h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400"></div>
      
      <div className="max-w-full mx-auto px-8 sm:px-12 lg:px-16 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
          
          {/* Left side - Contact and Social Media */}
          <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-300" />
                  <a 
                    href="mailto:info@rhythmstix.co.uk" 
                    className="text-blue-200 hover:text-white transition-all duration-300 font-medium text-sm"
                  >
                    Contact Us
                  </a>
                </div>
            
            {/* Social Media */}
            <div className="flex items-center space-x-1">
              <a 
                href="https://www.youtube.com/channel/UCooHhU7FKALUQ4CtqjDFMsw"
                className="group relative p-2 rounded-lg hover:bg-red-500/20 transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-white group-hover:text-red-400 transition-colors duration-300" />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  YouTube
                </div>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/robert-reich-storer-974449144"
                className="group relative p-2 rounded-lg hover:bg-blue-500/20 transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-white group-hover:text-blue-300 transition-colors duration-300" />
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  LinkedIn
                </div>
              </a>
              
              <a 
                href="https://www.facebook.com/Rhythmstix-Music-108327688309431"
                className="group relative p-2 rounded-lg hover:bg-blue-600/20 transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-white group-hover:text-blue-400 transition-colors duration-300" />
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Facebook
                </div>
              </a>
            </div>
          </div>

          {/* Center - Business Name */}
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-medium text-white tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Rhythmstix
            </h2>
          </div>

          {/* Right side - Copyright and Privacy */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4 text-sm">
                  <a 
                    href="https://www.rhythmstix.co.uk/policy"
                    className="group flex items-center space-x-2 text-blue-300 hover:text-white transition-all duration-300 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Shield className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Privacy</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                  
                  <div className="w-px h-4 bg-blue-300/30"></div>
                  
                  <a 
                    href="https://www.rhythmstix.co.uk"
                    className="group flex items-center space-x-2 text-blue-300 hover:text-white transition-all duration-300 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>© 2025 Rhythmstix</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}