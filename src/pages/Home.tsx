import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { api } from '../contexts/AuthContext';
import Card, { CampaignType } from '../components/Card';
import { ChevronLeft, ChevronRight, Cpu, Heart, Palette, Landmark, Sparkles, Rocket, ArrowRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    title: "Forge Your Technical Vision",
    subtitle: "Launch hardware, open-source utilities, and sustainable innovations with the support of developers worldwide.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    linkText: "Explore Tech Projects",
    linkUrl: "/explore?category=Technology"
  },
  {
    title: "Empower Creative Expeditions",
    subtitle: "Support local artists, publishing houses, and graphic designers in publishing novels or launching galleries.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200",
    linkText: "Discover Creative Art",
    linkUrl: "/explore?category=Art"
  },
  {
    title: "Back Vital Community Initiatives",
    subtitle: "Deliver aid, build water pumps, and supply medical checks directly where it is needed most.",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=1200",
    linkText: "Support Causes",
    linkUrl: "/explore?category=Community"
  }
];

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Technologist",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    quote: "FundForge made it incredibly simple to raise 15,000 credits to build my smart clean-energy prototype. The community backing was immense!"
  },
  {
    name: "Sarah Jenkins",
    role: "Indie Illustrator",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    quote: "Thanks to the double-ledger security system, my backers felt extremely safe pledging credits. I successfully completed my novel campaign."
  },
  {
    name: "Dr. David Kim",
    role: "Community Director",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    quote: "Vetting campaigns before approval is a game-changer. FundForge represents transparency, trust, and real-world impact."
  }
];

const CATEGORIES = [
  { name: 'Technology', icon: Cpu, count: '14 active', color: 'from-blue-600 to-sky-500' },
  { name: 'Art', icon: Palette, count: '8 active', color: 'from-purple-600 to-pink-500' },
  { name: 'Community', icon: Heart, count: '12 active', color: 'from-emerald-600 to-teal-500' },
  { name: 'Health', icon: Landmark, iconName: 'Health', count: '5 active', color: 'from-rose-600 to-orange-500' }
];

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topCampaigns, setTopCampaigns] = useState<CampaignType[]>([]);
  const [testiIndex, setTestiIndex] = useState(0);

  // Auto Slider for Hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch campaigns
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const topRes = await api.get('/campaigns/top-funded');
        setTopCampaigns(topRes.data.campaigns || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    fetchHomeData();
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Slider Section */}
      <section className="relative h-[650px] w-full overflow-hidden bg-slate-950">
        {/* Slides */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Slide Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl space-y-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/10 text-blue-400 border border-blue-600/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Premium Crowdfunding
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-bold font-display text-white tracking-tight leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
                    {slide.subtitle}
                  </p>
                  <div className="pt-4 flex items-center gap-4">
                    <RouterLink
                      to={slide.linkUrl}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-md hover:shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                    >
                      {slide.linkText}
                      <ArrowRight className="w-4 h-4" />
                    </RouterLink>
                    <RouterLink
                      to="/about"
                      className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-semibold transition"
                    >
                      How It Works
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Nav Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentSlide ? 'bg-blue-600 w-6' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* 2. Top Funded Campaigns */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1.5">
            <h2 className="text-3xl font-bold font-display text-white tracking-tight">Top Funded Projects</h2>
            <p className="text-sm text-slate-400">Supported by backers around the globe, raising maximum milestones.</p>
          </div>
          <RouterLink to="/explore" className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition flex items-center gap-1">
            Browse all campaigns
            <ArrowRight className="w-4 h-4" />
          </RouterLink>
        </div>

        {topCampaigns.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-900"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCampaigns.map((camp) => (
              <Card key={camp._id} campaign={camp} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Popular Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-display text-white tracking-tight">Popular Categories</h2>
          <p className="text-sm text-slate-400">Find the perfect project that matches your passion.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <RouterLink
              key={idx}
              to={`/explore?category=${cat.name}`}
              className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-blue-600/35 hover:bg-slate-900/30 transition flex flex-col items-center text-center gap-4 group"
            >
              <div className={`p-4 rounded-2xl bg-gradient-to-tr ${cat.color} text-white shadow-md group-hover:scale-105 transition`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 font-display group-hover:text-blue-400 transition">{cat.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
              </div>
            </RouterLink>
          ))}
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="border-y border-slate-900 py-20 bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-display text-white tracking-tight">How FundForge Works</h2>
            <p className="text-sm text-slate-400">Simplifying contributions and withdrawals with absolute transparency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-600/10 text-blue-500 font-bold font-display flex items-center justify-center text-lg mx-auto border border-blue-500/20">
                1
              </div>
              <h3 className="font-semibold text-slate-200 font-display text-lg">Purchase Credits</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Supporters purchase platform credit packages via Stripe. Start with a default allocation of 50 credits on signup.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="h-12 w-12 rounded-full bg-purple-600/10 text-purple-500 font-bold font-display flex items-center justify-center text-lg mx-auto border border-purple-500/20">
                2
              </div>
              <h3 className="font-semibold text-slate-200 font-display text-lg">Back Campaigns</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Pledge credits to active approved projects. Balance stays pending until the creator approves or rejects (refunded).
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-600/10 text-emerald-500 font-bold font-display flex items-center justify-center text-lg mx-auto border border-emerald-500/20">
                3
              </div>
              <h3 className="font-semibold text-slate-200 font-display text-lg">Vetted Withdrawals</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Creators convert credits into dollars at 20 credits = $1. Administrators check credentials to approve payment payouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statistics Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-900 bg-gradient-to-b from-slate-900/40 to-slate-950/40 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative overflow-hidden">
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-500 font-display">12,500+</h2>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Backers Enrolled</p>
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-500 font-display">320k+</h2>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Credits Contributed</p>
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-500 font-display">99.2%</h2>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Refund Guarantee</p>
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-500 font-display">$42,000+</h2>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Creator Payouts</p>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Slider */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-display text-white tracking-tight">Testimonials</h2>
          <p className="text-sm text-slate-400">Hear directly from verified creators and supporters.</p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-2xl mx-auto rounded-3xl border border-slate-900 bg-slate-950/50 p-8 sm:p-10 text-center space-y-6">
          <img
            src={TESTIMONIALS[testiIndex].photo}
            alt={TESTIMONIALS[testiIndex].name}
            className="h-16 w-16 rounded-full mx-auto border-2 border-blue-500 object-cover shadow-lg"
          />
          <blockquote className="text-sm text-slate-300 italic leading-relaxed">
            "{TESTIMONIALS[testiIndex].quote}"
          </blockquote>
          <div>
            <h4 className="font-bold text-slate-200 font-display">{TESTIMONIALS[testiIndex].name}</h4>
            <p className="text-xs text-blue-500 font-semibold">{TESTIMONIALS[testiIndex].role}</p>
          </div>

          {/* Testimonial Nav */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setTestiIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTestiIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Call To Action (Encourage creator launch) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-blue-600/30 via-slate-950 to-slate-950 border border-slate-900 text-center space-y-6 relative overflow-hidden">
          <div className="glow-orb -top-20 -right-20"></div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight leading-tight">
            Have a project in mind? <br className="hidden sm:inline" />
            Let's forge it together.
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Register as a Creator to design campaigns, distribute pledge rewards, and request credit payouts directly to your account.
          </p>
          <div className="pt-2">
            <RouterLink
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-md hover:shadow-blue-500/20 cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              Launch Campaign
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
