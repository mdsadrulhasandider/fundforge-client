import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Eye, Target, Calendar } from 'lucide-react';

export interface CampaignType {
  _id: string;
  title: string;
  campaignStory: string;
  category: string;
  fundingGoal: number;
  minimumContribution: number;
  deadline: string;
  rewardInfo: string;
  image: string;
  creatorName: string;
  creatorEmail?: string;
  creatorId?: string;
  amountRaised: number;
  supportersCount: number;
  views: number;
  status: string;
}

interface CardProps {
  campaign: CampaignType;
}

const Card: React.FC<CardProps> = ({ campaign }) => {
  const {
    _id,
    title,
    category,
    fundingGoal,
    deadline,
    image,
    creatorName,
    amountRaised,
    supportersCount,
    views
  } = campaign;

  // Percentage raised calculation
  const percentage = Math.min(Math.round((amountRaised / fundingGoal) * 100), 100);

  // Time remaining calculation
  const getDaysLeft = () => {
    const diffTime = new Date(deadline).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Expired';
  };

  // Category specific coloring
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'Technology':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Art':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Community':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Health':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col rounded-2xl glass-card overflow-hidden h-full group border border-slate-900">
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getCategoryStyles(category)}`}>
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Creator */}
        <p className="text-xs text-slate-500 font-medium">by {creatorName}</p>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-100 mt-1 line-clamp-1 group-hover:text-blue-400 transition">
          <Link to={`/campaigns/${_id}`}>{title}</Link>
        </h3>

        {/* Info Grid */}
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {supportersCount} supporters
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {views} views
          </span>
        </div>

        {/* Progress Section */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-200">{amountRaised} credits raised</span>
            <span className="text-slate-400">{percentage}%</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Meta Stats & Link */}
        <div className="mt-5 pt-4 border-t border-slate-900 flex items-center justify-between mt-auto">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Goal</span>
            <span className="text-sm font-bold text-slate-300 flex items-center gap-0.5">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              {fundingGoal} cr
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Timeline</span>
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {getDaysLeft()}
            </span>
          </div>

          <Link
            to={`/campaigns/${_id}`}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all cursor-pointer"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
