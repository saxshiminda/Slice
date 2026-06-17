import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { useCategories } from '@/features/menu';
import { useSubmitOrder } from '../hooks';
import type { OrderInput } from '../hooks';
import { useT } from '@/i18n';

type FormErrors = Partial<Record<keyof OrderInput, string>>;

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  error?: string;
}

function SelectField({ label, value, onChange, options, placeholder, error }: SelectFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-sans font-medium text-espresso/80">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-warm border border-espresso/20 px-4 py-3 text-sm text-espresso focus:outline-none focus:border-rose transition-colors appearance-none ${error ? 'border-red-400' : ''}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function OrderForm() {
  const t = useT();
  const { data: categories = [] } = useCategories();
  const [searchParams] = useSearchParams();
  const cakeFromUrl = searchParams.get('cake');

  const [form, setForm] = useState<OrderInput>({
    name: '',
    email: '',
    eventType: '',
    eventDate: '',
    servings: '',
    categoryId: '',
    details: cakeFromUrl ? `I would like to order a cake in the style of: ${cakeFromUrl}` : '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const mutation = useSubmitOrder();

  useEffect(() => {
    if (cakeFromUrl) {
      setForm((f) => ({
        ...f,
        details: f.details || `I would like to order a cake in the style of: ${cakeFromUrl}`,
      }));
    }
  }, [cakeFromUrl]);

  function set(field: keyof OrderInput) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      eventType: z.string().min(1),
      eventDate: z.string().min(1),
      servings: z.string().min(1),
      categoryId: z.string().min(1),
      details: z.string(),
    });

    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate(result.data);
  }

  if (mutation.isSuccess) {
    return (
      <div className="py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-rose/15 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-espresso mb-3">{t.order.form.successTitle}</h3>
        <p className="text-sm text-espresso/60 font-sans max-w-sm mx-auto leading-relaxed">
          {t.order.form.successBody.replace('{name}', form.name)}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label={t.order.form.name}
          type="text"
          value={form.name}
          onChange={(e) => set('name')(e.target.value)}
          placeholder="Jane Smith"
          error={errors.name}
          autoComplete="name"
        />
        <Input
          label={t.order.form.email}
          type="email"
          value={form.email}
          onChange={(e) => set('email')(e.target.value)}
          placeholder="jane@example.com"
          error={errors.email}
          autoComplete="email"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectField
          label={t.order.form.eventType}
          value={form.eventType}
          onChange={set('eventType')}
          options={t.order.form.eventTypes.map((type) => ({ value: type, label: type }))}
          placeholder={t.order.form.selectEventType}
          error={errors.eventType}
        />
        <Input
          label={t.order.form.eventDate}
          type="date"
          value={form.eventDate}
          onChange={(e) => set('eventDate')(e.target.value)}
          error={errors.eventDate}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectField
          label={t.order.form.servings}
          value={form.servings}
          onChange={set('servings')}
          options={t.order.form.servingOptions.map((s) => ({ value: s, label: s }))}
          placeholder={t.order.form.selectServings}
          error={errors.servings}
        />
        <SelectField
          label={t.order.form.category}
          value={form.categoryId}
          onChange={set('categoryId')}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          placeholder={t.order.form.selectCategory}
          error={errors.categoryId}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="details" className="text-sm font-sans font-medium text-espresso/80">
          {t.order.form.details}{' '}
          <span className="text-espresso/40 font-normal">{t.order.form.detailsOptional}</span>
        </label>
        <textarea
          id="details"
          value={form.details}
          onChange={(e) => set('details')(e.target.value)}
          placeholder={t.order.form.detailsPlaceholder}
          rows={5}
          className="w-full bg-warm border border-espresso/20 px-4 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-rose transition-colors resize-none"
        />
      </div>

      {mutation.isError && <p className="text-sm text-red-500">{t.order.form.error}</p>}

      <Button type="submit" loading={mutation.isPending} className="self-start mt-1">
        {t.order.form.submit}
      </Button>
    </form>
  );
}
