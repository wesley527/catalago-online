import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Upload, X } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import Toast from '../Toast';

export default function TenantSettings() {
  const { tenant, tenantSettings, updateSettings, refreshSettings, setTenant } = useTenant();
  const { isDark, toggleTheme, theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    primary_color: tenantSettings?.primary_color || '#2563eb',
    secondary_color: tenantSettings?.secondary_color || '#10b981',
    logo_url: tenantSettings?.logo_url || '',
    banner_url: tenantSettings?.banner_url || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (tenantSettings) {
      setFormData({
        name: tenant?.name || '',
        primary_color: tenantSettings.primary_color,
        secondary_color: tenantSettings.secondary_color,
        logo_url: tenantSettings.logo_url || '',
        banner_url: tenantSettings.banner_url || '',
      });
    }
  }, [tenantSettings, tenant]);

  const handleImageUpload = async (
    file: File,
    type: 'logo' | 'banner'
  ): Promise<string> => {
    const fileName = `${tenant?.id}_${type}_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const url = await handleImageUpload(file, 'logo');
      setFormData({ ...formData, logo_url: url });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer upload';
      setError(message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingBanner(true);
      const url = await handleImageUpload(file, 'banner');
      setFormData({ ...formData, banner_url: url });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer upload';
      setError(message);
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await updateSettings(formData);
      setSuccess(true);
      setMessage('Configurações salvas com sucesso!');
      setTimeout(() => setMessage(''), 3000);
      await refreshSettings();

      if (tenant) {
        const updatedTenant = { ...tenant, ...formData };
        setTenant(updatedTenant);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar configurações';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h2>

      {/* Informações da Loja */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Informações da Loja</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Nome da Loja
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              URL da Loja
            </label>
            <input
              type="text"
              value={tenant?.slug || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Plano
            </label>
            <input
              type="text"
              value={tenant?.plan || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 capitalize"
            />
          </div>
        </div>
      </div>

      {/* Preferências */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Preferências</h3>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Modo Escuro
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isDark ? 'Ativado' : 'Desativado'}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
              isDark ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                isDark ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Informações da Conta */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Informações da Conta</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Data de Criação
            </label>
            <input
              type="text"
              value={tenant ? new Date(tenant.created_at).toLocaleDateString('pt-BR') : ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Última Atualização
            </label>
            <input
              type="text"
              value={tenant ? new Date(tenant.updated_at).toLocaleDateString('pt-BR') : ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Configurações da Loja</h2>
            <p className="text-gray-600 mt-1">Personalize a aparência do seu catálogo</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-700 hover:text-red-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <Save className="w-5 h-5 flex-shrink-0" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}

        {message && (
          <Toast
            message={message}
            type={message.includes('sucesso') ? 'success' : 'error'}
          />
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Primária
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primary_color"
                  value={formData.primary_color}
                  onChange={handleChange}
                  className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  name="primary_color"
                  value={formData.primary_color}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Usada em botões e destaques</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Secundária
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="secondary_color"
                  value={formData.secondary_color}
                  onChange={handleChange}
                  className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  name="secondary_color"
                  value={formData.secondary_color}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Usada em elementos de sucesso</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            {formData.logo_url ? (
              <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.logo_url}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logo_url: '' })}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                />
                <div className="text-center">
                  {uploadingLogo ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Upload</p>
                    </>
                  )}
                </div>
              </label>
            )}
            <p className="text-sm text-gray-500 mt-1">Aparece no cabeçalho da loja</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner</label>
            {formData.banner_url ? (
              <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.banner_url}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, banner_url: '' })}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  disabled={uploadingBanner}
                  className="hidden"
                />
                <div className="text-center">
                  {uploadingBanner ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Upload</p>
                    </>
                  )}
                </div>
              </label>
            )}
            <p className="text-sm text-gray-500 mt-1">Banner principal da loja (opcional)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="light"
                  checked={theme === 'light'}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                  disabled={loading}
                />
                <span>Claro ☀️</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                  disabled={loading}
                />
                <span>Escuro 🌙</span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || uploadingLogo || uploadingBanner}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Preview de Cores</h3>
          <div className="flex gap-4">
            <div
              className="flex-1 h-16 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: formData.primary_color }}
            >
              Cor Primária
            </div>
            <div
              className="flex-1 h-16 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: formData.secondary_color }}
            >
              Cor Secundária
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
