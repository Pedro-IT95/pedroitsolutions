import { useState } from 'react';
import { User, Lock, Bell, Shield, Save, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    name: user?.name || '',
    company: user?.company || '',
    phone: user?.phone || ''
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { user: updated } = await api.updateProfile(profile);
      updateUser(updated);
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (passwords.new !== passwords.confirm) {
      setError('Las contraseñas no coinciden');
      setSaving(false);
      return;
    }

    if (passwords.new.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setSaving(false);
      return;
    }

    try {
      await api.changePassword(passwords.current, passwords.new);
      setSuccess('Contraseña actualizada correctamente');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setError(err.message || 'Error al cambiar contraseña');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'password', label: 'Contraseña', icon: Lock },
  ];

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">Configuración</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError('');
                setSuccess('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="input bg-dark-800/50 text-dark-500 cursor-not-allowed"
            />
            <p className="text-xs text-dark-500 mt-1">El email no puede ser cambiado</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Empresa
            </label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              className="input"
              placeholder="Opcional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="input"
              placeholder="Opcional"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Guardando...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </button>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Contraseña Actual
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="input"
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="input"
              required
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Guardando...' : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Cambiar Contraseña
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
