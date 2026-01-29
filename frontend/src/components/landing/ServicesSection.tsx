import React from "react";
import { motion } from "framer-motion";
import { Palette, Code, Sparkles, Zap, LineChart, MessageSquare, ArrowRight } from "lucide-react";

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

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "We create intuitive, engaging user experiences that delight your customers and drive conversions.",
  },
  {
    icon: Code,
    title: "Web Development",
    description:
      "Our developers build fast, responsive, and accessible websites that work across all devices.",
  },
  {
    icon: Sparkles,
    title: "Brand Identity",
    description:
      "We craft distinctive brand identities that communicate your values and resonate with your audience.",
  },
  {
    icon: Zap,
    title: "Mobile Apps",
    description: "We design and develop native and cross-platform mobile applications that users love.",
  },
  {
    icon: LineChart,
    title: "Digital Marketing",
    description:
      "We help you reach your target audience and grow your business with data-driven marketing strategies.",
  },
  {
    icon: MessageSquare,
    title: "Content Creation",
    description: "We produce engaging content that tells your story and connects with your customers.",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container px-4 md:px-6 border border-muted rounded-3xl"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
            >
              Services
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              What We Do
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              We offer a comprehensive range of design and development services to help your business thrive
            </motion.p>
          </div>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto grid max-w-5xl items-center gap-3 py-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemFadeIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md bg-background/80"
            >
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"></div>
              <div className="relative space-y-3">
                <div className="mb-4">
                    <service.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <a href="#" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  Learn more
                </a>
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;