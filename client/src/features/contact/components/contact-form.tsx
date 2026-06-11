import { useState } from 'react';
import { z } from 'zod';
import { Button, Input, Textarea } from '@/components/ui';
import { useSubmitInquiry } from '../hooks';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useSubmitInquiry();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = schema.safeParse({ name, email, message });
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
        <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-espresso mb-3">Message Received</h3>
        <p className="text-sm text-espresso/60 font-sans max-w-sm mx-auto leading-relaxed">
          Thank you for getting in touch. We will be in contact with you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <Input
        label="Your name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Jane Smith"
        error={errors.name}
        autoComplete="name"
      />
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jane@example.com"
        error={errors.email}
        autoComplete="email"
      />
      <Textarea
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us about your event, preferred flavours, or any questions you have…"
        rows={6}
        error={errors.message}
      />

      {mutation.isError && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}

      <Button type="submit" loading={mutation.isPending} className="self-start">
        Send Enquiry
      </Button>
    </form>
  );
}
