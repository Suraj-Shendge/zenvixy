import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-tertiary hover:text-foreground mb-8 inline-block">← Back to home</Link>
        
        <h1 className="text-4xl font-semibold text-foreground mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none text-foreground space-y-6">
          <p className="text-tertiary">Last updated: January 1, 2024</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using Zenvixy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h2>
          <p>Zenvixy provides free and premium web-based tools for file processing, including but not limited to PDF compression, image resizing, and AI-powered features. Our tools are provided "as is."</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. User Accounts</h2>
          <p>Some features require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use our services for any illegal purposes</li>
            <li>Attempt to gain unauthorized access</li>
            <li>Reverse engineer or decompile our tools</li>
            <li>Overload or disrupt our services</li>
            <li>Upload malicious content or viruses</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Intellectual Property</h2>
          <p>The service, including all content, features, and functionality, is owned by Zenvixy and is protected by copyright, trademark, and other intellectual property laws.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Payment & Subscriptions</h2>
          <p>Premium subscriptions are billed monthly or annually. You can cancel your subscription at any time. Refunds are provided within 7 days of purchase if you're unsatisfied.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. Limitation of Liability</h2>
          <p>Zenvixy shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">9. Governing Law</h2>
          <p>These Terms shall be governed by the laws of India, without regard to its conflict of law provisions.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">10. Contact</h2>
          <p>Questions about these Terms? Contact us at legal@zenvixy.com.</p>
        </div>
      </div>
    </div>
  );
}
