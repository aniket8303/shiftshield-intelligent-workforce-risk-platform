import React, { useState } from 'react';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    phone: '',
    message: ''
  });
  
  const [status, setStatus] = useState({ type: null, message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ type: null, message: '' });
      await api.post('/contact', formData);
      setStatus({ type: 'success', message: 'Your message has been sent successfully. Our team will contact you shortly.' });
      setFormData({ name: '', email: '', organization: '', role: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-slate-900 pt-24 pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-teal-400 font-bold tracking-wider text-sm uppercase mb-4">Get In Touch</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">Contact ShiftShield</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Request a personalized demonstration, inquire about enterprise pricing, or contact our technical support team.
          </p>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Contact Info */}
            <div className="w-full lg:w-1/3">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">How can we help?</h2>
              <p className="text-slate-600 mb-10 leading-relaxed">
                Whether you need a full enterprise deployment or have questions about our risk intelligence engine, our team of healthcare operations experts is ready to assist.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                    <p className="text-slate-600 text-sm mb-1">For general inquiries and demo requests:</p>
                    <a href="mailto:contact@shiftshield.com" className="text-blue-600 font-semibold hover:underline">contact@shiftshield.com</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                    <p className="text-slate-600 text-sm mb-1">Mon-Fri from 8am to 6pm EST.</p>
                    <a href="tel:1800SHIFT00" className="text-blue-600 font-semibold hover:underline">1-800-SHIFT-00</a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Headquarters</h4>
                    <p className="text-slate-600 text-sm">
                      100 Healthcare Tech Drive<br/>
                      Suite 400<br/>
                      Boston, MA 02110
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-8">Send us a message</h3>
                
                {status.type === 'success' && (
                  <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-green-800 font-medium">{status.message}</p>
                  </div>
                )}
                
                {status.type === 'error' && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800 font-medium">{status.message}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Dr. Sarah Jenkins"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Work Email *</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="sarah@hospital.org"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Organization</label>
                      <input 
                        type="text" 
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="City General Hospital"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Job Role</label>
                      <select 
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                      >
                        <option value="">Select a role...</option>
                        <option value="CEO">Hospital Executive (CEO/COO)</option>
                        <option value="HR">Human Resources Leader</option>
                        <option value="Nursing">Nursing Superintendent</option>
                        <option value="DeptHead">Department Head</option>
                        <option value="Supervisor">Shift Supervisor</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Message *</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                    >
                      {submitting ? 'Sending Message...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
