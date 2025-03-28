import React from 'react';
import { Wallet, FileText, Bell, Settings } from 'lucide-react';

const features = [
  {
    name: 'Account Management',
    description: 'View and manage your municipal account details with ease.',
    icon: Wallet,
    color: '#FF4500',
  },
  {
    name: 'Bill Payments',
    description: 'Pay your bills securely through our integrated payment system.',
    icon: FileText,
    color: '#228B22',
  },
  {
    name: 'Service Requests',
    description: 'Submit and track service requests in real-time.',
    icon: Bell,
    color: '#FFD700',
  },
  {
    name: 'Account Settings',
    description: 'Customize your account preferences and notifications.',
    icon: Settings,
    color: '#FF4500',
  },
];

export const Features: React.FC = () => {
  return (
    <div id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center fade-in">
          <h2 className="text-base font-semibold tracking-wide uppercase" style={{ color: '#FF4500' }}>
            Features
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything you need in one place
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Access all your municipal services through our comprehensive
            self-service portal.
          </p>
        </div>

        <div className="mt-16">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <dt>
                  <div
                    className="absolute flex items-center justify-center h-12 w-12 rounded-md text-white"
                    style={{ backgroundColor: feature.color }}
                  >
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}