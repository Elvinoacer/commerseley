import { Building2, MapPin, Phone, Mail, Clock, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Our Story
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Commersely is more than just a store - we&apos;re a community
            passionate about bringing you the best products with exceptional
            service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center mb-6">
              <Building2 className="w-8 h-8 text-indigo-600 mr-4" />
              <h2 className="text-2xl font-bold">Who We Are</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Founded in 2023, Commersely began with a simple mission: to create
              an online shopping experience that&apos;s enjoyable, reliable, and
              human.
            </p>
            <p className="text-gray-700">
              Our team of passionate individuals works tirelessly to curate
              products we truly believe in and deliver them with care.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center mb-6">
              <Globe className="w-8 h-8 text-indigo-600 mr-4" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-700 mb-4">
              To redefine e-commerce by prioritizing quality over quantity,
              relationships over transactions, and sustainability over
              short-term gains.
            </p>
            <p className="text-gray-700">
              We believe shopping should be an experience that leaves you
              excited, not exhausted.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Visit Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Address</h3>
                    <p className="text-gray-700">
                      123 Commerce Street
                      <br />
                      Tech City, TC 10001
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-700">hello@commersely.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Hours</h3>
                    <p className="text-gray-700">
                      Monday - Friday: 9AM - 6PM
                      <br />
                      Saturday: 10AM - 4PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-64 w-full bg-gray-200">
            {/* Map would go here */}
          </div>
        </div>
      </div>
    </div>
  );
}
