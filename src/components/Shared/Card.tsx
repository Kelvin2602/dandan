import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  image: string;
  link: string;
  children?: React.ReactNode;
  className?: string;
  imageHeight?: string;
}

export const Card: React.FC<CardProps> = ({ title, image, link, children, className = '', imageHeight = 'h-48' }) => {
  return (
    <div className={`bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <Link to={link} className="block overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className={`w-full ${imageHeight} object-cover hover:scale-110 transition-transform duration-500`} 
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 truncate">
          <Link to={link} className="text-gray-800 hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        {children}
      </div>
    </div>
  );
};