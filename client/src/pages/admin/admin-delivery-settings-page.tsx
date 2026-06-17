import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Spinner, Button } from '@/components/ui';
import { useT } from '@/i18n';
import type { ApiResponse, DeliverySettings } from '@/types';

export function AdminDeliverySettingsPage() {
  const t = useT();
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'delivery-settings'],
    queryFn: () => api.get<ApiResponse<DeliverySettings>>('/api/admin/delivery-settings'),
    select: (res) => res.data,
  });

  const [form, setForm] = useState({
    minOrderAmount: 0,
    deliveryFee: 5,
    freeDeliveryThreshold: '' as string,
    deliveryAvailable: true,
    pickupAvailable: true,
  });

  useEffect(() => {
    if (!settings) return;
    setForm({
      minOrderAmount: settings.minOrderAmount,
      deliveryFee: settings.deliveryFee,
      freeDeliveryThreshold:
        settings.freeDeliveryThreshold !== null ? String(settings.freeDeliveryThreshold) : '',
      deliveryAvailable: settings.deliveryAvailable,
      pickupAvailable: settings.pickupAvailable,
    });
  }, [settings]);

  const update = useMutation({
    mutationFn: (data: Partial<DeliverySettings & { freeDeliveryThreshold: number | null }>) =>
      api.patch<ApiResponse<DeliverySettings>>('/api/admin/delivery-settings', data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'delivery-settings'] });
      void qc.invalidateQueries({ queryKey: ['delivery-settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  function handleSave() {
    update.mutate({
      minOrderAmount: form.minOrderAmount,
      deliveryFee: form.deliveryFee,
      freeDeliveryThreshold:
        form.freeDeliveryThreshold === '' ? null : Number(form.freeDeliveryThreshold),
      deliveryAvailable: form.deliveryAvailable,
      pickupAvailable: form.pickupAvailable,
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso mb-2">{t.admin.delivery.title}</h1>
      <p className="font-sans text-sm text-espresso/50 mb-8">{t.admin.delivery.subtitle}</p>

      <div className="max-w-lg space-y-6 bg-cream p-8">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.pickupAvailable}
              onChange={(e) => setForm((f) => ({ ...f, pickupAvailable: e.target.checked }))}
              className="w-4 h-4 accent-rose"
            />
            <span className="font-sans text-sm text-espresso">
              {t.admin.delivery.pickupAvailable}
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.deliveryAvailable}
              onChange={(e) => setForm((f) => ({ ...f, deliveryAvailable: e.target.checked }))}
              className="w-4 h-4 accent-rose"
            />
            <span className="font-sans text-sm text-espresso">
              {t.admin.delivery.deliveryAvailable}
            </span>
          </label>
        </div>

        <NumberField
          label={t.admin.delivery.minOrder}
          value={form.minOrderAmount}
          onChange={(v) => setForm((f) => ({ ...f, minOrderAmount: v }))}
        />
        <NumberField
          label={t.admin.delivery.deliveryFee}
          value={form.deliveryFee}
          onChange={(v) => setForm((f) => ({ ...f, deliveryFee: v }))}
        />
        <div>
          <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1">
            {t.admin.delivery.freeThreshold}
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.freeDeliveryThreshold}
            onChange={(e) => setForm((f) => ({ ...f, freeDeliveryThreshold: e.target.value }))}
            placeholder="e.g. 140"
            className="w-full border border-espresso/20 bg-warm px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
          />
        </div>

        <Button onClick={handleSave} loading={update.isPending}>
          {saved ? t.admin.delivery.saved : t.admin.delivery.save}
        </Button>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1">
        {label}
      </label>
      <input
        type="number"
        min={0}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-espresso/20 bg-warm px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
      />
    </div>
  );
}
