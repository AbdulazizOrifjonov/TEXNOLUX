import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

function getAvatarStorageKey(u) {
  if (!u) return 'texnolux_avatar_guest';
  const idPart = u.chatId || u.id || u._id || u.phone || 'user';
  return `texnolux_avatar_${String(idPart)}`;
}

function getSavedAvatar(u, fallback = '') {
  if (typeof localStorage === 'undefined') return fallback;
  const local = localStorage.getItem(getAvatarStorageKey(u));
  if (local !== null) return local;
  return fallback || '';
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nsb_token') || null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [guestAvatar, setGuestAvatar] = useState(() => {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem('texnolux_avatar_guest') || '';
  });

  const refreshUnreadCount = async (targetUser = user) => {
    try {
      const res = await api.get('/notifications', {
        params: {
          chatId: targetUser?.chatId || '',
          phone: targetUser?.phone || '',
          role: targetUser?.role || ''
        }
      });
      if (res.data?.success && Array.isArray(res.data.notifications)) {
        setUnreadCount(res.data.notifications.filter((n) => !n.read).length);
      }
    } catch (_) {}
  };

  useEffect(() => {
    refreshUnreadCount(user);
    if (typeof window === 'undefined') return undefined;
    const handler = () => refreshUnreadCount(user);
    window.addEventListener('texnolux-notifications-updated', handler);
    return () => window.removeEventListener('texnolux-notifications-updated', handler);
  }, [user]);

  useEffect(() => {
    let active = true;

    const initAuth = async () => {
      try {
        // 1. Capture Telegram user id from URL query (?tg_id=...) or Telegram WebApp SDK
        let tgId = null;
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const urlTgId = urlParams.get('tg_id');
          if (urlTgId) {
            localStorage.setItem('texnolux_tg_id', urlTgId);
            sessionStorage.removeItem('texnolux_logged_out');
            tgId = urlTgId;
          } else if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
            tgId = String(window.Telegram.WebApp.initDataUnsafe.user.id);
            localStorage.setItem('texnolux_tg_id', tgId);
          } else {
            tgId = localStorage.getItem('texnolux_tg_id');
          }
        }

        // 2. If user has explicit token (e.g. Admin login), verify token first
        if (token) {
          const res = await api.get('/auth/me');
          if (active && res.data.success) {
            const loadedUser = res.data.user;
            const avatar = getSavedAvatar(loadedUser, loadedUser.avatar || '');
            setUser({ ...loadedUser, avatar });
            return;
          }
        }

        // 3. Auto-authenticate Telegram bot registered user
        const loggedOut = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('texnolux_logged_out') === '1';
        if (!loggedOut && tgId) {
          const custRes = await fetch(`/data/customers.json?t=${Date.now()}`, { cache: 'no-store' });
          if (custRes.ok) {
            const list = await custRes.json();
            const found = Array.isArray(list)
              ? list.find((c) => String(c.chatId) === String(tgId) || String(c.id) === `tg_${tgId}`)
              : null;
            if (found && active) {
              const tgPhotoFallback =
                (typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url : '') || '';
              const baseUser = {
                id: found.id || `tg_${found.chatId}`,
                chatId: found.chatId,
                name: found.fullName || found.name,
                firstName: found.firstName,
                lastName: found.lastName,
                phone: found.phone,
                username: found.username,
                email: found.username ? `@${found.username}` : '',
                registeredAt: found.registeredAt,
                role: 'customer',
                isTelegramRegistered: true,
                serverAvatar: found.avatar || tgPhotoFallback
              };
              const avatar = getSavedAvatar(baseUser, found.avatar || tgPhotoFallback);
              setUser({ ...baseUser, avatar });
              return;
            }
          }
        }
      } catch (_) {
        if (token) logout();
      } finally {
        if (active) setLoading(false);
      }
    };

    initAuth();
    return () => { active = false; };
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      sessionStorage.removeItem('texnolux_logged_out');
      localStorage.setItem('nsb_token', res.data.token);
      setToken(res.data.token);
      const u = res.data.user;
      setUser({ ...u, avatar: getSavedAvatar(u, u.avatar || '') });
    }
    return res.data;
  };

  const register = async (name, email, password, phone) => {
    const res = await api.post('/auth/register', { name, email, password, phone });
    if (res.data.success) {
      sessionStorage.removeItem('texnolux_logged_out');
      localStorage.setItem('nsb_token', res.data.token);
      setToken(res.data.token);
      const u = res.data.user;
      setUser({ ...u, avatar: getSavedAvatar(u, u.avatar || '') });
    }
    return res.data;
  };

  const adminLogin = async (email, password) => {
    const res = await api.post('/auth/admin/login', { email, password });
    if (res.data.success) {
      sessionStorage.removeItem('texnolux_logged_out');
      localStorage.setItem('nsb_token', res.data.token);
      setToken(res.data.token);
      const u = res.data.user;
      setUser({ ...u, avatar: getSavedAvatar(u, u.avatar || '') });
    }
    return res.data;
  };

  const updateProfileAvatar = async (avatarDataUrl) => {
    if (!avatarDataUrl) return '';
    if (user) {
      const key = getAvatarStorageKey(user);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, avatarDataUrl);
      }
      setUser((prev) => (prev ? { ...prev, avatar: avatarDataUrl } : prev));
      try {
        const res = await fetch('/bot-api/customer/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: user.chatId,
            userId: user.id,
            phone: user.phone,
            name: user.name,
            username: user.username,
            avatar: avatarDataUrl
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data.avatar) {
            return data.avatar;
          }
        }
      } catch (_) {}
      return avatarDataUrl;
    } else {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('texnolux_avatar_guest', avatarDataUrl);
      }
      setGuestAvatar(avatarDataUrl);
      return avatarDataUrl;
    }
  };

  const removeProfileAvatar = async () => {
    if (user) {
      const key = getAvatarStorageKey(user);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, '');
      }
      setUser((prev) => (prev ? { ...prev, avatar: '' } : prev));
      try {
        await fetch('/bot-api/customer/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: user.chatId,
            userId: user.id,
            phone: user.phone,
            remove: true
          })
        });
      } catch (_) {}
    } else {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('texnolux_avatar_guest');
      }
      setGuestAvatar('');
    }
  };

  const logout = () => {
    sessionStorage.setItem('texnolux_logged_out', '1');
    localStorage.removeItem('nsb_token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        guestAvatar,
        unreadCount,
        refreshUnreadCount,
        login,
        register,
        adminLogin,
        logout,
        updateProfileAvatar,
        removeProfileAvatar,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
