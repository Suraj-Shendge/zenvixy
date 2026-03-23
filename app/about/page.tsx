import Link from "next/link";
import { Zap, Target, Users, Heart, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm text-tertiary hover:text-foreground mb-8 inline-block">← Back to home</Link>
        
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground mb-4">About Zenvixy</h1>
          <p className="text-xl text-tertiary max-w-2xl mx-auto">We believe powerful tools should be simple, fast, and accessible to everyone.</p>
        </div>

        <div className="prose prose-lg max-w-none mb-16">
          <p className="text-foreground leading-relaxed mb-6">
            Zenvixy was born from a simple frustration: why do everyday tasks like compressing a PDF or resizing an image require downloading bloated apps or enduring endless ads?
          </p>
          <p className="text-foreground leading-relaxed mb-6">
            We set out to build something different — a collection of tools that work beautifully, load instantly, and respect your privacy. No sign-ups, no watermarks, no nonsense.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Target, title: "Our Mission", desc: "Make powerful tools accessible to everyone, everywhere." },
            { icon: Users, title: "Our Vision", desc: "A world where technology simplifies life, not complicates it." },
            { icon: Heart, title: "Our Values", desc: "Privacy first, speed always, design with care." },
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-tertiary">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-accent to-premium rounded-3xl p-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
          <p className="text-white/80 mb-6">Join thousands of users who trust Zenvixy every day.</p>
          <Link href="/compress-pdf" className="inline-flex items-center gap-2 bg-white text-accent px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors">
            Try it free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
