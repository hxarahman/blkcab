import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as s from './careers-styles.ts'

interface Props { firstName?: string; role?: string }

const Email = ({ firstName, role }: Props) => (
  <Html lang="en" dir="ltr"><Head /><Preview>Thanks for applying to BLK CAB</Preview>
    <Body style={s.main}><Container style={s.container}>
      <Section style={s.band}><Text style={s.wordmark}>BLK CAB®</Text></Section>
      <Section style={s.inner}>
        <Heading style={s.h1}>Application received</Heading>
        <Text style={s.text}>Hi {firstName || 'there'},</Text>
        <Text style={s.text}>Thanks for applying for the {role || 'General application'} role at BLK CAB London. We've received your application and our team will review it and be in touch.</Text>
        <Text style={s.text}>BLK CAB — Coffee &amp; People, London</Text>
        <Text style={s.small}><Link style={s.link} href="https://blkcab.com/careers">blkcab.com/careers</Link></Text>
      </Section>
    </Container></Body></Html>
)

export const template = {
  component: Email,
  subject: 'Thanks for applying to BLK CAB',
  fromName: 'BLK CAB® Careers',
  displayName: 'Careers — application received (applicant)',
  previewData: { firstName: 'Jane', role: 'Barista' },
} satisfies TemplateEntry
