import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Your message has been sent successfully! We will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold font-display text-white">Contact Our Team</h1>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          Have queries regarding campaign approvals, security audits, or credit transactions? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-4">
            <h3 className="font-semibold text-slate-200 font-display flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              General Inquiries
            </h3>
            <p className="text-xs text-slate-500">
              For general help, user disputes, or developer queries, contact us below:
            </p>
            <div className="space-y-3.5 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>support@fundforge.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>+1 (555) 019-2834</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>100 Pine Street, San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-2 p-8 rounded-3xl border border-slate-900 bg-slate-950/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="How can we help you?"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                Message Description
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 outline-none transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-fit px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-md hover:shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
