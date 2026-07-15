import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Upload, Image, Loader2, UserPlus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Zod validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Supporter', 'Creator']).default('Supporter'),
  photoUrl: z.string().optional().default('')
});

type RegisterFields = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [photoType, setPhotoType] = useState<'upload' | 'url'>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema)
  });

  // Handle imgBB upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '17fb322a36ad2bd66f4414f6b4efd550'; // Default public demo key or env key

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
      const url = response.data?.data?.url;
      if (url) {
        setUploadedUrl(url);
        setValue('photoUrl', url);
        toast.success('Profile picture uploaded successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed. Please enter an image URL instead.');
      setPhotoType('url');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: RegisterFields) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        photo: data.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        role: data.role
      };
      await registerUser(payload);
      
      // Determine dashboard redirect
      if (data.role === 'Creator') {
        navigate('/dashboard/creator-home');
      } else {
        navigate('/dashboard/supporter-home');
      }
    } catch (err) {
      // Handled in AuthContext
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background glow orbs */}
      <div className="glow-orb -top-20 -right-20"></div>
      <div className="glow-orb bottom-0 left-0"></div>

      <div className="w-full max-w-lg rounded-3xl glass p-8 sm:p-10 border border-slate-900 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold font-display text-white tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-400">
            Join FundForge to start contributing or launch new causes.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Grid Layout for details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-500 font-medium pl-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium pl-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium pl-1">{errors.password.message}</p>
              )}
            </div>

            {/* Select Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                Join As
              </label>
              <select
                {...register('role')}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white outline-none transition"
              >
                <option value="Supporter">Supporter (Starts with 50 credits)</option>
                <option value="Creator">Creator (Starts with 20 credits)</option>
              </select>
              {errors.role && (
                <p className="text-xs text-rose-500 font-medium pl-1">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Photo URL / Upload Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Profile Photo
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoType('url')}
                  className={`text-xs px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                    photoType === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoType('upload')}
                  className={`text-xs px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                    photoType === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Upload File
                </button>
              </div>
            </div>

            {photoType === 'url' ? (
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Image className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  {...register('photoUrl')}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-800 border-dashed rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-900/60 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6 text-slate-500 mb-1" />
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {uploadedUrl ? 'Image Selected!' : 'Click to select profile picture'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG or WEBP (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            )}
            {uploadedUrl && photoType === 'upload' && (
              <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <img src={uploadedUrl} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                <span className="text-xs text-slate-400 truncate">{uploadedUrl}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-md hover:shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition ml-0.5">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
