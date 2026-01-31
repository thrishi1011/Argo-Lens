import { motion } from 'framer-motion';
import { Leaf, ArrowRight, Satellite, Cpu, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Floating Logo */}
      <motion.div
        className="mb-8"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative">
          <motion.div
            className="text-7xl text-primary drop-shadow-[0_0_30px_hsl(var(--glow-primary))]"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1, delay: 0.2 }}
          >
            <Leaf className="h-24 w-24 mx-auto" strokeWidth={1.5} />
          </motion.div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="mb-4 text-5xl font-black tracking-wider md:text-6xl lg:text-7xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <span className="gradient-text">ARGO LENS</span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <span className="font-semibold text-accent">AI-powered</span> crop
        monitoring and pest prediction platform that helps farmers maximize
        yield through real-time analytics and intelligent insights.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        <Button
          variant="hero"
          size="xl"
          onClick={onGetStarted}
          className="relative z-10"
        >
          <span className="tracking-wide">GET STARTED</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>

      {/* Features bar */}
      <motion.div
        className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="flex items-center gap-2">
          <Satellite className="h-4 w-4 text-primary" />
          <span>Satellite Imagery Analysis</span>
        </div>
        <div className="hidden h-4 w-px bg-border md:block" />
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-secondary" />
          <span>IoT Sensor Integration</span>
        </div>
        <div className="hidden h-4 w-px bg-border md:block" />
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-accent" />
          <span>AI-Powered Predictions</span>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
