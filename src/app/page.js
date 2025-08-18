import ContactSection from "./components/ContactSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import OrgDesignSection from "./components/OrgDesignSection";
import SkillsSection from "./components/SkillsSection";
import { PostHogProvider } from './providers/PostHogProvider'

export default function Home() {
  return (
    <>
    <PostHogProvider>
      <Navbar />
      <HeroSection />
      <OrgDesignSection />
      <FeaturesSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
    </PostHogProvider>
    </>
  );
}
