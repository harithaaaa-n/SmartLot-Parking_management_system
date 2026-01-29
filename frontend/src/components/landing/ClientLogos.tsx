import React from "react";
import { motion } from "framer-motion";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

// Animation variants (copied locally for modularity)
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const ClientLogos: React.FC = () => {
  return (
    <section id="clients" className="w-full py-12 md:py-16 lg:py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container px-4 md:px-6 border border-muted rounded-3xl bg-muted/20"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
            >
              Trusted by
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Our Clients
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              We've had the pleasure of working with some amazing companies
            </motion.p>
          </div>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto grid grid-cols-2 items-center gap-3 py-8 md:grid-cols-3 lg:grid-cols-6"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              variants={itemFadeIn}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center"
            >
              <div className="rounded-3xl border p-6 bg-background/80 hover:shadow-md transition-all">
                <img
                  src={PLACEHOLDER_IMAGE}
                  alt={`Client Logo ${i + 1}`}
                  width={160}
                  height={80}
                  className="h-20 w-40 object-contain grayscale transition-all hover:grayscale-0"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ClientLogos;