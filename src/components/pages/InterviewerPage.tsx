import React, { useState } from 'react';
import { Video, Calendar, Clock, Users, Star, ArrowRight, Play, Settings, Info, Cpu, Database, Globe, Sparkles } from 'lucide-react';
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
            AI-Powered Technical Interviewer
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Experience the future of technical interviews with our advanced AI interviewer powered by Tavus technology. 
            Practice real full stack development scenarios with instant feedback.
          </p>
        </div>

        {/* Live Demo Section - Prominently Featured */}
        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-3xl p-8 mb-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/5 to-blue-500/5 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full mb-6">
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-blue-400 font-medium text-sm">Live Technical Interview Experience</span>
              </div>
              <h2 className="text-3xl font-poppins font-bold text-white mb-4">
                Meet Sarah Chen, Your AI Technical Interviewer
              </h2>
              <p className="text-white/80 max-w-3xl mx-auto text-lg leading-relaxed">
                Experience a realistic technical interview with our AI Senior Engineering Manager. 
                Practice full stack development questions, system design, and coding challenges in a natural conversation.
              </p>
            </div>
            
            {!showAvatar ? (
              <div>
                {/* Demo Features */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Cpu size={24} className="text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Full Stack Expertise</h3>
                    <p className="text-white/70 text-sm">
                      Deep knowledge of React, Node.js, databases, and modern web architecture
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Database size={24} className="text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">System Design</h3>
                    <p className="text-white/70 text-sm">
                      Discuss scalable architectures, microservices, and database optimization
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Globe size={24} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Real-time Interaction</h3>
                    <p className="text-white/70 text-sm">
                      Natural conversation flow with instant responses and follow-up questions
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
                    <p className="text-white/70 text-sm">
                      Your interview data is secure and conversations are not permanently stored
                    </p>
                  </div>
                </div>
                
                {/* Demo Action Buttons */}
                <div className="text-center space-y-4">
                  {!personaId ? (
                    <div>
                      <button
                        onClick={createPersona}
                        disabled={creatingPersona}
                        className="group px-10 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 flex items-center space-x-3 mx-auto disabled:opacity-50 shadow-lg"
                      >
                        {creatingPersona ? (
                          <>
                            <LoadingSpinner size="sm" color="text-white" />
                            <span>Creating Your AI Interviewer...</span>
                          </>
                        ) : (
                          <>
                            <Settings size={24} />
                            <span>Initialize AI Technical Interviewer</span>
                          </>
                        )}
                      </button>
                      <p className="text-white/60 text-sm mt-3">
                        One-time setup to create your personalized technical interviewer
                      </p>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setShowAvatar(true)}
                        className="group px-10 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 flex items-center space-x-3 mx-auto shadow-lg"
                      >
                        <Video size={24} />
                        <span>Start Live Technical Interview Demo</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                      <p className="text-white/60 text-sm mt-3">
                        Experience a real technical interview with Sarah Chen
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Live Technical Interview Session</h3>
                    <p className="text-white/70">Currently interviewing with Sarah Chen, Senior Engineering Manager</p>
                  </div>
                  <button
                    onClick={() => setShowAvatar(false)}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-200 font-medium"
                  >
                    End Demo
                  </button>
                </div>
                
                <TavusAvatar
                  replicaId={avatarSettings.replicaId}
                  personaId={personaId || avatarSettings.personaId}
                  autoStart={avatarSettings.autoStart}
                  className="max-w-4xl mx-auto"
                />
                
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-blue-400 font-semibold mb-2">Interview Instructions:</h4>
                        <ul className="text-blue-300/80 text-sm space-y-1">
                          <li>• Use the microphone to engage in natural conversation</li>
                          <li>• Discuss your technical experience and approach</li>
                          <li>• Sarah will ask about React, Node.js, databases, and system design</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Sparkles size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-purple-400 font-semibold mb-2">What to Expect:</h4>
                        <ul className="text-purple-300/80 text-sm space-y-1">
                          <li>• Technical questions adapted to your responses</li>
                          <li>• System design and architecture discussions</li>
                          <li>• Natural conversation flow with follow-up questions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interview Packages */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-poppins font-bold text-white mb-4">
              Choose Your Interview Focus
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Select the type of technical interview that matches your career goals and skill level
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                description: 'Sarah Chen will conduct a realistic technical interview tailored to your experience level.'
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
          <div className="text-center mb-8">
            <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto">
              <Play size={20} />
              <span>Start Professional Technical Interview</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <p className="mt-4 text-white/60 text-sm">
              Your interview session will be recorded for detailed performance analysis and feedback
            </p>
          </div>
        )}

        {/* Technology Info */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            🚀 Powered by Advanced AI Technology
          </h3>
          <p className="text-white/80">
            Experience the most sophisticated AI-powered technical interviews with real-time adaptation, 
            natural conversation flow, and expert-level full stack knowledge.
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default InterviewerPage;