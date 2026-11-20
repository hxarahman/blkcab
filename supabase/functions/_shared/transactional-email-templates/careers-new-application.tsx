import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as s from './careers-styles.ts'

interface Props { id?: string; role?: string; name?: string; email?: string; phone?: string; rightToWork?: string; availability?: string; quiz?: string; submitted?: string }

const Row = ({ k, v }: { k: string; v?: string }) => (<><Text style={s.label}>{k}</Text><Text style={s.value}>{v || '—'}</Text></>)

const Email = (p: Props) => (
  <Html lang="en" dir="ltr"><Head /><Preview>{`New application: ${p.role || 'General application'} — ${p.name || 'Applicant'}`}</Preview>
    <Body style={s.main}><Container style={s.container}>
      <Section style={s.band}><Text style={s.wordmark}>BLK CAB®</Text></Section>
      <Section style={s.inner}>
        <Heading style={s.h1}>New application</Heading>
        <Row k="Role" v={p.role || 'General application'} />
        <Row k="Name" v={p.name} />
        <Row k="Email" v={p.email} />
        <Row k="Phone" v={p.phone} />
        <Row k="Right to work in UK" v={p.rightToWork} />
        <Row k="Availability" v={p.availability} />
        <Row k="Quiz score" v={p.quiz || 'No quiz'} />
        <Row k="Submitted" v={p.submitted} />
        {p.id && <Button style={s.button} href={`https://blkcab.com/careers/admin?application=${encodeURIComponent(p.id)}`}>View application</Button>}
      </Section>
    </Container></Body></Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `New application: ${d.role || 'General application'} — ${d.name || 'Applicant'}`,
  displayName: 'Careers — new application (team)',
  to: 'careers@blkcab.com',
  previewData: { id: '00000000-0000-0000-0000-000000000000', role: 'Barista', name: 'Jane Doe', email: 'jane@example.com', phone: '07000 000000', rightToWork: 'Yes', availability: 'Weekends', quiz: '7/9 · 78%', submitted: '20 Nov 2026, 09:30' },
} satisfies TemplateEntry
