'use client'

import { useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { getFunctionsInstance } from '@/lib/firebase/config'

const grades = Array.from({ length: 9 }, (_, i) => `Grade ${i + 1}`)

const competencies = [
  'Communication and Collaboration',
  'Critical Thinking',
  'Creativity',
  'Self-efficacy',
  'Citizenship',
  'Digital Literacy',
  'Learning to Learn',
]

interface FormData {
  gradeLevel: string
  subject: string
  strand: string
  subStrand: string
  learningOutcomes: string
  coreCompetencies: string[]
}

export default function AiLessonAssistant() {
  const [form, setForm] = useState<FormData>({
    gradeLevel: '',
    subject: '',
    strand: '',
    subStrand: '',
    learningOutcomes: '',
    coreCompetencies: [],
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const updateField = (field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCompetency = (comp: string) => {
    setForm((prev) => ({
      ...prev,
      coreCompetencies: prev.coreCompetencies.includes(comp)
        ? prev.coreCompetencies.filter((c) => c !== comp)
        : [...prev.coreCompetencies, comp],
    }))
  }

  const handleGenerate = async () => {
    if (loading) return
    setLoading(true)
    setResult(null)
    setCopied(false)

    try {
      const generatePlan = httpsCallable(getFunctionsInstance(), 'aiLessonPlan')
      const res = await generatePlan({
        grade: form.gradeLevel,
        learningArea: form.subject,
        strand: form.strand,
        subStrand: form.subStrand,
        learningOutcomes: form.learningOutcomes,
        coreCompetencies: form.coreCompetencies,
      })
      setResult(typeof res.data === 'string' ? res.data : JSON.stringify(res.data, null, 2))
    } catch (err: any) {
      setResult(`Error: ${err?.message ?? 'Something went wrong'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 24 }}>AI Lesson Assistant</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          maxWidth: 800,
          marginBottom: 24,
        }}
      >
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Grade Level
          </label>
          <select
            value={form.gradeLevel}
            onChange={(e) => updateField('gradeLevel', e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e1' }}
          >
            <option value="">Select grade</option>
            {grades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Learning Area / Subject
          </label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => updateField('subject', e.target.value)}
            placeholder="e.g. Mathematics, English"
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Strand / Main Topic
          </label>
          <input
            type="text"
            value={form.strand}
            onChange={(e) => updateField('strand', e.target.value)}
            placeholder="e.g. Numbers, Grammar"
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Sub-strand / Sub-topic
          </label>
          <input
            type="text"
            value={form.subStrand}
            onChange={(e) => updateField('subStrand', e.target.value)}
            placeholder="e.g. Addition, Verbs"
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e1' }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 800, marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Specific Learning Outcomes
        </label>
        <textarea
          value={form.learningOutcomes}
          onChange={(e) => updateField('learningOutcomes', e.target.value)}
          placeholder="Describe what learners should be able to do by the end of the lesson..."
          rows={4}
          style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e1', resize: 'vertical' }}
        />
      </div>

      <div style={{ maxWidth: 800, marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          Core Competencies
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {competencies.map((comp) => (
            <label
              key={comp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 4,
                border: '1px solid #cbd5e1',
                background: form.coreCompetencies.includes(comp) ? '#dbeafe' : '#fff',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              <input
                type="checkbox"
                checked={form.coreCompetencies.includes(comp)}
                onChange={() => toggleCompetency(comp)}
              />
              {comp}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: '12px 32px',
          fontSize: 16,
          fontWeight: 600,
          background: loading ? '#94a3b8' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {loading && (
          <span
            style={{
              width: 18,
              height: 18,
              border: '2px solid #fff',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              display: 'inline-block',
            }}
          />
        )}
        {loading ? 'Generating...' : 'Generate Lesson Plan'}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {result && (
        <div
          style={{
            marginTop: 32,
            maxWidth: 800,
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}
          >
            <span style={{ fontWeight: 600 }}>Generated Lesson Plan</span>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                padding: '6px 16px',
                fontSize: 13,
                background: copied ? '#16a34a' : '#334155',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          <pre
            style={{
              padding: 16,
              margin: 0,
              maxHeight: 500,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'inherit',
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
