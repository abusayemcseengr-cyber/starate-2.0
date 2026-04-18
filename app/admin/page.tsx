'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import {
  Users,
  Star,
  TrendingUp,
  BarChart3,
  Plus,
  LayoutGrid,
  List,
  Search,
  X,
  ShieldCheck,
  Settings,
} from 'lucide-react';

type Celebrity = {
  id: string;
  name: string;
  photo: string;
  bio: string;
  category: string;
  nationality?: string;
  avgRating: number;
  totalVotes: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { ratings: number };
};

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  color: string;
}) {
  return (
    <GlassPanel
      padding="var(--space-lg)"
      radius="xl"
      style={{ flex: 1, minWidth: 240, border: '1px solid rgba(0,0,0,0.03)' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            {title}
          </p>
          <h3
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              fontFamily: 'var(--font-heading)',
            }}
          >
            {value}
          </h3>
          {trend && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 8,
                color: 'var(--aurora-emerald)',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              <TrendingUp size={14} />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: `0 8px 16px ${color}33`,
          }}
        >
          <Icon size={22} />
        </div>
      </div>
    </GlassPanel>
  );
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'celebrities' | 'users'>(
    'celebrities'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('');
  const [nationality, setNationality] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const stats = useMemo(() => {
    return {
      totalStars: celebrities.length,
      totalVotes: celebrities.reduce((acc, c) => acc + c.totalVotes, 0),
      totalUsers: users.length,
      platformAvg:
        celebrities.length > 0
          ? (
              celebrities.reduce((acc, c) => acc + c.avgRating, 0) /
              celebrities.length
            ).toFixed(1)
          : '0.0',
    };
  }, [celebrities, users]);

  const filteredCelebrities = celebrities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHeaders = useCallback(
    () => ({
      'Content-Type': 'application/json',
      'x-admin-password': sessionStorage.getItem('adminPassword') || '',
    }),
    []
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [celRes, userRes] = await Promise.all([
        fetch('/api/admin/celebrities', { headers: getHeaders() }),
        fetch('/api/admin/users', { headers: getHeaders() }),
      ]);
      if (celRes.ok) setCelebrities(await celRes.json());
      if (userRes.ok) setUsers(await userRes.json());
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const verifyPassword = async (password: string) => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const storedPwd = sessionStorage.getItem('adminPassword');
      if (storedPwd) {
        if (await verifyPassword(storedPwd)) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('adminPassword');
        }
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await verifyPassword(passwordInput)) {
      sessionStorage.setItem('adminPassword', passwordInput);
      setIsAuthenticated(true);
    } else {
      showToast('Incorrect PIN');
    }
  };

  const openModal = (cel?: Celebrity) => {
    if (cel) {
      setEditingId(cel.id);
      setName(cel.name);
      setPhoto(cel.photo);
      setBio(cel.bio);
      setCategory(cel.category);
      setNationality(cel.nationality || '');
    } else {
      setEditingId(null);
      setName('');
      setPhoto('');
      setBio('');
      setCategory('');
      setNationality('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = { id: editingId, name, photo, bio, category, nationality };
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/admin/celebrities', {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save');

      await fetchData();
      closeModal();
      showToast(editingId ? 'Celeb Updated!' : 'Celeb Created!');
    } catch {
      showToast('Error saving celebrity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${name}?`))
      return;
    try {
      const res = await fetch(`/api/admin/celebrities?id=${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchData();
        showToast(`${name} deleted.`);
      }
    } catch {
      showToast('Error deleting celebrity');
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (res.ok) {
        await fetchData();
        showToast('User role updated!');
      } else {
        const err = await res.json();
        showToast(err.error || 'Update failed');
      }
    } catch {
      showToast('Error updating user');
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 40%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <GlassPanel
            padding="var(--space-2xl)"
            radius="2xl"
            style={{
              width: '100%',
              maxWidth: 420,
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
            glow
          >
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background: 'var(--aurora-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-lg)',
                  boxShadow: '0 10px 20px rgba(102,126,234,0.3)',
                }}
              >
                <ShieldCheck size={32} color="white" />
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  marginBottom: 8,
                }}
              >
                Commander Center
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Elevated access required. Please enter your terminal pin.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter Access Code"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 14,
                    border: '1px solid rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.8)',
                    width: '100%',
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    letterSpacing: '0.5em',
                    fontWeight: 900,
                    transition: 'all 0.2s ease',
                    outline: 'none',
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={{
                  padding: 16,
                  borderRadius: 14,
                  border: 'none',
                  background: 'var(--text-primary)',
                  color: 'white',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  marginTop: 8,
                }}
              >
                Authorize Access
              </motion.button>
            </form>

            <div
              style={{
                marginTop: 'var(--space-xl)',
                paddingTop: 'var(--space-lg)',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              Secure production gateway v2.0
            </div>
          </GlassPanel>
        </motion.div>

        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              bottom: 40,
              background: 'rgba(245, 87, 108, 0.9)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
            }}
          >
            {toast}
          </motion.div>
        )}
      </div>
    );
  }

  if (loading && celebrities.length === 0) {
    return (
      <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
        Loading Admin Tools...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        backgroundImage:
          'radial-gradient(circle at 0% 0%, rgba(102, 126, 234, 0.03) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(118, 75, 162, 0.03) 0%, transparent 50%)',
        paddingBottom: 'var(--space-2xl)',
      }}
    >
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'fixed',
            bottom: 40,
            right: 40,
            background: 'var(--aurora-gradient)',
            color: 'white',
            padding: '14px 28px',
            borderRadius: 'var(--radius-lg)',
            zIndex: 1000,
            fontWeight: 700,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {toast}
        </motion.div>
      )}

      {/* Hero Header */}
      <div
        style={{
          padding: 'var(--space-2xl) var(--space-2xl) 0',
          maxWidth: 1400,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-2xl)',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--aurora-indigo)',
                fontWeight: 800,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}
            >
              <ShieldCheck size={16} />
              Admin Control
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '3rem',
                fontWeight: 900,
                background: 'var(--aurora-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              Commander Hub
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Streamline your platform operations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => openModal()}
              style={{
                background: 'var(--aurora-gradient)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: 800,
                boxShadow: '0 10px 30px rgba(102,126,234,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
              }}
            >
              <Plus size={20} />
              Onboard Star
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            marginBottom: 'var(--space-2xl)',
          }}
        >
          <MetricCard
            title="Active Stars"
            value={stats.totalStars}
            icon={Star}
            trend="+3 this week"
            color="var(--aurora-indigo)"
          />
          <MetricCard
            title="Engagement"
            value={stats.totalVotes}
            icon={BarChart3}
            trend="12% vs last month"
            color="var(--aurora-purple)"
          />
          <MetricCard
            title="System Users"
            value={stats.totalUsers}
            icon={Users}
            trend="+42 recent"
            color="var(--aurora-pink)"
          />
          <MetricCard
            title="Global Rating"
            value={`${stats.platformAvg} ★`}
            icon={Star}
            color="var(--aurora-emerald)"
          />
        </motion.div>

        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Controls Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  placeholder={`Search ${activeTab === 'celebrities' ? 'stars' : 'users'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '12px 16px 12px 48px',
                    borderRadius: 14,
                    border: '1px solid rgba(0,0,0,0.05)',
                    width: 300,
                    background: 'rgba(255,255,255,0.8)',
                    outline: 'none',
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  background: 'rgba(0,0,0,0.05)',
                  padding: 4,
                  borderRadius: 12,
                }}
              >
                <LayoutGroup id="tabs">
                  <button
                    onClick={() => setActiveTab('celebrities')}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                      position: 'relative',
                      zIndex: 1,
                      background: 'transparent',
                      color:
                        activeTab === 'celebrities'
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Stars
                    {activeTab === 'celebrities' && (
                      <motion.div
                        layoutId="tab-bg"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'white',
                          borderRadius: 10,
                          zIndex: -1,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        }}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                      position: 'relative',
                      zIndex: 1,
                      background: 'transparent',
                      color:
                        activeTab === 'users'
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Users
                    {activeTab === 'users' && (
                      <motion.div
                        layoutId="tab-bg"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'white',
                          borderRadius: 10,
                          zIndex: -1,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        }}
                      />
                    )}
                  </button>
                </LayoutGroup>
              </div>
            </div>

            {activeTab === 'celebrities' && (
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(0,0,0,0.05)',
                  padding: 4,
                  borderRadius: 12,
                }}
              >
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: 8,
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    background: viewMode === 'grid' ? 'white' : 'transparent',
                    color:
                      viewMode === 'grid'
                        ? 'var(--aurora-indigo)'
                        : 'var(--text-muted)',
                    boxShadow:
                      viewMode === 'grid'
                        ? '0 4px 12px rgba(0,0,0,0.05)'
                        : 'none',
                  }}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: 8,
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    background: viewMode === 'table' ? 'white' : 'transparent',
                    color:
                      viewMode === 'table'
                        ? 'var(--aurora-indigo)'
                        : 'var(--text-muted)',
                    boxShadow:
                      viewMode === 'table'
                        ? '0 4px 12px rgba(0,0,0,0.05)'
                        : 'none',
                  }}
                >
                  <List size={20} />
                </button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'celebrities' ? (
              <motion.div
                key="celeb-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {viewMode === 'grid' ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: 24,
                    }}
                  >
                    <AnimatePresence>
                      {filteredCelebrities.map((cel, idx) => (
                        <motion.div
                          key={cel.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <GlassPanel
                            padding="var(--space-md)"
                            radius="2xl"
                            style={{
                              position: 'relative',
                              overflow: 'hidden',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <div
                              style={{
                                position: 'relative',
                                width: '100%',
                                height: 200,
                                borderRadius: 16,
                                overflow: 'hidden',
                                marginBottom: 16,
                              }}
                            >
                              <Image
                                src={cel.photo}
                                alt={cel.name}
                                fill
                                unoptimized
                                style={{ objectFit: 'cover' }}
                              />
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 12,
                                  right: 12,
                                  background: 'rgba(255,255,255,0.9)',
                                  backdropFilter: 'blur(4px)',
                                  padding: '4px 10px',
                                  borderRadius: 10,
                                  fontSize: '0.85rem',
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                <Star
                                  size={14}
                                  fill="var(--aurora-indigo)"
                                  stroke="var(--aurora-indigo)"
                                />
                                {cel.avgRating.toFixed(1)}
                              </div>
                            </div>

                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  marginBottom: 8,
                                }}
                              >
                                <div>
                                  <h4
                                    style={{
                                      fontSize: '1.15rem',
                                      fontWeight: 900,
                                    }}
                                  >
                                    {cel.name}
                                  </h4>
                                  <p
                                    style={{
                                      fontSize: '0.8rem',
                                      color: 'var(--text-muted)',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {cel.category}
                                  </p>
                                </div>
                              </div>
                              <p
                                style={{
                                  fontSize: '0.85rem',
                                  color: 'var(--text-muted)',
                                  lineHeight: 1.5,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {cel.bio}
                              </p>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 16,
                                paddingTop: 16,
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '0.8rem',
                                  color: 'var(--text-muted)',
                                }}
                              >
                                {cel.totalVotes} platform votes
                              </div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                  onClick={() => openModal(cel)}
                                  style={{
                                    background: 'rgba(102,126,234,0.1)',
                                    color: 'var(--aurora-indigo)',
                                    border: 'none',
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Settings size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(cel.id, cel.name)}
                                  style={{
                                    background: 'rgba(245,87,108,0.1)',
                                    color: '#f5576c',
                                    border: 'none',
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            </div>
                          </GlassPanel>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <GlassPanel
                    padding="0"
                    radius="2xl"
                    style={{
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.03)',
                    }}
                  >
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: 'rgba(0,0,0,0.02)',
                            textAlign: 'left',
                          }}
                        >
                          <th
                            style={{
                              padding: '16px 20px',
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Profile
                          </th>
                          <th
                            style={{
                              padding: '16px 20px',
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Category
                          </th>
                          <th
                            style={{
                              padding: '16px 20px',
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Performance
                          </th>
                          <th
                            style={{
                              padding: '16px 20px',
                              textAlign: 'right',
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Admin
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCelebrities.map((cel) => (
                          <tr
                            key={cel.id}
                            style={{
                              borderBottom: '1px solid rgba(0,0,0,0.03)',
                            }}
                          >
                            <td style={{ padding: '12px 20px' }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                }}
                              >
                                <Image
                                  src={cel.photo}
                                  alt={cel.name}
                                  width={44}
                                  height={44}
                                  unoptimized
                                  style={{
                                    borderRadius: '10px',
                                    objectFit: 'cover',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                  }}
                                />
                                <div>
                                  <div
                                    style={{
                                      fontWeight: 800,
                                      fontSize: '0.95rem',
                                    }}
                                  >
                                    {cel.name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '0.75rem',
                                      color: 'var(--text-muted)',
                                    }}
                                  >
                                    {cel.nationality || 'International'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '12px 20px' }}>
                              <span
                                style={{
                                  background: 'rgba(102,126,234,0.08)',
                                  color: 'var(--aurora-indigo)',
                                  padding: '4px 10px',
                                  borderRadius: 8,
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                }}
                              >
                                {cel.category}
                              </span>
                            </td>
                            <td style={{ padding: '12px 20px' }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  fontWeight: 800,
                                }}
                              >
                                {cel.avgRating.toFixed(1)}{' '}
                                <Star size={14} fill="gold" stroke="gold" />
                                <span
                                  style={{
                                    fontWeight: 400,
                                    color: 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                  }}
                                >
                                  ({cel.totalVotes} votes)
                                </span>
                              </div>
                            </td>
                            <td
                              style={{
                                padding: '12px 20px',
                                textAlign: 'right',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 12,
                                  justifyContent: 'flex-end',
                                }}
                              >
                                <button
                                  onClick={() => openModal(cel)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--aurora-indigo)',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  EDIT
                                </button>
                                <button
                                  onClick={() => handleDelete(cel.id, cel.name)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#f5576c',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  DELETE
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </GlassPanel>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="user-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GlassPanel
                  padding="0"
                  radius="2xl"
                  style={{
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.03)',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr
                        style={{
                          background: 'rgba(0,0,0,0.02)',
                          textAlign: 'left',
                        }}
                      >
                        <th
                          style={{
                            padding: '16px 20px',
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Identity
                        </th>
                        <th
                          style={{
                            padding: '16px 20px',
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Access Level
                        </th>
                        <th
                          style={{
                            padding: '16px 20px',
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Contribution
                        </th>
                        <th
                          style={{
                            padding: '16px 20px',
                            textAlign: 'right',
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                        >
                          <td style={{ padding: '12px 20px' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                              }}
                            >
                              <div
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: '50%',
                                  background: 'var(--aurora-gradient)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 800,
                                  fontSize: '0.9rem',
                                }}
                              >
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div
                                  style={{
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                  }}
                                >
                                  {user.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                  }}
                                >
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 20px' }}>
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: 8,
                                fontSize: '0.7rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                background:
                                  user.role === 'ADMIN'
                                    ? 'rgba(102,126,234,0.15)'
                                    : 'rgba(0,0,0,0.05)',
                                color:
                                  user.role === 'ADMIN'
                                    ? 'var(--aurora-indigo)'
                                    : 'var(--text-muted)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              {user.role === 'ADMIN' && (
                                <ShieldCheck size={12} />
                              )}
                              {user.role}
                            </span>
                          </td>
                          <td style={{ padding: '12px 20px' }}>
                            <div style={{ fontWeight: 800 }}>
                              {user._count.ratings}{' '}
                              <span
                                style={{
                                  fontWeight: 400,
                                  color: 'var(--text-muted)',
                                  fontSize: '0.8rem',
                                }}
                              >
                                Ratings cast
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                              }}
                            >
                              Member since{' '}
                              {new Date(user.createdAt).getFullYear()}
                            </div>
                          </td>
                          <td
                            style={{ padding: '12px 20px', textAlign: 'right' }}
                          >
                            <button
                              onClick={() => toggleUserRole(user.id, user.role)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--aurora-indigo)',
                                cursor: 'pointer',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                              }}
                            >
                              {user.role === 'ADMIN'
                                ? 'REVOKE ACCESS'
                                : 'GRANT ADMIN'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </GlassPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Slide-over Drawer for Celeb Form */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
                backgroundColor: 'rgba(0,0,0,0.15)',
                backdropFilter: 'blur(4px)',
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 1001,
                width: '100%',
                maxWidth: 480,
                background: 'white',
                boxShadow: '-20px 0 50px rgba(0,0,0,0.1)',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 32,
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    fontWeight: 900,
                  }}
                >
                  {editingId ? 'Revise Star' : 'Onboard Star'}
                </h2>
                <button
                  onClick={closeModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24,
                  flex: 1,
                  overflowY: 'auto',
                  paddingRight: 4,
                }}
              >
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <label
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                    }}
                  >
                    IDENTITY
                  </label>
                  <input
                    required
                    placeholder="Stage Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: '#fcfcfc',
                      outline: 'none',
                    }}
                  />
                </div>

                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <label
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                    }}
                  >
                    FIELD of FAME
                  </label>
                  <input
                    required
                    placeholder="e.g. Actor, Footballer, Artist"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: '#fcfcfc',
                      outline: 'none',
                    }}
                  />
                </div>

                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <label
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                    }}
                  >
                    VISUAL ASSET (URL)
                  </label>
                  <input
                    required
                    placeholder="https://image-source.com/star.jpg"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: '#fcfcfc',
                      outline: 'none',
                    }}
                  />
                </div>

                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <label
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                    }}
                  >
                    ORIGIN
                  </label>
                  <input
                    placeholder="Nationality"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: '#fcfcfc',
                      outline: 'none',
                    }}
                  />
                </div>

                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <label
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                    }}
                  >
                    BIOGRAPHY
                  </label>
                  <textarea
                    required
                    placeholder="Narrative summary..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: '#fcfcfc',
                      outline: 'none',
                      minHeight: 140,
                      resize: 'none',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    marginTop: 'auto',
                    paddingTop: 32,
                  }}
                >
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 14,
                      border: '1px solid rgba(0,0,0,0.05)',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 800,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      flex: 1.5,
                      padding: 16,
                      borderRadius: 14,
                      border: 'none',
                      background: 'var(--text-primary)',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 800,
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    {submitting
                      ? 'Deploying...'
                      : editingId
                        ? 'Update Intel'
                        : 'Publish Star'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
