import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { pageService, PageContent } from '../services/pageService';

export const Contact: React.FC = () => {
  const [page, setPage] = useState<PageContent>(() => pageService.getPageContent('contact'));

  useEffect(() => {
    setPage(pageService.getPageContent('contact'));
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Message sent! Our support team will respond within 24 hours.', 'success');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumb items={[{ label: page.title || 'Contact Us' }]} />

      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">{page.title}</h1>
        {page.subtitle && <p className="text-slate-500 text-sm">{page.subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 card-shadow space-y-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Email Support</h3>
              <p className="text-xs text-slate-500 mt-0.5">Response within 24 hours</p>
              <a href={`mailto:${page.email || 'support@affordpro.com'}`} className="font-bold text-indigo-600 text-sm block mt-2 hover:underline">
                {page.email || 'support@affordpro.com'}
              </a>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 card-shadow space-y-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">WhatsApp / Phone Support</h3>
              <p className="text-xs text-slate-500 mt-0.5">Quick order inquiries</p>
              <span className="font-bold text-emerald-600 text-sm block mt-2">
                {page.phone || '+91 98765 43210'}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 card-shadow space-y-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Business Hours</h3>
              <p className="text-xs text-slate-600 mt-1 font-semibold">
                {page.workingHours || 'Monday – Saturday: 9:00 AM – 8:00 PM IST'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-6">
          {page.content && (
            <div className="whitespace-pre-wrap leading-relaxed text-slate-700 text-sm border-b border-slate-100 pb-4">
              {page.content}
            </div>
          )}

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-2xl font-black text-slate-900">Thank You for Reaching Out!</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Your message has been received. Our team will get back to you at <strong>{formData.email}</strong> shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 mb-4">Send Us a Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Rahul Sharma"
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Question about Reels Bundle"
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
