'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { previewSlots } from '@/lib/volunteers/events';
import { parseAvailability, type AvailabilitySnapshot } from '@/lib/volunteers/client-status';

export function useAvailability(eventId: string) {
  const [snapshot, setSnapshot] = useState<AvailabilitySnapshot>(() => ({ slots: previewSlots.filter(slot => slot.event_id === eventId), countsLive: false, status: 'loading' }));
  const lifecycle = useRef<{ active: boolean; request: number; controller: AbortController | null }>({ active: false, request: 0, controller: null });

  const refresh = useCallback(async (): Promise<AvailabilitySnapshot | null> => {
    const state = lifecycle.current;
    const request = ++state.request;
    state.controller?.abort();
    const controller = new AbortController();
    state.controller = controller;
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/api/benevoles', { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw Error('Unavailable');
      const apiRelease = response.headers.get('X-EDR-Release');
      const pageRelease = document.querySelector<HTMLMetaElement>('meta[name="edr-volunteers-release"]')?.content;
      if (pageRelease && apiRelease && pageRelease !== 'local' && apiRelease !== 'local' && pageRelease !== apiRelease) {
        if (state.active && request === state.request) setSnapshot(previous => ({ ...previous, status: 'error', countsLive: false, error: 'version' }));
        return null;
      }
      const next = parseAvailability(await response.json(), eventId);
      if (!state.active || request !== state.request) return null;
      // Apply status and counters together; older responses can never reopen the form.
      setSnapshot(next);
      return next;
    } catch {
      if (state.active && request === state.request) setSnapshot(previous => ({ ...previous, status: 'error', countsLive: false, error: 'network' }));
      return null;
    } finally {
      window.clearTimeout(timeout);
    }
  }, [eventId]);

  useEffect(() => {
    const state = lifecycle.current;
    state.active = true;
    const initial = window.setTimeout(() => { void refresh(); }, 0);
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh(); };
    const onFocus = () => { void refresh(); };
    window.addEventListener('focus', onFocus);
    window.addEventListener('online', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    const interval = window.setInterval(onVisible, 30000);
    return () => {
      state.active = false;
      ++state.request;
      state.controller?.abort();
      window.clearTimeout(initial);
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  return { ...snapshot, refresh };
}
