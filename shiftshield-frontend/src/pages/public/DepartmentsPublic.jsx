import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';
import { Activity, HeartPulse, Stethoscope, Baby, Syringe, TestTube, ScanFace, Pill, Building2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const iconMap = {
  'ICU': HeartPulse,
  'Emergency': Activity,
  'Cardiology': Stethoscope,
  'Pediatrics': Baby,
  'Operation Theatre': Syringe,
  'Laboratory': TestTube,
  'Radiology': ScanFace,
  'Pharmacy': Pill,
  'Administration': Building2,
  'General Ward': Building2
};

export default function DepartmentsPublic() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/departments');
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-slate-900 pt-24 pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-teal-400 font-bold tracking-wider text-sm uppercase mb-4">Hospital Departments</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">Configured for Clinical Reality.</h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Every department operates differently. ShiftShield allows granular risk configurations and skill requirements tailored to specific clinical units.
          </p>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {loading ? (
             <div className="flex justify-center p-12">
               <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept) => {
                const IconComponent = iconMap[dept.name] || Building2;
                return (
                  <Link key={dept.id} to={`/departments/${dept.id}`} className="block group">
                    <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all p-8 flex flex-col relative overflow-hidden">
                      
                      {/* Decorative Background */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors z-0"></div>
                      
                      <div className="relative z-10 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center mb-6 transition-colors shadow-sm">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{dept.name}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {dept.description || "Operational intelligence and workforce management unit."}
                        </p>
                      </div>
                      
                      <div className="relative z-10 pt-6 border-t border-slate-100 mt-auto">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase">Req. Staffing:</span>
                          <span className="text-sm font-bold text-slate-800">{dept.requiredStaffing}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500 uppercase">Risk Tracking:</span>
                          <span className={`text-sm font-bold px-2 py-0.5 rounded ${dept.riskLevel === 'HIGH' ? 'text-red-600 bg-red-50' : dept.riskLevel === 'MEDIUM' ? 'text-amber-600 bg-amber-50' : 'text-teal-600 bg-teal-50'}`}>
                            {dept.riskLevel || "STANDARD"}
                          </span>
                        </div>
                        
                        <div className="mt-6 flex items-center text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                          View Department Details <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Have a highly specialized unit?</h2>
          <p className="text-slate-600 mb-8">ShiftShield's rules engine can be customized to support entirely custom departments and niche clinical requirements.</p>
          <Link to="/contact" className="inline-flex px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-md">
            Talk to an Expert
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
