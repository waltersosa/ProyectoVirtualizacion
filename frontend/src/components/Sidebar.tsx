import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Cpu, Settings } from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-0 h-full w-20 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-8">
      <button 
        onClick={() => navigate('/')}
        className={`p-3 rounded-lg transition-colors ${
          location.pathname === '/' 
            ? 'bg-blue-500 text-white' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        } mb-4`}
      >
        <LayoutDashboard className="w-6 h-6" />
      </button>
      <button 
        onClick={() => navigate('/devices')}
        className={`p-3 rounded-lg transition-colors ${
          location.pathname === '/devices' 
            ? 'bg-blue-500 text-white' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        } mb-4`}
      >
        <Cpu className="w-6 h-6" />
      </button>
      <button 
        onClick={() => navigate('/settings')}
        className={`p-3 rounded-lg transition-colors ${
          location.pathname === '/settings' 
            ? 'bg-blue-500 text-white' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <Settings className="w-6 h-6" />
      </button>
    </nav>
  );
}

export default Sidebar;
