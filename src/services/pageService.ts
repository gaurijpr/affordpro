export interface PageContent {
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  lastUpdated?: string;
  email?: string;
  phone?: string;
  address?: string;
  workingHours?: string;
}

export const DEFAULT_PAGES: Record<string, PageContent> = {
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    subtitle: 'How AffordPro collects, protects, and handles your personal & transaction data.',
    lastUpdated: 'August 2026',
    content: `At AffordPro, we are committed to protecting your privacy and ensuring transparency in how your personal information is collected, used, and safeguarded.

1. Information We Collect
We collect personal information such as your name, email address, payment confirmation details, and download access logs when you register an account or purchase digital assets on our platform.

2. How We Use Your Information
Your information is strictly used to:
- Process instant payments and issue digital download links.
- Send order confirmations, license receipts, and customer support updates.
- Enhance website performance, security, and anti-fraud protections.

3. Data Security & Encryption
All payment processing occurs over 256-bit SSL encrypted channels handled by trusted payment gateways. We never store credit card numbers, debit card PINs, or UPI security codes on our servers.

4. Third-Party Services
We do not sell, trade, or rent your personal information to third-party marketing companies. Trusted service providers (e.g. payment processors, email delivery networks) only process data required to deliver your orders.

5. Cookies & Tracking
AffordPro uses standard session cookies to keep you signed in and save items in your shopping cart. You can disable cookies in your browser settings at any time.

6. Your Rights & Contact Information
You may request access to, correction of, or deletion of your personal data by contacting support@affordpro.com.`,
  },

  'terms': {
    slug: 'terms',
    title: 'Terms & Conditions',
    subtitle: 'Important rules, licensing terms, and legal agreements governing the use of AffordPro.',
    lastUpdated: 'August 2026',
    content: `Welcome to AffordPro. By accessing our website or purchasing digital products, you agree to comply with and be bound by the following Terms & Conditions.

1. License & Usage
- Commercial License: Digital products marked with a commercial license allow you to use the assets in client work, commercial social media posts, and marketing campaigns.
- Personal License: Personal license items are restricted to non-commercial personal projects.
- Resale Prohibited: You may NOT re-sell, sub-license, redistribute, or share original source files, templates, or raw digital bundles as standalone assets.

2. Digital Delivery & Instant Access
Upon successful payment, digital download links and access credentials are delivered instantly to your registered email address and user dashboard.

3. Intellectual Property Rights
All branding, design elements, templates, videos, and source assets are protected by international copyright laws and belong to AffordPro or respective content creators.

4. Limitation of Liability
AffordPro shall not be held liable for indirect, incidental, or consequential damages resulting from improper asset usage or third-party platform policy changes (e.g., social media algorithm changes).

5. Modifications to Terms
AffordPro reserves the right to update these terms at any time. Continued use of the platform constitutes acceptance of revised terms.`,
  },

  'refund-policy': {
    slug: 'refund-policy',
    title: 'Refund & Cancellation Policy',
    subtitle: 'Clear, transparent rules regarding digital product refunds and order cancellations.',
    lastUpdated: 'August 2026',
    content: `Thank you for shopping at AffordPro. Please review our Refund & Cancellation policy carefully prior to purchase.

1. Digital Product Nature
Due to the instant, downloadable, and non-returnable nature of digital products (ZIP files, Canva links, vertical video bundles, source code, and online courses), all sales are generally final once access has been delivered.

2. Eligible Refund Conditions
We issue full refunds or product replacements under the following verified conditions:
- Corrupted or Broken Files: If a file is corrupted, unzippable, or broken and our support team is unable to provide a working replacement within 48 hours.
- Duplicate Purchase: If you accidentally purchased the exact same item twice within 24 hours.
- Unauthorized Charge: In cases of proven fraudulent transactions.

3. Non-Refundable Scenarios
- Change of mind after downloading or accessing the source files.
- Lack of required software (e.g., unzipping tools or free Canva account) explicitly listed in product details.

4. How to Request a Refund
To initiate a refund request, email support@affordpro.com within 7 days of purchase with your Order ID and issue details.`,
  },

  'about': {
    slug: 'about',
    title: 'About AffordPro',
    subtitle: 'Empowering digital creators, marketers, and businesses with affordable premium assets.',
    content: `AffordPro was founded with a single mission: to make world-class digital assets, viral video reel bundles, graphic templates, and business automation tools accessible to everyone at truly affordable prices.

Our Mission
We believe that high-quality creative assets shouldn't cost agency-level prices. By working directly with top designers, videographers, and digital strategists, we deliver premium assets with instant downloads and lifetime access.

What Sets Us Apart
- Premium Quality: Battle-tested graphics, 1080x1920 MP4 vertical videos without watermarks, and professionally formatted digital templates.
- Unbeatable Value: Premium assets accessible for a fraction of traditional marketplace rates.
- Instant Fulfillment: 100% automated delivery so you can start creating immediately.`,
  },

  'contact': {
    slug: 'contact',
    title: 'Contact Us',
    subtitle: 'Need help with an order or have a question? Our support team is here for you 24/7.',
    content: `Have a question about a product, order delivery, or partnership? Get in touch with our friendly support team!`,
    email: 'support@affordpro.com',
    phone: '+91 98765 43210',
    address: 'AffordPro Creative Hub, Cyber City, Tech Park, India',
    workingHours: 'Monday – Saturday: 9:00 AM – 8:00 PM IST',
  },

  'faq': {
    slug: 'faq',
    title: 'FAQ & Knowledge Base',
    subtitle: 'Answers to frequently asked questions about orders, licenses, downloads, and payments.',
    content: `Q: How do I access my purchased digital files?
A: Immediately after completing your payment, your download link is sent to your email address and displayed in your Account Dashboard under "My Orders".

Q: Are the video reels watermark-free?
A: Yes! All video reel bundles are 100% watermark-free, high-definition 1080x1920 MP4 files ready for Instagram, TikTok, and YouTube Shorts.

Q: Can I edit the Canva templates on a free Canva account?
A: Yes! All Canva templates work smoothly with both free and Canva Pro accounts.

Q: What payment methods are supported?
A: We support Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Wallet payments via secure SSL encrypted payment gateways.

Q: Can I request an invoice for my business?
A: Yes, automated GST / VAT compliant tax invoices are available in your account dashboard immediately after purchase.`,
  },
};

export const pageService = {
  getPageContent(slug: string): PageContent {
    try {
      const stored = localStorage.getItem(`affordpro_page_${slug}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_PAGES[slug] || {
      slug,
      title: slug.replace('-', ' ').toUpperCase(),
      content: 'Content coming soon.',
    };
  },

  savePageContent(slug: string, content: PageContent): void {
    try {
      localStorage.setItem(`affordpro_page_${slug}`, JSON.stringify(content));
    } catch (e) {
      console.warn('Failed to save page content', e);
    }
  },
};
