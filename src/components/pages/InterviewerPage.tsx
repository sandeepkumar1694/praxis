import React, { useState } from 'react';
import { Video, Calendar, Clock, Users, Star, ArrowRight, Play, Settings, Info, Cpu, Database, Globe } from 'lucide-react';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import TavusAvatar from '../tavus/TavusAvatar';
import { useNotification } from '../../contexts/NotificationContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';

const InterviewerPage: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showAvatar, setShowAvatar] = useState(false);
  const [creatingPersona, setCreatingPersona] = useState(false);
  const [personaId, setPersonaId] = useState<string | null>(null);
  const [avatarSettings, setAvatarSettings] = useState({
    replicaId: import.meta.env.VITE_TAVUS_REPLICA_ID || 'r9d30b0e55ac', // Default replica ID from env
    personaId: '', // Will be set after persona creation
    autoStart: false,
  });

  const packages = [
    {
      id: 'frontend-interview',
      title: 'Frontend Development Interview',
      duration: '45 minutes',
      price: '$49',
      features: [
        'React/Vue.js component challenges',
        'CSS and responsive design questions',
        'JavaScript ES6+ problem solving',
        'Detailed performance feedback',
        'Frontend optimization techniques'
      ],
      rating: 4.8,
      reviews: 287
    },
    {
      id: 'backend-interview',
      title: 'Backend Development Interview',
      duration: '60 minutes',
      price: '$69',
      features: [
        'Node.js/Express API development',
        'Database design and optimization',
        'Authentication and security practices',
        'Microservices architecture',
        'Performance and scalability analysis'
      ],
      rating: 4.9,
      reviews: 213
    },
    {
      id: 'fullstack-interview',
      title: 'Full Stack Interview',
      duration: '90 minutes',
      price: '$99',
      features: [
        'End-to-end application development',
        'Frontend and backend integration',
        'Database design and API development',
        'Deployment and DevOps practices',
        'System architecture discussions'
      ],
      rating: 4.7,
      reviews: 341
    }
  ];

  const createPersona = async () => {
    setCreatingPersona(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/tavus-create-persona`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create persona');
      }

      const data = await response.json();
      setPersonaId(data.persona_id);
      setAvatarSettings(prev => ({ ...prev, personaId: data.persona_id }));
      showSuccess('AI Interviewer persona created successfully!');
    } catch (error) {
      showError('Failed to create interviewer persona. Please try again.');
    } finally {
      setCreatingPersona(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Video size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-poppins font-bold text-white mb-4">
            AI-Powered Interviewer
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Practice full stack web development interviews with our advanced AI interviewer powered by Tavus technology. 
            Get realistic technical interview experience with expert feedback.
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

        {/* Avatar Demo Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Live Technical Interview Demo</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Experience our advanced Tavus-powered technical interviewer. Practice full stack development questions 
              and see how realistic and interactive our avatar technology is.
            </p>
          </div>
          
          {!showAvatar ? (
            <div className="text-center">
              <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center"><Cpu size={20} className="mr-2 text-blue-400" />Technical Expertise</h3>
                  <p className="text-white/70 text-sm">
                    Deep knowledge of full stack technologies, frameworks, and best practices
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center"><Database size={20} className="mr-2 text-green-400" />System Design</h3>
                  <p className="text-white/70 text-sm">
                    Assess your ability to design scalable systems and database architectures
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center"><Globe size={20} className="mr-2 text-purple-400" />Real-time Feedback</h3>
                  <p className="text-white/70 text-sm">
                    Get instant responses and adapt to your communication style
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">🔒 Secure & Private</h3>
                  <p className="text-white/70 text-sm">
                    Your conversations are secure and not stored permanently
                  </p>
                </div>
              </div>
              
              {!personaId && (
                <button
                  onClick={createPersona}
                  disabled={creatingPersona}
                  className="group px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto mb-4 disabled:opacity-50"
                >
                  {creatingPersona ? <LoadingSpinner size="sm" color="text-white" /> : <Settings size={24} />}
                  <span>{creatingPersona ? 'Creating Interviewer...' : 'Create AI Interviewer'}</span>
                </button>
              )}
              
              {personaId && (
                <button
                  onClick={() => setShowAvatar(true)}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto"
                >
                  <Video size={24} />
                  <span>Start Technical Interview</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">AI Avatar Demo Session</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowAvatar(false)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-200"
                  >
                    Close Demo
                  </button>
                </div>
              </div>
              
              <TavusAvatar
                replicaId={avatarSettings.replicaId}
                personaId={personaId || avatarSettings.personaId}
                autoStart={avatarSettings.autoStart}
                className="max-w-3xl mx-auto"
              />
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2">Demo Instructions:</h4>
                    <ul className="text-blue-300/80 text-sm space-y-1">
                      <li>• Click the microphone button to answer technical questions</li>
                      <li>• Use the text input for coding discussions and explanations</li>
                      <li>• The AI interviewer will ask full stack development questions</li>
                      <li>• This demo covers frontend, backend, and system design topics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-white/5 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Your Technical Focus',
                description: 'Select frontend, backend, or full stack interview based on your career goals.'
              },
              {
                step: '2',
                title: 'AI Interviewer Starts',
                description: 'Our Tavus-powered AI interviewer will conduct a realistic technical interview.'
              },
              {
                step: '3',
                title: 'Get Technical Feedback',
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
              <span>Start Technical Interview</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <p className="mt-4 text-white/60 text-sm">
              Your interview session will be recorded for review and feedback analysis
            </p>
          </div>
        )}

        {/* Technology Info */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            🚀 Advanced Technical Interview Platform
          </h3>
          <p className="text-white/80">
            Experience the most realistic AI-powered technical interviews with advanced 
            full stack knowledge and real-time adaptation to your coding discussions.
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default InterviewerPage;