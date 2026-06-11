import { useState } from 'react';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { useSubmitOrder } from '../hooks';
import type { OrderInput } from '../hooks';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().min(1, 'Please provide an event date'),
  servings: z.string().min(1, 'Please select a serving size'),
  cakeCategory: z.string().min(1, 'Please select a cake category'),
  details: z.string(),
});

type FormErrors = Partial<Record<keyof OrderInput, string>>;

const eventTypes = ['Wedding', 'Birthday', 'Anniversary', 'Corporate', 'Christening', 'Other'];
const servingOptions = ['Up to 20', '20–40', '40–80', '80–120', '120+'];
const cakeCategories = ['Wedding', 'Birthday', 'Seasonal', 'Custom'];

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
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
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function OrderForm() {
  const [form, setForm] = useState<OrderInput>({
    name: '',
    email: '',
    eventType: '',
    eventDate: '',
    servings: '',
    cakeCategory: '',
    details: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const mutation = useSubmitOrder();

  function set(field: keyof OrderInput) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        <h3 className="font-display text-2xl text-espresso mb-3">Order Request Received</h3>
        <p className="text-sm text-espresso/60 font-sans max-w-sm mx-auto leading-relaxed">
          Thank you, {form.name}. We will review your request and get back to you within 48 hours to
          discuss the details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Your name"
          type="text"
          value={form.name}
          onChange={(e) => set('name')(e.target.value)}
          placeholder="Jane Smith"
          error={errors.name}
          autoComplete="name"
        />
        <Input
          label="Email address"
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
          label="Event type"
          value={form.eventType}
          onChange={set('eventType')}
          options={eventTypes}
          placeholder="Select event type"
          error={errors.eventType}
        />
        <Input
          label="Event date"
          type="date"
          value={form.eventDate}
          onChange={(e) => set('eventDate')(e.target.value)}
          error={errors.eventDate}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectField
          label="Number of servings"
          value={form.servings}
          onChange={set('servings')}
          options={servingOptions}
          placeholder="Select serving size"
          error={errors.servings}
        />
        <SelectField
          label="Cake category"
          value={form.cakeCategory}
          onChange={set('cakeCategory')}
          options={cakeCategories}
          placeholder="Select category"
          error={errors.cakeCategory}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="details" className="text-sm font-sans font-medium text-espresso/80">
          Additional details <span className="text-espresso/40 font-normal">(optional)</span>
        </label>
        <textarea
          id="details"
          value={form.details}
          onChange={(e) => set('details')(e.target.value)}
          placeholder="Flavour preferences, dietary requirements, design ideas, colour palette…"
          rows={5}
          className="w-full bg-warm border border-espresso/20 px-4 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-rose transition-colors resize-none"
        />
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}

      <Button type="submit" loading={mutation.isPending} className="self-start mt-1">
        Submit Order Request
      </Button>
    </form>
  );
}
