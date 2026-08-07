import React, { useState, useEffect } from 'react';
import { Quote, Star, MessageSquare } from 'lucide-react';
import { Testimonial } from '../types';
import { RatingStars } from '../components/common/RatingStars';
import api from '../services/api';

export const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Pelanggan Setia');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const res = await api.get('/testimonials?approved=true');
      if (res.data.success) setTestimonials(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    setSubmitting(true);
    try {
      const res = await api.post('/testimonials', {
        name,
        role,
        comment,
        rating,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      });
      if (res.data.success) {
        setMsg('Terima kasih! Testimoni Anda telah dikirim dan menunggu moderasi admin.');
        setName('');
        setComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 rounded-3xl shadow-md text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Testimoni & Pengalaman Pelanggan</h1>
        <p className="text-xs sm:text-sm text-emerald-100">
          Ulasan jujur dari para penikmat produk lokal di seluruh Indonesia
        </p>
      </div>

      {/* Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <RatingStars rating={t.rating} size="sm" />
              <p className="text-xs text-slate-600 leading-relaxed italic">"{t.comment}"</p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <img
                src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={t.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-emerald-300"
              />
              <div>
                <h4 className="font-bold text-xs text-slate-800">{t.name}</h4>
                <p className="text-[10px] text-slate-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Testimonial Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-600" /> Tulis Testimoni Anda
        </h3>

        {msg && <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl">{msg}</p>}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                placeholder="Rina Susanti"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pekerjaan / Kota *</label>
              <input
                type="text"
                required
                placeholder="Pencinta Kopi - Bandung"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Rating Kepuasan</label>
            <RatingStars rating={rating} size="lg" interactive onRatingChange={(r) => setRating(r)} />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pesan Testimoni *</label>
            <textarea
              rows={3}
              required
              placeholder="Ceritakan pengalaman belanja Anda..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
          >
            {submitting ? 'Sending...' : 'Kirim Testimoni'}
          </button>
        </form>
      </div>
    </div>
  );
};
