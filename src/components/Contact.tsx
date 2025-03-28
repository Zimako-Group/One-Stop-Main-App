import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from './ui/Button';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center fade-in">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            We're here to help. Reach out to us through any of these channels.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-[#FF4500]" />
              <h3 className="ml-3 text-xl font-medium text-gray-900">Visit Us</h3>
            </div>
            <address className="mt-4 text-gray-500 not-italic">
              1 Nel Street<br />
              Mbombela<br />
              1200
            </address>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-[#228B22]" />
              <h3 className="ml-3 text-xl font-medium text-gray-900">Office Hours</h3>
            </div>
            <div className="mt-4 space-y-1 text-gray-500">
              <p>Monday - Friday: 8:00 AM - 4:30 PM</p>
              <p>Saturday: 8:00 AM - 12:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-[#FFD700]" />
              <h3 className="ml-3 text-xl font-medium text-gray-900">Call Us</h3>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-gray-500">General Enquiries:</p>
              <p className="text-gray-900 font-medium">+27 13 759 9111</p>
              <p className="text-gray-500 mt-2">Emergency Services:</p>
              <p className="text-gray-900 font-medium">+27 13 759 911</p>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-gray-50 rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900">Send us a message</h3>
              <form className="mt-8 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF4500] focus:ring-[#FF4500]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF4500] focus:ring-[#FF4500]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF4500] focus:ring-[#FF4500]"
                  ></textarea>
                </div>
                <Button className="w-full bg-[#FF4500] hover:bg-[#FF5722]">
                  Send Message
                </Button>
              </form>
            </div>
            <div className="relative h-96 lg:h-auto">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Municipal building"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}