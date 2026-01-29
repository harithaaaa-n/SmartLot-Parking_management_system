import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Animation variants (copied locally for modularity)
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container grid items-center gap-3 px-4 md:px-6 lg:grid-cols-2 border border-muted rounded-3xl"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-3 p-6"
        >
          <div className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm">Contact</div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Let's Work Together</h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Ready to start your next project? Get in touch with us to discuss how we can help bring your vision to
            life.
          </p>
          <div className="mt-8 space-y-4">
            <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
              <div className="rounded-3xl bg-muted p-2">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Our Location</h3>
                <p className="text-sm text-muted-foreground">123 Design Street, Creative City, 10001</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
              <div className="rounded-3xl bg-muted p-2">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Email Us</h3>
                <p className="text-sm text-muted-foreground">hello@designstudio.com</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
              <div className="rounded-3xl bg-muted p-2">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Call Us</h3>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </motion.div>
          </div>
          <div className="mt-8 flex space-x-3">
            {[
              { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
              { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
              { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
              { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
            ].map((social, index) => (
              <motion.div key={index} whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <a
                  href="#"
                  className="rounded-3xl border p-2 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                >
                  {social.icon}
                  <span className="sr-only">{social.label}</span>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border bg-background p-6 shadow-sm"
        >
          <h3 className="text-xl font-bold">Send Us a Message</h3>
          <p className="text-sm text-muted-foreground">
            Fill out the form below and we'll get back to you shortly.
          </p>
          <form className="mt-6 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="first-name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  First name
                </label>
                <Input id="first-name" placeholder="Enter your first name" className="rounded-3xl" />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="last-name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Last name
                </label>
                <Input id="last-name" placeholder="Enter your last name" className="rounded-3xl" />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <Input id="email" type="email" placeholder="Enter your email" className="rounded-3xl" />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Message
              </label>
              <Textarea id="message" placeholder="Enter your message" className="min-h-[120px] rounded-3xl" />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full rounded-3xl">
                Send Message
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContactSection;