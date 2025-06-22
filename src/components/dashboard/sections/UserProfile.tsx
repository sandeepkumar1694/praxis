import React from 'react';
import { User, Edit, MapPin, Calendar, Github, Linkedin, Award } from 'lucide-react';
import { AuthUser } from '../../../types/auth';

interface ProfileData {
  location?: string;
  joinDate?: string;
  role?: string;
  level?: string;
  nextLevelProgress?: number;
}

interface UserProfileProps {
  user?: AuthUser | null;
  data?: ProfileData;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, data }) => {
  const mockData: ProfileData = data || {
    location: 'San Francisco, CA',
    joinDate: '2024-03-15',
    role: 'Full Stack Developer',
    level: 'Senior',
    nextLevelProgress: 75
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-dashboard-card rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-poppins font-bold text-white">Profile</h3>
        <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
          <Edit size={16} />
        </button>
      </div>

      {/* Avatar and Basic Info */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.profile?.avatar_url ? (
              <img 
                src={user.profile.avatar_url} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={32} />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-dashboard-card flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        <h4 className="text-xl font-bold text-white mb-1">
          {user?.profile?.full_name || user?.email?.split('@')[0] || 'User'}
        </h4>
        <p className="text-white/60 text-sm mb-2">{mockData.role}</p>
        
        {/* Level Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
          <Award size={14} />
          <span>{mockData.level}</span>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-white/60">Progress to Expert</span>
          <span className="text-white font-medium">{mockData.nextLevelProgress}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${mockData.nextLevelProgress}%` }}
          />
        </div>
      </div>

      {/* Profile Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-sm">
          <MapPin size={16} className="text-white/40" />
          <span className="text-white/80">{mockData.location}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <Calendar size={16} className="text-white/40" />
          <span className="text-white/80">
            Joined {formatJoinDate(mockData.joinDate || '2024-01-01')}
          </span>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex items-center space-x-3">
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 text-white/60 hover:text-white">
          <Github size={16} />
          <span className="text-sm">GitHub</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 text-white/60 hover:text-white">
          <Linkedin size={16} />
          <span className="text-sm">LinkedIn</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;