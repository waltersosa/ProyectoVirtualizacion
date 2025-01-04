import { Bell, Globe, Shield, Database } from 'lucide-react';
import { commonStyles } from '../styles/common';

export function Settings() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className={`text-2xl font-bold ${commonStyles.text.primary} mb-6`}>Settings</h1>

      <div className={`${commonStyles.card} p-6`}>
        <h2 className={`text-xl font-semibold ${commonStyles.text.primary} mb-4`}>Device Settings</h2>
        <div className="space-y-6">
          {/* Update Interval */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className={commonStyles.text.primary}>Update Interval</p>
                <p className={`text-sm ${commonStyles.text.secondary}`}>How often devices update their status</p>
              </div>
            </div>
            <select
              defaultValue="30"
              className={commonStyles.input}
            >
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
            </select>
          </div>

          {/* Auto Connect */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className={commonStyles.text.primary}>Auto-connect Devices</p>
                <p className={`text-sm ${commonStyles.text.secondary}`}>Automatically connect to available devices</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[rgb(var(--bg-tertiary))] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className={commonStyles.text.primary}>Push Notifications</p>
                <p className={`text-sm ${commonStyles.text.secondary}`}>Get notified about device status changes</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[rgb(var(--bg-tertiary))] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className={`${commonStyles.card} p-6`}>
        <h2 className={`text-xl font-semibold ${commonStyles.text.primary} mb-4`}>Data Management</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Database className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className={commonStyles.text.primary}>Storage Usage</p>
              <p className={`text-sm ${commonStyles.text.secondary}`}>24.5 MB used</p>
            </div>
          </div>
          <button className={`${commonStyles.button.danger} w-full`}>
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}