import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../../contexts/AuthContext';
import { PlusCircle, Image, Upload, Loader2, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technology', 'Art', 'Community', 'Health', 'Education'];

// Zod validation
const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  campaignStory: z.string().min(20, 'Detailed story must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  fundingGoal: z.number().min(10, 'Funding goal must be at least 10 credits'),
  minimumContribution: z.number().min(1, 'Minimum contribution must be at least 1 credit'),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid deadline date'),
  rewardInfo: z.string().min(5, 'Reward details are required'),
  imageUrl: z.string().url('Please enter a valid image URL or upload file')
});

type CampaignFields = z.infer<typeof campaignSchema>;

const AddCampaign: React.FC = () => {
  const navigate = useNavigate();
  const [photoType, setPhotoType] = useState<'upload' | 'url'>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CampaignFields>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      category: 'Technology',
      minimumContribution: 5
    }
  });

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
        setValue('imageUrl', url);
        toast.success('Campaign image uploaded successfully!');
      }
    } catch (err) {
      toast.error('Image upload failed. Try entering a URL.');
      setPhotoType('url');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: CampaignFields) => {
    try {
      const payload = {
        title: data.title,
        campaignStory: data.campaignStory,
        category: data.category,
        fundingGoal: data.fundingGoal,
        minimumContribution: data.minimumContribution,
        deadline: data.deadline,
        rewardInfo: data.rewardInfo,
        image: data.imageUrl
      };

      await api.post('/campaigns', payload);
      toast.success('Campaign added successfully and is pending Admin approval!');
      navigate('/dashboard/creator-campaigns');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error creating campaign');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-blue-500" />
          Add New Campaign
        </h1>
        <p className="text-xs text-slate-500">Submit a cause. It will appear on exploration routes after Administrator approval.</p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/30">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Campaign Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-350 uppercase tracking-wider pl-1">
              Campaign Title
            </label>
            <input
              type="text"
              placeholder="ex: Help us build a solar-powered water pump"
              {...register('title')}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-650 outline-none transition"
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-medium pl-1">{errors.title.message}</p>
            )}
          </div>

          {/* Story detailed description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-350 uppercase tracking-wider pl-1">
              Campaign Story (Detailed explanation)
            </label>
            <textarea
              rows={6}
              placeholder="Describe your cause, why you need funding, and how resources will be allocated..."
              {...register('campaignStory')}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-650 outline-none transition resize-none"
            ></textarea>
            {errors.campaignStory && (
              <p className="text-xs text-rose-500 font-medium pl-1">{errors.campaignStory.message}</p>
            )}
          </div>

          {/* Category, Goal & Min Contribution grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-350 uppercase tracking-wider pl-1">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-3 text-sm text-white outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Goal */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-350 uppercase tracking-wider pl-1">
                Funding Goal (Credits)
              </label>
              <input
                type="number"
                placeholder="1000"
                {...register('fundingGoal', { valueAsNumber: true })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-650 outline-none transition"
              />
              {errors.fundingGoal && (
                <p className="text-xs text-rose-500 font-medium pl-1">{errors.fundingGoal.message}</p>
              )}
            </div>

            {/* Min Contribution */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-350 uppercase tracking-wider pl-1">
                Min Pledge (Credits)
              </label>
              <input
                type="number"
                placeholder="5"
                {...register('minimumContribution', { valueAsNumber: true })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-650 outline-none transition"
              />
              {errors.minimumContribution && (
                <p className="text-xs text-rose-500 font-medium pl-1">{errors.minimumContribution.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Deadline */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                Campaign Deadline
              </label>
              <input
                type="date"
                {...register('deadline')}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white outline-none"
              />
              {errors.deadline && (
                <p className="text-xs text-rose-500 font-medium pl-1">{errors.deadline.message}</p>
              )}
            </div>

            {/* Reward Info */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                Backer Rewards
              </label>
              <input
                type="text"
                placeholder="ex: Receive a free handbook or prototype copy"
                {...register('rewardInfo')}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-650 outline-none transition"
              />
              {errors.rewardInfo && (
                <p className="text-xs text-rose-500 font-medium pl-1">{errors.rewardInfo.message}</p>
              )}
            </div>
          </div>

          {/* Image selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-semibold text-slate-305 uppercase tracking-wider animate-pulse">
                Cover Campaign Image
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoType('url')}
                  className={`text-xs px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                    photoType === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-455'
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoType('upload')}
                  className={`text-xs px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                    photoType === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-455'
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
                  {...register('imageUrl')}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-650 outline-none transition"
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
                      {uploadedUrl ? 'Image Selected!' : 'Click to select cover image'}
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
            {errors.imageUrl && photoType === 'url' && (
              <p className="text-xs text-rose-500 font-medium pl-1">{errors.imageUrl.message}</p>
            )}
            {uploadedUrl && photoType === 'upload' && (
              <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <img src={uploadedUrl} alt="Preview" className="h-12 w-20 object-cover rounded border border-slate-700" />
                <span className="text-xs text-slate-400 truncate">{uploadedUrl}</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Add Campaign
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCampaign;
