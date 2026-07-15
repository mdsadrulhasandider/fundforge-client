import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Image, Loader2, Save, Upload } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  photoUrl: z.string().optional().default('')
});

type ProfileFields = z.infer<typeof profileSchema>;

const ProfileSettings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [photoType, setPhotoType] = useState<'upload' | 'url'>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      photoUrl: user?.photo || ''
    }
  });

  if (!user) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '17fb322a36ad2bd66f4414f6b4efd550';

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
      const url = response.data?.data?.url;
      if (url) {
        setUploadedUrl(url);
        setValue('photoUrl', url);
        toast.success('Photo uploaded!');
      }
    } catch (err) {
      toast.error('Upload failed. Try entering a URL.');
      setPhotoType('url');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFields) => {
    try {
      await updateProfile(data.name, data.photoUrl);
    } catch (err) {
      // toast shown in context
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Profile Settings</h1>
        <p className="text-xs text-slate-500">Update your account name and display photo.</p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/30">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* User Email (Disabled) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
              Email Address (Cannot change)
            </label>
            <input
              type="text"
              disabled
              value={user.email}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-400 opacity-60 outline-none"
            />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
              Display Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Name"
                {...register('name')}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium pl-1">{errors.name.message}</p>
            )}
          </div>

          {/* Photo */}
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
                    photoType === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoType('upload')}
                  className={`text-xs px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                    photoType === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'
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
                  placeholder="Image URL"
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
              <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <img src={uploadedUrl} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                <span className="text-xs text-slate-400 truncate">{uploadedUrl}</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full sm:w-fit px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
