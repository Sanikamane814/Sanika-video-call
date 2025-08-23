import * as React from 'react';
import {
  Container,
  Box,
  Typography,
  Divider,
  Link as MUILink,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  Breadcrumbs
} from '@mui/material';
import { Link } from 'react-router-dom';

const LAST_UPDATED = 'August 14, 2025';

function PageShell({ title, children }) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MUILink component={Link} underline="hover" color="inherit" to="/">
          Home
        </MUILink>
        <Typography color="text.primary">Legal</Typography>
      </Breadcrumbs>

      <Typography
        variant="h3"
        component="h1"
        sx={{ fontWeight: 800, letterSpacing: '-0.5px', mb: 1 }}
      >
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Last updated: {LAST_UPDATED}
      </Typography>

      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        {children}
      </Paper>

      <Box sx={{ mt: 4, color: 'text.secondary' }}>
        <Typography variant="caption">
          If you have questions, contact us at
          {' '}
          <MUILink href="mailto:support@sanikavideo.example">support@sanikavideo.example</MUILink>.
        </Typography>
      </Box>
    </Container>
  );
}

export function PrivacyPolicy() {
  return (
    <PageShell title="Privacy Policy">
      <Typography paragraph>
        Sanika Video Call ("we", "our", "us") respects your privacy. This Privacy Policy explains what
        data we collect, how we use it, and the choices you have. By using our services, you agree to the
        collection and use of information in accordance with this policy.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>Information We Collect</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Account Information"
            secondary="Name, email, and password when you create an account or sign in with a provider."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Usage & Call Metadata"
            secondary="Meeting code, timestamps, duration, participant count, device/browser type, and approximate region (inferred from IP)."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Support & Feedback"
            secondary="Content you submit via forms, surveys, or support requests."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Cookies & Local Storage"
            secondary="Small files used to keep you logged in, remember preferences, and measure aggregate usage."
          />
        </ListItem>
      </List>

      <Typography variant="h6" sx={{ mt: 2 }}>What We Do Not Collect</Typography>
      <Typography paragraph>
        We do <strong>not</strong> access the contents of your audio/video calls. Media streams are sent via
        secure protocols (WebRTC) and are not stored on our servers unless you explicitly start a recording.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>How We Use Information</Typography>
      <List>
        <ListItem><ListItemText primary="Provide and maintain the service" /></ListItem>
        <ListItem><ListItemText primary="Secure the platform, detect abuse, and prevent fraud" /></ListItem>
        <ListItem><ListItemText primary="Improve quality (e.g., diagnose connectivity and performance issues)" /></ListItem>
        <ListItem><ListItemText primary="Communicate updates and respond to support requests" /></ListItem>
      </List>

      <Typography variant="h6" sx={{ mt: 2 }}>Sharing & Disclosure</Typography>
      <Typography paragraph>
        We do not sell your personal information. We share limited data with trusted providers that help run
        our service (e.g., cloud hosting, analytics, email delivery). These providers are bound by contracts
        to protect your data and may only use it as instructed by us. We may disclose information if required
        by law or to protect our rights and users.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>Data Retention</Typography>
      <Typography paragraph>
        Account and history data are retained while your account is active. You can request deletion at any
        time. Diagnostic logs are retained for a limited period for security and reliability.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>Your Choices</Typography>
      <List>
        <ListItem><ListItemText primary="Profile controls" secondary="Update your name, email, or password in account settings."/></ListItem>
        <ListItem><ListItemText primary="Delete data" secondary="Request deletion of your account and associated data."/></ListItem>
        <ListItem><ListItemText primary="Cookie controls" secondary="Manage preferences in our Cookie Policy and your browser settings."/></ListItem>
        <ListItem><ListItemText primary="Marketing" secondary="Opt out of non-essential emails from the footer of any message."/></ListItem>
      </List>

      <Typography variant="h6" sx={{ mt: 2 }}>Children</Typography>
      <Typography paragraph>
        Our service is not intended for children under 13 (or the minimum age in your jurisdiction). We do not
        knowingly collect data from children.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>International Transfers</Typography>
      <Typography paragraph>
        Your data may be processed in countries other than where you live. We use safeguards consistent with
        applicable law when we transfer data.
      </Typography>

      <Divider sx={{ my: 3 }} />
      <Typography variant="body2" color="text.secondary">
        For any privacy requests, email <MUILink href="mailto:privacy@sanikavideo.example">privacy@sanikavideo.example</MUILink>.
      </Typography>
    </PageShell>
  );
}

export function TermsOfService() {
  return (
    <PageShell title="Terms of Service">
      <Typography paragraph>
        These Terms of Service ("Terms") govern your access to and use of Sanika Video Call. By creating an
        account or using our services, you agree to these Terms.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>1. Use of the Service</Typography>
      <List>
        <ListItem><ListItemText primary="Eligibility" secondary="You must be at least 13 years old or the minimum age in your jurisdiction."/></ListItem>
        <ListItem><ListItemText primary="Account" secondary="Keep your credentials confidential and accurate."/></ListItem>
        <ListItem><ListItemText primary="Acceptable Use" secondary="Do not abuse, harass, infringe others' rights, or attempt to disrupt the service."/></ListItem>
      </List>

      <Typography variant="h6" sx={{ mt: 2 }}>2. Meetings & Content</Typography>
      <Typography paragraph>
        You are responsible for the content you share. If recording is enabled, ensure all participants consent
        where required by law. We may remove content or suspend accounts that violate these Terms.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>3. Software & Updates</Typography>
      <Typography paragraph>
        We may provide updates or changes that improve performance or security. Some updates may happen
        automatically.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>4. Third‑Party Services</Typography>
      <Typography paragraph>
        The service may interoperate with third‑party tools (e.g., identity providers, email, analytics). We are
        not responsible for third‑party terms or privacy practices.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>5. Paid Features</Typography>
      <Typography paragraph>
        If you purchase a plan, fees and renewal terms will be shown at checkout. Taxes may apply. To avoid
        renewal, cancel before the renewal date.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>6. Disclaimers</Typography>
      <Typography paragraph>
        The service is provided "AS IS" without warranties of any kind. We do not guarantee uninterrupted or
        error‑free operation.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>7. Limitation of Liability</Typography>
      <Typography paragraph>
        To the maximum extent permitted by law, Sanika Video Call will not be liable for indirect, incidental,
        special, consequential, or punitive damages, or any loss of profits or data.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>8. Termination</Typography>
      <Typography paragraph>
        You may stop using the service at any time. We may suspend or terminate access if you violate these
        Terms or if required by law.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>9. Changes to These Terms</Typography>
      <Typography paragraph>
        We may modify these Terms from time to time. We will post the updated Terms with a new "Last updated"
        date. Continued use means you accept the changes.
      </Typography>

      <Divider sx={{ my: 3 }} />
      <Typography variant="body2" color="text.secondary">
        Questions about these Terms? Email <MUILink href="mailto:legal@sanikavideo.example">legal@sanikavideo.example</MUILink>.
      </Typography>
    </PageShell>
  );
}

export function CookiePolicy() {
  return (
    <PageShell title="Cookie Policy">
      <Typography paragraph>
        This Cookie Policy explains how Sanika Video Call uses cookies and similar technologies to provide,
        protect, and improve our services.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>What Are Cookies?</Typography>
      <Typography paragraph>
        Cookies are small text files stored on your device. We also use local storage and similar technologies
        for the same purposes.
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>How We Use Cookies</Typography>
      <List>
        <ListItem><ListItemText primary="Essential" secondary="Required for core features like authentication, security, and load balancing."/></ListItem>
        <ListItem><ListItemText primary="Preferences" secondary="Remember your settings, such as theme and language."/></ListItem>
        <ListItem><ListItemText primary="Analytics" secondary="Help us understand how the app is used to improve reliability and performance."/></ListItem>
      </List>

      <Typography variant="h6" sx={{ mt: 2 }}>Managing Cookies</Typography>
      <Typography paragraph>
        You can control cookies via your browser settings. Blocking essential cookies may impact core
        functionality (e.g., login or meeting join).
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>Third‑Party Cookies</Typography>
      <Typography paragraph>
        Some third parties may set cookies when you interact with our site (for example, analytics or embedded
        media). We do not control third‑party cookies; please review their policies.
      </Typography>

      <Divider sx={{ my: 3 }} />
      <Typography variant="body2" color="text.secondary">
        For cookie questions, email <MUILink href="mailto:cookies@sanikavideo.example">cookies@sanikavideo.example</MUILink>.
      </Typography>
    </PageShell>
  );
}

/**
 * Optional: A single-page legal hub with tabs for Privacy, Terms, and Cookies.
 * You can route to this component at /legal, and also route directly to the
 * individual pages (see usage notes in chat).
 */
export default function LegalPages() {
  const [tab, setTab] = React.useState(0);
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Legal</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Last updated: {LAST_UPDATED}
      </Typography>

      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Privacy Policy" />
          <Tab label="Terms of Service" />
          <Tab label="Cookie Policy" />
        </Tabs>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {tab === 0 && <PrivacyPolicy />}
          {tab === 1 && <TermsOfService />}
          {tab === 2 && <CookiePolicy />}
        </Box>
      </Paper>
    </Container>
  );
}
