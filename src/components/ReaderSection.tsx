import React, { useState } from 'react';
import { Article, Comment } from '../types';
import { 
  Search, 
  Clock, 
  User, 
  MessageSquare, 
  Heart, 
  Share2, 
  ArrowLeft, 
  Send,
  Sparkles,
  BookOpen,
  Filter,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReaderSectionProps {
  articles: Article[];
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
  onLikeArticle: (id: string) => void;
  onIncrementViews: (id: string) => void;
  likedArticleIds: string[];
  bookmarkedArticleIds: string[];
  onToggleBookmark: (id: string) => void;
}

const CATEGORIES = ['Semua', 'Teknologi', 'Ekonomi', 'Gaya Hidup', 'Politik'];

export default function ReaderSection({
  articles,
  comments,
  onAddComment,
  onLikeArticle,
  onIncrementViews,
  likedArticleIds = [],
  bookmarkedArticleIds = [],
  onToggleBookmark
}: ReaderSectionProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Comment Form State
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Copy URL/Share alert state
  const [shareSuccessId, setShareSuccessId] = useState<string | null>(null);

  const selectedArticle = articles.find((a) => a.id === selectedArticleId);

  // Filter & Search articles
  const filteredArticles = articles.filter((art) => {
    // Exclude pending and rejected articles, default undefined to approved
    const isApproved = art.status === undefined || art.status === 'approved';
    if (!isApproved) return false;

    const matchesCategory = selectedCategory === 'Semua' || 
      (selectedCategory === 'Baca Nanti' ? bookmarkedArticleIds.includes(art.id) : art.category === selectedCategory);
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleArticleClick = (id: string) => {
    setSelectedArticleId(id);
    onIncrementViews(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeArticle(id);
  };

  const handleShare = (art: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/berita/${art.id}`);
    setShareSuccessId(art.id);
    setTimeout(() => {
      setShareSuccessId(null);
    }, 2000);
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentContent.trim()) {
      setCommentError('Nama dan komentar tidak boleh kosong.');
      return;
    }

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      articleId: selectedArticleId!,
      userName: commentName.trim(),
      content: commentContent.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isApproved: true, // Default to true so it shows up immediately, publisher can still moderate
    };

    onAddComment(newComment);
    setCommentName('');
    setCommentContent('');
    setCommentError('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  // Format local date elegantly
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div id="reader-container" className="py-6">
      <AnimatePresence mode="wait">
        {!selectedArticle ? (
          /* GRID VIEW - Article Dashboard */
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            id="reader-main-grid"
          >
            {/* Editorial Header */}
            <div className="mb-8 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rekomendasi Editor</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white" id="main-editorial-title">
                Portal Berita Indonesia
              </h1>
              <p className="text-sm mt-1.5 text-gray-500 dark:text-zinc-400 max-w-2xl">
                Jurnalisme tepercaya, aktual, mendalam, dan independen. Menghubungkan informasi cerdas langsung ke perangkat Anda.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div id="filter-wrapper" className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between p-4 mb-8 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl">
              {/* Categories */}
              <div id="categories-scroll" className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1.5" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    id={`cat-btn-${cat.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                        : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                <span className="text-gray-300 dark:text-zinc-750 text-xs px-1">|</span>

                <button
                  id="cat-btn-baca-nanti"
                  onClick={() => setSelectedCategory('Baca Nanti')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 border ${
                    selectedCategory === 'Baca Nanti'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-500/15'
                      : 'bg-amber-50/50 hover:bg-amber-100/60 text-amber-700 border-amber-100 dark:bg-amber-950/25 dark:text-amber-400 dark:border-amber-900/20'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${selectedCategory === 'Baca Nanti' ? 'fill-white' : 'text-amber-500 fill-amber-500/20'}`} />
                  <span>Baca Nanti ({bookmarkedArticleIds.length})</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative md:w-72" id="search-box">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Cari judul atau isi berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Articles List / Cards */}
            {filteredArticles.length === 0 ? (
              <div id="no-articles" className="py-16 text-center bg-gray-50 dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-200">Tidak ada berita ditemukan</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Coba gunakan kata kunci pencarian atau kategori lain.</p>
              </div>
            ) : (
              <div id="articles-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((art) => {
                  const articleComments = comments.filter((c) => c.articleId === art.id);
                  return (
                    <motion.article
                      key={art.id}
                      id={`card-${art.id}`}
                      onClick={() => handleArticleClick(art.id)}
                      className="group flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-gray-150">
                        <img
                          src={art.image}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                        />
                        <span id={`badge-${art.id}`} className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-900/80 text-white dark:bg-zinc-800/90 rounded-md backdrop-blur-xs">
                          {art.category}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="flex flex-col flex-1 p-5">
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-zinc-400 mb-2.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(art.createdAt)}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-gray-950 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {art.title}
                        </h3>

                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed flex-1">
                          {art.excerpt}
                        </p>

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-50 dark:border-zinc-800/60 text-xs text-gray-400">
                          <div className="flex items-center gap-3">
                            <button
                              id={`card-like-btn-${art.id}`}
                              onClick={(e) => handleLike(art.id, e)}
                              className={`flex items-center gap-1.5 transition-colors cursor-pointer group/like ${
                                likedArticleIds.includes(art.id) ? 'text-rose-500' : 'hover:text-rose-500'
                              }`}
                              title={likedArticleIds.includes(art.id) ? 'Batal Sukai' : 'Sukai Artikel'}
                            >
                              <Heart className={`w-4 h-4 transition-all ${
                                likedArticleIds.includes(art.id)
                                  ? 'text-rose-500 fill-rose-500 scale-110'
                                  : 'text-gray-400 group-hover/like:text-rose-500 group-hover/like:fill-rose-500'
                              }`} />
                              <span className="font-semibold">{art.likes}</span>
                            </button>
                            <span className="flex items-center gap-1.5">
                              <MessageSquare className="w-4 h-4 text-gray-400" />
                              <span>{articleComments.length}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              id={`card-bookmark-btn-${art.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleBookmark(art.id);
                              }}
                              className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                                bookmarkedArticleIds.includes(art.id)
                                  ? 'text-amber-500 hover:text-amber-600'
                                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                              }`}
                              title={bookmarkedArticleIds.includes(art.id) ? 'Batal Simpan' : 'Simpan Baca Nanti'}
                            >
                              <Bookmark className={`w-4 h-4 ${bookmarkedArticleIds.includes(art.id) ? 'fill-amber-500 scale-105' : ''}`} />
                            </button>

                            <button
                              id={`card-share-btn-${art.id}`}
                              onClick={(e) => handleShare(art, e)}
                              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                              title="Salin Tautan Berita"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Link Copy Success Notification */}
                        {shareSuccessId === art.id && (
                          <div id={`toast-share-${art.id}`} className="absolute bottom-4 left-4 right-4 bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-center text-[11px] font-semibold tracking-wide animate-fade-in shadow-md">
                            Tautan berita berhasil disalin ke clipboard!
                          </div>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          /* DETAIL NEWS VIEW */
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            id="reader-detail-view"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Article Content Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Back button */}
              <button
                id="btn-back-to-list"
                onClick={() => setSelectedArticleId(null)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white bg-gray-150 dark:bg-zinc-800 rounded-lg hover:shadow-xs transition-all cursor-pointer border border-transparent dark:border-zinc-700/50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali Ke Daftar Berita</span>
              </button>

              {/* Title & Metadata */}
              <header className="space-y-4">
                <span id="detail-category-badge" className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 rounded-md">
                  {selectedArticle.category}
                </span>

                <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight" id="detail-title">
                  {selectedArticle.title}
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 border-b border-gray-100 dark:border-zinc-800 pb-4">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Ditulis oleh <strong className="text-gray-700 dark:text-zinc-300 font-medium">{selectedArticle.author}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(selectedArticle.createdAt)}
                  </span>
                  <span className="ml-auto flex items-center gap-1 bg-gray-50 dark:bg-zinc-900 px-2 py-0.5 rounded-md text-[10px] font-semibold text-gray-500">
                    Dibaca {selectedArticle.views + 1} kali
                  </span>
                </div>
              </header>

              {/* Feature Image */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800/60 shadow-lg">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* News Body Paragraphs */}
              <article className="prose prose-indigo dark:prose-invert max-w-none text-gray-800 dark:text-zinc-200" id="detail-news-body">
                {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-sm md:text-base leading-relaxed mb-4 text-justify">
                    {paragraph}
                  </p>
                ))}
              </article>

              {/* Interactive Toolbar (Like / Share) */}
              <div className="flex items-center gap-4 py-4 px-5 border-y border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-900/30 rounded-2xl" id="detail-toolbar">
                <button
                  id="btn-detail-like"
                  onClick={(e) => handleLike(selectedArticle.id, e)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 border ${
                    likedArticleIds.includes(selectedArticle.id)
                      ? 'text-white bg-rose-600 border-rose-600 hover:bg-rose-700'
                      : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-950/40'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-all ${
                    likedArticleIds.includes(selectedArticle.id) ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'
                  }`} />
                  <span>
                    {likedArticleIds.includes(selectedArticle.id) ? 'Batal Sukai' : 'Sukai Berita'} ({selectedArticle.likes})
                  </span>
                </button>

                <button
                  id="btn-detail-share"
                  onClick={(e) => handleShare(selectedArticle, e)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/80 rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  <Share2 className="w-4 h-4 text-gray-400" />
                  <span>Bagikan Tautan</span>
                </button>

                <button
                  id="btn-detail-bookmark"
                  onClick={() => onToggleBookmark(selectedArticle.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 border ${
                    bookmarkedArticleIds.includes(selectedArticle.id)
                      ? 'text-white bg-amber-500 border-amber-500 hover:bg-amber-600'
                      : 'text-gray-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/80'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedArticleIds.includes(selectedArticle.id) ? 'fill-white text-white' : 'text-amber-500'}`} />
                  <span>
                    {bookmarkedArticleIds.includes(selectedArticle.id) ? 'Batal Simpan' : 'Baca Nanti'}
                  </span>
                </button>

                {shareSuccessId === selectedArticle.id && (
                  <span id="detail-share-toast" className="text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-pulse ml-2">
                    Tautan disalin!
                  </span>
                )}
              </div>
            </div>

            {/* Sidebar Columns - Comments Panel */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-150 dark:border-zinc-800/60">
                  <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white" id="comments-section-title">
                    Komentar Pembaca
                  </h3>
                  <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500">
                    {comments.filter((c) => c.articleId === selectedArticle.id).length}
                  </span>
                </div>

                {/* Comment writing form */}
                <form onSubmit={submitComment} className="space-y-3.5" id="comment-form">
                  {commentError && (
                    <p id="comment-error-text" className="text-xs font-semibold text-rose-500">{commentError}</p>
                  )}
                  {commentSuccess && (
                     <p id="comment-success-text" className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-lg">Komentar berhasil dipublikasikan!</p>
                  )}
                  
                  <div>
                    <input
                      id="comment-input-name"
                      type="text"
                      placeholder="Nama Anda..."
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/60 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-indigo-500 outline-hidden transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <textarea
                      id="comment-input-content"
                      rows={3}
                      placeholder="Tulis opini cerdas atau tanggapan Anda..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/60 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-indigo-500 outline-hidden transition-colors resize-none"
                      required
                    />
                  </div>

                  <button
                    id="btn-comment-submit"
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer shadow-sm hover:shadow-indigo-500/10 active:scale-98 transition-all"
                  >
                    <span>Kirim Tanggapan</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-4 max-h-[350px] overflow-y-auto scrollbar-thin" id="comments-list">
                  {comments.filter((c) => c.articleId === selectedArticle.id).length === 0 ? (
                    <p className="text-xs text-center text-gray-400 py-6" id="no-comments-fallback">
                      Belum ada komentar untuk berita ini. Jadilah yang pertama memberikan pendapat!
                    </p>
                  ) : (
                    comments
                      .filter((c) => c.articleId === selectedArticle.id)
                      .map((comment) => {
                        const initial = comment.userName ? comment.userName.charAt(0).toUpperCase() : '?';
                        return (
                          <div key={comment.id} id={`comment-node-${comment.id}`} className="p-3 bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800/50 rounded-xl space-y-1.5 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <span className="flex items-center justify-center w-6 h-6 text-[10px] font-bold text-indigo-700 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 rounded-full">
                                {initial}
                              </span>
                              <div className="leading-tight">
                                <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                                  {comment.userName}
                                </h4>
                                <span className="text-[9px] text-gray-400">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed pl-1">
                              {comment.content}
                            </p>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
