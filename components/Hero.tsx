'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Button } from './ui/Button';
import { useRef } from 'react';

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div className="relative h-[90vh] w-full overflow-hidden bg-black text-white" ref={ref}>
            {/* Background Parallax */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                <div className="relative h-full w-full bg-gradient-to-b from-black/60 to-black/30">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black" />

                    {/* Abstract animated shapes */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-8 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4"
                >
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-sm font-semibold uppercase tracking-[0.2em] text-gold"
                    >
                        New Collection
                    </motion.h2>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
                    >
                        Masasa
                        <br />
                        Aesthetics
                    </motion.h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mx-auto max-w-2xl text-lg text-gray-300 sm:text-xl md:text-2xl font-light"
                >
                    Elevate your device with our premium, custom-designed phone cases.
                    <br className="hidden sm:inline" /> Designed for those who appreciate art.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link href="/products">
                        <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg">
                            Shop Collection
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-1 h-12 rounded-full bg-gradient-to-b from-transparent via-white/50 to-transparent"
                />
            </motion.div>
        </div>
    );
}
