import { useRef, useState } from 'react';
import { resolveImageSrc } from '@/lib/images';
import { useUploadImages } from '../hooks/use-upload-images';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export function CakeImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadImages();
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [error, setError] = useState('');

  const previewSrc = value ? resolveImageSrc(value) : '';
  const allImages = [...new Set([...uploaded, ...(value ? [value] : [])])];

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError('');

    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (!files.length) {
      setError('Please select image files (JPEG, PNG, WebP, GIF)');
      return;
    }

    try {
      const res = await upload.mutateAsync(files);
      const urls = res.data.urls;
      setUploaded((prev) => [...urls, ...prev]);
      if (!value && urls[0]) {
        onChange(urls[0]);
      }
    } catch {
      setError('Upload failed. Please try again.');
    }

    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-3 w-full">
      <label className="text-sm font-sans font-medium text-espresso/80">Cake image</label>

      {previewSrc ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-warm border border-espresso/10">
          <img src={previewSrc} alt="Cake preview" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-warm border border-dashed border-espresso/20 flex items-center justify-center">
          <p className="text-xs font-sans text-espresso/40">Upload an image</p>
        </div>
      )}

      <label
        className={`flex flex-col items-center justify-center gap-2 w-full py-8 border-2 border-dashed border-espresso/20 bg-warm cursor-pointer hover:border-rose/50 transition-colors ${
          upload.isPending ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <span className="text-sm font-sans text-espresso/70">
          {upload.isPending ? 'Uploading…' : 'Click or drag to upload images'}
        </span>
        <span className="text-xs font-sans text-espresso/40">
          JPEG, PNG, WebP, GIF · up to 5 MB each
        </span>
      </label>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {allImages.length > 1 && (
        <div>
          <p className="text-xs font-sans text-espresso/50 mb-2">Select which image to use</p>
          <div className="flex flex-wrap gap-2">
            {allImages.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => onChange(url)}
                className={`w-16 h-16 overflow-hidden border-2 flex-shrink-0 ${
                  value === url ? 'border-rose' : 'border-transparent hover:border-espresso/20'
                }`}
              >
                <img src={resolveImageSrc(url)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
