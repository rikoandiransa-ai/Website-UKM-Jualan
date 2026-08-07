import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import { Blog } from '../types';
import api from '../services/api';

export const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const res = await api.get('/blogs?published=true');
      if (res.data.success) setBlogs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (selectedBlog) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-16">
        <button
          onClick={() => setSelectedBlog(null)}
          className="text-xs font-bold text-emerald-700 hover:underline"
        >
          &larr; Kembali ke Daftar Artikel
        </button>

        <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-slate-700 text-xs sm:text-sm">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
            {selectedBlog.category}
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {selectedBlog.title}
          </h1>

          <div className="flex items-center gap-4 text-slate-400 text-xs pt-1 border-b border-slate-100 pb-4">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {selectedBlog.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedBlog.created_at}</span>
          </div>

          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 my-4">
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="font-semibold text-slate-800 text-sm leading-relaxed">
            {selectedBlog.excerpt}
          </p>

          <div className="space-y-3 leading-relaxed whitespace-pre-line text-slate-600 border-t border-slate-100 pt-4">
            {selectedBlog.content}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Artikel & Berita UMKM</h1>
        <p className="text-xs sm:text-sm text-emerald-100">
          Inspirasi, tips kuliner, panduan merawat batik, dan kabar perkembangan UMKM Indonesia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelectedBlog(b)}
            className="bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={b.image}
                  alt={b.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {b.category}
                </span>
                <h3 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition line-clamp-2">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{b.excerpt}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
              <span>{b.author}</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                Baca Selengkapnya <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
