import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button, Spinner } from '@/components/ui';
import { useT } from '@/i18n';
import type { ApiResponse, SiteConfig } from '@/types';

type SiteMode = 'retail' | 'bespoke' | 'both';

export function AdminSiteConfigPage() {
  const t = useT();
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: config, isLoading } = useQuery({
    queryKey: ['admin', 'site-config'],
    queryFn: () => api.get<ApiResponse<SiteConfig>>('/api/admin/site-config'),
    select: (res) => res.data,
  });

  const [form, setForm] = useState<{ siteMode: SiteMode; siteName: string }>({
    siteMode: 'both',
    siteName: 'Slice',
  });

  useEffect(() => {
    if (config) {
      setForm({ siteMode: config.siteMode as SiteMode, siteName: config.siteName });
    }
  }, [config]);

  const update = useMutation({
    mutationFn: (data: { siteMode: SiteMode; siteName: string }) =>
      api.patch<ApiResponse<SiteConfig>>('/api/admin/site-config', data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'site-config'] });
      void qc.invalidateQueries({ queryKey: ['site-config'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const modeEntries: { value: SiteMode; label: string }[] = [
    { value: 'retail', label: t.admin.siteConfig.modes.retail },
    { value: 'bespoke', label: t.admin.siteConfig.modes.bespoke },
    { value: 'both', label: t.admin.siteConfig.modes.both },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso mb-2">{t.admin.siteConfig.title}</h1>
      <p className="font-sans text-sm text-espresso/50 mb-8">{t.admin.siteConfig.subtitle}</p>

      <div className="max-w-lg space-y-6 bg-cream p-8">
        <div>
          <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1">
            {t.admin.siteConfig.bakeryName}
          </label>
          <input
            type="text"
            value={form.siteName}
            onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))}
            className="w-full border border-espresso/20 bg-warm px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
          />
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-3">
            {t.admin.siteConfig.siteMode}
          </label>
          <div className="space-y-2">
            {modeEntries.map(({ value, label }) => (
              <label key={value} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="siteMode"
                  value={value}
                  checked={form.siteMode === value}
                  onChange={() => setForm((f) => ({ ...f, siteMode: value }))}
                  className="mt-0.5 accent-rose"
                />
                <span className="font-sans text-sm text-espresso">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <Button onClick={() => update.mutate(form)} loading={update.isPending}>
          {saved ? t.admin.siteConfig.saved : t.admin.siteConfig.save}
        </Button>
      </div>
    </div>
  );
}
