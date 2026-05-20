'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/lib/constants';
import toast from 'react-hot-toast';

const EMPTY = {
  title: '',
  shortDescription: '',
  detailedDescription: '',
  category: '',
  tags: '',
  imageURL: '',
  estimatedBudget: '',
  targetAudience: '',
  problemStatement: '',
  proposedSolution: '',
};

export default function IdeaForm({
  initialValues,
  onSubmit,
  submitLabel = 'Submit Idea',
  submitting = false,
}) {
  const [form, setForm] = useState(() => {
    if (!initialValues) return EMPTY;
    return {
      ...EMPTY,
      ...initialValues,
      tags: Array.isArray(initialValues.tags)
        ? initialValues.tags.join(', ')
        : initialValues.tags || '',
    };
  });

  const [imagePreview, setImagePreview] = useState(initialValues?.imageURL || null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target?.result;
      setForm((f) => ({ ...f, imageURL: dataURL }));
      setImagePreview(dataURL);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.shortDescription.trim() ||
      !form.detailedDescription.trim() ||
      !form.category
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FieldGroup num="01" title="The premise" hint="Required">
        <Field
          label="Title"
          required
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="An AI meal planner for tired parents"
        />
        <TextareaField
          label="Short description"
          required
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          rows={2}
          placeholder="One or two sentences that capture the essence."
        />
        <TextareaField
          label="Detailed description"
          required
          name="detailedDescription"
          value={form.detailedDescription}
          onChange={handleChange}
          rows={5}
          placeholder="Explain the idea in depth — how it works, why it matters."
        />
      </FieldGroup>

      <FieldGroup num="02" title="Classification">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <Label required>Category</Label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-transparent border-0 border-b border-base-300 focus:border-base-content focus:outline-none focus:ring-0 px-0 py-2 text-base"
            >
              <option value="">— Select —</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="saas, mobile, b2c"
            hint="Comma separated"
          />
        </div>
        <div>
          <Label>Cover image</Label>
          <div className="space-y-3">
            {/* File Upload Input */}
            <div className="border-2 border-dashed border-base-300 rounded-lg p-4 text-center hover:border-base-content transition-colors cursor-pointer"
              onClick={() => document.getElementById('imageUpload').click()}
            >
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-sm text-base-content/60">Click to upload an image</p>
              <p className="text-xs text-base-content/40 mt-1">JPG, PNG, WebP up to 5MB</p>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-base-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, imageURL: '' }));
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-error text-error-content rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Alternative: URL Input */}
            <div>
              <p className="text-xs text-base-content/40 mb-2">Or paste image URL</p>
              <input
                type="text"
                name="imageURL"
                value={form.imageURL && !form.imageURL.startsWith('data:') ? form.imageURL : ''}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value && !e.target.value.startsWith('data:')) {
                    setImagePreview(e.target.value);
                  }
                }}
                placeholder="https://…/cover.jpg"
                className="w-full bg-transparent border-0 border-b border-base-300 focus:border-base-content focus:outline-none focus:ring-0 px-0 py-2 text-base placeholder:text-base-content/35 placeholder:italic"
              />
            </div>
          </div>
        </div>
      </FieldGroup>

      <FieldGroup num="03" title="The market">
        <div className="grid sm:grid-cols-2 gap-6">
          <Field
            label="Estimated budget"
            name="estimatedBudget"
            value={form.estimatedBudget}
            onChange={handleChange}
            placeholder="$10,000 – $25,000"
            hint="Optional"
          />
          <Field
            label="Target audience"
            name="targetAudience"
            value={form.targetAudience}
            onChange={handleChange}
            placeholder="Working parents, 28–45"
          />
        </div>
        <TextareaField
          label="Problem statement"
          name="problemStatement"
          value={form.problemStatement}
          onChange={handleChange}
          rows={3}
          placeholder="What pain point does this address?"
        />
        <TextareaField
          label="Proposed solution"
          name="proposedSolution"
          value={form.proposedSolution}
          onChange={handleChange}
          rows={3}
          placeholder="How does your idea solve that problem?"
        />
      </FieldGroup>

      <div className="pt-4 border-t border-base-300">
        <button
          type="submit"
          disabled={submitting}
          className="btn-editorial-solid w-full justify-center py-4 text-base disabled:opacity-50 mx-full"
        >
          {submitting ? 'Submitting…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function FieldGroup({ num, title, hint, children }) {
  return (
    <section className="grid md:grid-cols-[160px,1fr] gap-6 pb-8 border-b border-base-300 last:border-0">
      <div>
        <p className="num-badge mb-1">§ {num}</p>
        <h3 className="font-display text-xl tracking-tightest">{title}</h3>
        {hint && (
          <p className="text-xs text-base-content/50 mt-1 italic">{hint}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Label({ children, required, hint }) {
  return (
    <label className="eyebrow text-base-content/55 mb-1.5 flex items-center justify-between">
      <span>
        {children}
        {required && <span className="text-error not-italic ml-1">*</span>}
      </span>
      {hint && <span className="text-base-content/40 normal-case tracking-normal lowercase italic">{hint}</span>}
    </label>
  );
}

function Field({ label, required, hint, ...props }) {
  return (
    <div>
      <Label required={required} hint={hint}>{label}</Label>
      <input
        {...props}
        className="w-full bg-transparent border-0 border-b border-base-300 focus:border-base-content focus:outline-none focus:ring-0 px-0 py-2 text-base placeholder:text-base-content/35 placeholder:italic"
      />
    </div>
  );
}

function TextareaField({ label, required, hint, ...props }) {
  return (
    <div>
      <Label required={required} hint={hint}>{label}</Label>
      <textarea
        {...props}
        className="w-full bg-transparent border border-base-300 focus:border-base-content focus:outline-none focus:ring-0 px-3 py-2.5 text-base resize-none placeholder:text-base-content/35 placeholder:italic"
      />
    </div>
  );
}
