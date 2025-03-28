import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

interface HeroProps {
  onAuthClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAuthClick }) => {
  return (
    <div className="relative bg-white overflow-hidden pt-16">
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            alt="Mbombela cityscape"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-[2px]" />
        </div>

        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="max-w-3xl fade-in">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Welcome to Mbombela Municipality
            </h1>
            <p className="mt-6 text-xl text-gray-100 max-w-2xl slide-up">
              Your gateway to efficient municipal services. Manage accounts, pay bills,
              and access city services all in one place.
            </p>
            <div className="mt-10 flex space-x-4">
              <Button
                onClick={onAuthClick}
                className="btn-primary text-lg px-8 py-4 rounded-lg flex items-center space-x-2 transform hover:scale-105 transition-transform duration-200"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="text-lg px-8 py-4 rounded-lg border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors duration-200"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}