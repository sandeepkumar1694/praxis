import React, { useState } from 'react';
import { Video, Calendar, Clock, Users, Star, ArrowRight, Play } from 'lucide-react';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

const InterviewerPage: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages = [
    {
      id: 'mock-interview',
      title: 'Mock Technical Interview',
      duration: '45 minutes',
      price: '$49',
      features: [
        'Real-time coding interview simulation',
        'AI-powered interviewer with dynamic questions',
        'Multiple programming languages supported',
        'Detailed performance feedback',
        'Recording for later review'
      ],
      rating: 4.8,
      reviews: 324
    },
    {
      id: 'system-design',
      title: 'System Design Interview',
      duration: '60 minutes',
      price: '$69',
      features: [
        'System architecture discussions',
        'Scalability and performance analysis',
        'Database design evaluation',
        'Real-world scenario problems',
        'Expert feedback and suggestions'
      ],
      rating: 4.9,
      reviews: 187
    },
    {
      id: 'behavioral',
      title: 'Behavioral Interview',
      duration: '30 minutes',
      price: '$39',
      features: [
        'STAR method practice',
        'Leadership and teamwork scenarios',
        'Culture fit assessment',
        'Communication skills evaluation',
        'Personalized improvement tips'
      ],
      rating: 4.7,
      reviews: 256
    }
  ];

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Video size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-poppins font-bold text-white mb-4">
            AI-Powered Interviewer
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Practice with our advanced AI interviewer powered by Tavus technology. 
            Get realistic interview experience with personalized feedback.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-dashboard-card rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-2 ${
                selectedPackage === pkg.id
                  ? 'border-primary bg-primary/5'
                  : 'border-white/10 hover:border-primary/50'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">{pkg.title}</h3>
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-2xl font-bold text-primary">{pkg.price}</span>
                  <div className="flex items-center space-x-1">
                    <Clock size={16} className="text-white/60" />
                    <span className="text-white/60">{pkg.duration}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(pkg.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-white/60">
                    {pkg.rating} ({pkg.reviews} reviews)
                  </span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedPackage === pkg.id
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
              </button>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white/5 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Your Interview Type',
                description: 'Select the type of interview you want to practice based on your needs.'
              },
              {
                step: '2',
                title: 'AI Interviewer Starts',
                description: 'Our Tavus-powered AI interviewer will conduct a realistic interview session.'
              },
              {
                step: '3',
                title: 'Get Detailed Feedback',
                description: 'Receive comprehensive feedback on your performance with actionable insights.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">{step.step}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {selectedPackage && (
          <div className="text-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto">
              <Play size={20} />
              <span>Start Interview</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <p className="mt-4 text-white/60 text-sm">
              Your interview session will be recorded for review and feedback analysis
            </p>
          </div>
        )}

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            🚀 Powered by Tavus AI Technology
          </h3>
          <p className="text-white/80">
            Experience the most realistic AI-powered interview simulations with advanced 
            natural language processing and real-time adaptation to your responses.
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default InterviewerPage;