import React from 'react';
import { Users, Award, Target } from 'lucide-react';

const values = [
  {
    icon: Users,
    title: 'Community First',
    description: 'We prioritize the needs of our community members, ensuring inclusive and accessible services for all residents.',
  },
  {
    icon: Award,
    title: 'Excellence in Service',
    description: 'Our commitment to quality service delivery and professional standards sets us apart in municipal governance.',
  },
  {
    icon: Target,
    title: 'Sustainable Development',
    description: 'We focus on sustainable growth and development that benefits both current and future generations.',
  },
];

export const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center fade-in">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Mbombela Municipality
          </h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Serving our community with dedication and innovation. We strive to create
            a vibrant, sustainable city where every resident thrives.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#FF4500] text-white mx-auto">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900 text-center">
                  {value.title}
                </h3>
                <p className="mt-4 text-gray-500 text-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              <p className="mt-6 text-lg text-gray-500">
                To be a leading municipality in service delivery, promoting sustainable
                development and improving the quality of life for all our residents.
              </p>
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900">Key Statistics</h4>
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-gray-500">Population Served</dt>
                    <dd className="text-2xl font-bold text-[#FF4500]">695,000+</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Area Covered</dt>
                    <dd className="text-2xl font-bold text-[#228B22]">7,141 km²</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="City council meeting"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}