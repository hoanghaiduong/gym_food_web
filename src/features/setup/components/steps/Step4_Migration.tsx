import React from 'react';
import { Database, Loader2, Play, AlertTriangle, CheckCircle2, ShieldCheck, UserPlus } from 'lucide-react';
import { GlassInput } from '../ui/GlassInput'; // Đảm bảo đường dẫn đúng

interface Step4Props {
  // Migration Props
  dbInitStatus: string;
  isLoading: boolean;
  runMigration: (force: boolean) => Promise<void>;
  skipMigration: () => void;
  onShowResetModal: () => void;
  isMigrationDone: boolean;

  // Admin Form Props (Mới)
  adminForm: any;
  setAdminForm: (data: any) => void;
  createAdmin: () => Promise<boolean>;
  
  // UI Props
  isDarkMode?: boolean;
  // Các props phụ trợ khác nếu cần
  addLog?: (type: any, msg: string) => void;
  setCurrentStep?: (step: number) => void;
}

export const Step4Migration: React.FC<Step4Props> = ({ 
  dbInitStatus, isLoading, runMigration, skipMigration, onShowResetModal, isMigrationDone,
  adminForm, setAdminForm, createAdmin, isDarkMode = false
}) => {

  // --- PHASE 2: CREATE ADMIN (Hiển thị khi đã Migration xong) ---
  if (isMigrationDone) {
      return (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              {/* Header Success Migration */}
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full text-green-600 dark:text-green-400">
                      <CheckCircle2 size={20} />
                  </div>
                  <div>
                      <h3 className="font-bold text-green-800 dark:text-green-300">Phase 1 Complete: Database Initialized</h3>
                      <p className="text-xs text-green-700 dark:text-green-400">Tables created. Now, create the root administrator.</p>
                  </div>
              </div>

              {/* Admin Form */}
              <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                      <UserPlus size={20} className="text-brand-lime" />
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Phase 2: Create Root Admin</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <GlassInput 
                          label="Full Name" 
                          placeholder="Super Admin" 
                          value={adminForm.fullName} 
                          onChange={(v) => setAdminForm({...adminForm, fullName: v})} 
                          isDarkMode={isDarkMode} 
                      />
                      <GlassInput 
                          label="Username" 
                          placeholder="admin" 
                          value={adminForm.username} 
                          onChange={(v) => setAdminForm({...adminForm, username: v})} 
                          isDarkMode={isDarkMode} 
                      />
                  </div>
                  
                  <GlassInput 
                      label="Email" 
                      placeholder="admin@example.com" 
                      value={adminForm.email} 
                      onChange={(v) => setAdminForm({...adminForm, email: v})} 
                      isDarkMode={isDarkMode} 
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                      <GlassInput 
                          label="Password" 
                          type="password" 
                          value={adminForm.password} 
                          onChange={(v) => setAdminForm({...adminForm, password: v})} 
                          isDarkMode={isDarkMode} 
                      />
                      <GlassInput 
                          label="Confirm Password" 
                          type="password" 
                          value={adminForm.confirmPassword} 
                          onChange={(v) => setAdminForm({...adminForm, confirmPassword: v})} 
                          isDarkMode={isDarkMode} 
                      />
                  </div>

                  <div className="pt-4">
                      <button 
                          onClick={createAdmin}
                          disabled={isLoading}
                          className="w-full py-3.5 rounded-xl font-bold text-white bg-brand-lime hover:bg-brand-lime-dark shadow-lg shadow-brand-lime/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                      >
                          {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                          Create Administrator & Continue
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- PHASE 1: MIGRATION (Clean/Dirty/Checking) ---
  return (
    <>
      {/* State: Loading / Checking */}
      {(dbInitStatus === 'checking' || dbInitStatus === 'migrating') && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={40} className="animate-spin mb-4 text-brand-lime" />
          <p className="text-gray-500 font-mono text-sm">
            {dbInitStatus === 'migrating' ? '>> Executing migrations...' : '>> Analyzing Schema Public...'}
          </p>
        </div>
      )}

      {/* State: Clean (Ready to Migrate) */}
      {dbInitStatus === 'clean' && (
        <div className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300 shadow-sm">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Database Ready for Init</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6 text-sm">
            Schema 'public' is empty. We will create necessary tables (users, settings, etc.) and seed initial data.
          </p>
          <button onClick={() => runMigration(false)} disabled={isLoading} className="bg-brand-lime hover:bg-brand-lime-dark text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 mx-auto hover:scale-105">
            <Play size={20} fill="currentColor" /> Execute Migration
          </button>
        </div>
      )}

      {/* State: Dirty (Existing Data Found) */}
      {dbInitStatus === 'dirty' && (
        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
           <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 p-4 rounded-xl flex gap-4">
              <AlertTriangle className="text-yellow-600 shrink-0" size={24} />
              <div>
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-500">Existing Data Detected</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                      The database is not empty. This might be a reinstall or a shared database.
                  </p>
                  <ul className="text-xs text-yellow-600/80 dark:text-yellow-500/80 list-disc ml-4 mt-2 space-y-1">
                      <li><strong>Skip:</strong> Assume tables are correct and proceed to Admin creation.</li>
                      <li><strong>Force Reset:</strong> DELETE ALL DATA and re-initialize (Dangerous).</li>
                  </ul>
              </div>
           </div>
           <div className="flex gap-3 pt-2">
              <button onClick={skipMigration} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Skip Migration
              </button>
              <button onClick={onShowResetModal} className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold hover:bg-red-100 transition-colors shadow-sm">
                  Force Reset
              </button>
           </div>
        </div>
      )}
    </>
  );
};