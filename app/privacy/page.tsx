import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-tertiary hover:text-foreground mb-8 inline-block">← Back to home</Link>
        
        <h1 className="text-4xl font-semibold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-foreground space-y-6">
          <p className="text-tertiary">Last updated: January 1, 2024</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly, such as when you create an account, use our services, or contact us for support. This includes your name, email address, and any files you process.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, process your requests, and send you important updates about your account.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. File Processing</h2>
          <p><strong>Your files are processed locally in your browser.</strong> We do not upload your files to our servers unless you explicitly request support or troubleshooting. Files are never stored permanently on our systems.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Cookies</h2>
          <p>We use cookies to remember your preferences and analyze site traffic. You can control cookie preferences through your browser settings.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. Contact us at privacy@zenvixy.com for any privacy-related requests.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. Changes to This Policy</h2>
          <p>We may update this policy periodically. We will notify you of any material changes via email or prominent notice on our website.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at privacy@zenvixy.com.</p>
        </div>
      </div>
    </div>
  );
}
