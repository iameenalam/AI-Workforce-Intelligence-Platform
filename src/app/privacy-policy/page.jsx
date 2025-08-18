import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Protecting your privacy is our priority
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Our Commitment to Your Privacy
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="prose max-w-none">
              <p className="mb-4">
                Protecting your privacy and keeping your Personal Information safe is very important to us. 
                This Privacy Policy describes how we handle the Personal Information provided to us, or otherwise 
                collected by us, including through our website (the "Site") or in connection with our software 
                as a service application and platforms.
              </p>

              <div className="my-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h3>
                <ul className="space-y-2">
                  <li><a href="#a1" className="text-indigo-600 hover:text-indigo-800">1. Understanding Our Role</a></li>
                  <li><a href="#a2" className="text-indigo-600 hover:text-indigo-800">2. Types of Personal Information We Collect</a></li>
                  <li><a href="#a3" className="text-indigo-600 hover:text-indigo-800">3. How We Use Your Information</a></li>
                  <li><a href="#a4" className="text-indigo-600 hover:text-indigo-800">4. Data Sharing and Disclosure</a></li>
                  <li><a href="#a5" className="text-indigo-600 hover:text-indigo-800">5. International Data Transfer</a></li>
                  <li><a href="#a6" className="text-indigo-600 hover:text-indigo-800">6. Your Privacy Rights</a></li>
                  <li><a href="#a7" className="text-indigo-600 hover:text-indigo-800">7. Protecting Your Personal Information</a></li>
                  <li><a href="#a8" className="text-indigo-600 hover:text-indigo-800">8. Data Retention</a></li>
                  <li><a href="#a9" className="text-indigo-600 hover:text-indigo-800">9. Use of Cookies</a></li>
                  <li><a href="#a10" className="text-indigo-600 hover:text-indigo-800">10. Children's Privacy</a></li>
                  <li><a href="#a11" className="text-indigo-600 hover:text-indigo-800">11. Modifications to This Policy</a></li>
                  <li><a href="#a12" className="text-indigo-600 hover:text-indigo-800">12. How to Contact Us</a></li>
                </ul>
              </div>

              <section id="a1" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Understanding Our Role: Data Controller vs Data Processor</h3>
                <p className="mb-4">
                  When it comes to your personal information, ReeOrg may act in one of two roles: as a Data Controller or as a Data Processor.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">When ReeOrg is a Data Controller</h4>
                  <p className="mb-4">
                    When ReeOrg acts as a Data Controller, it means we are responsible for deciding how and why your Personal Information is collected and used. This typically happens in situations where you provide your information directly to us.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">When ReeOrg is a Data Processor</h4>
                  <p>
                    In many cases, ReeOrg acts as a Data Processor. This happens when we process your Personal Information on behalf of one of our customers, who is the Data Controller.
                  </p>
                </div>
              </section>

              <section id="a2" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Types of Personal Information We Collect</h3>
                <p className="mb-4">
                  The types of Personal Information we may collect about you include:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Information you provide directly to us</li>
                  <li>Information collected via our customers</li>
                  <li>Information collected through automated means</li>
                  <li>Information collected from third-party sources</li>
                </ul>
              </section>

              <section id="a3" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h3>
                <p className="mb-4">
                  ReeOrg may collect, hold, use and disclose your Personal Information for various purposes including:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>To enable you to access and use our Site</li>
                  <li>To provide product and services information at your request</li>
                  <li>To provide our Software Solution to our customers</li>
                  <li>To respond to your requests, inquiries, comments, and suggestions</li>
                  <li>For internal record keeping and administrative purposes</li>
                </ul>
              </section>

              <section id="a4" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h3>
                <p className="mb-4">
                  We may share Personal Information about you with certain third parties in specific circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>With vendors, consultants, and other service providers</li>
                  <li>With digital marketing agents conducting marketing on our behalf</li>
                  <li>In connection with mergers, acquisitions, or asset sales</li>
                  <li>When necessary to comply with legal obligations</li>
                  <li>With third parties with your consent</li>
                </ul>
              </section>

              <section id="a5" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">5. International Data Transfer</h3>
                <p className="mb-4">
                  Personal Information we collect may be stored and processed in various countries where we have operations or engage service providers. These countries may not have the same data protection laws as the country in which you originally provided the data.
                </p>
              </section>

              <section id="a6" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h3>
                <p className="mb-4">
                  Depending on your jurisdiction, you may have certain rights regarding your Personal Information:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Right to Know/Access your information</li>
                  <li>Right to Correct inaccurate information</li>
                  <li>Right to Delete/Be Forgotten</li>
                  <li>Right to Restrict Cookies/Do Not Track</li>
                  <li>Right to Complain to authorities</li>
                  <li>Right to Opt Out/Unsubscribe from marketing</li>
                </ul>
              </section>

              <section id="a7" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">7. Protecting Your Personal Information</h3>
                <p className="mb-4">
                  ReeOrg has implemented security controls and procedures for protecting your Personal Information from misuse, interference, unauthorized access, modification, or disclosure.
                </p>
              </section>

              <section id="a8" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h3>
                <p className="mb-4">
                  We only keep your Personal Information for so long as reasonably necessary for the purposes described in this Privacy Policy, as required by law, or as necessary to resolve disputes and enforce our rights and agreements.
                </p>
              </section>

              <section id="a9" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">9. Use of Cookies</h3>
                <p className="mb-4">
                  Our Site uses cookies to help personalize your online experience. You can configure most browsers to reject cookies or to notify you when you are sent a cookie.
                </p>
              </section>

              <section id="a10" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h3>
                <p className="mb-4">
                  Our Services are intended for adults, and we do not knowingly collect Personal Information from children under 13.
                </p>
              </section>

              <section id="a11" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications to This Policy</h3>
                <p className="mb-4">
                  We may modify this Privacy Policy from time to time. The most current version will govern our collection, use, and disclosure of information about you.
                </p>
              </section>

              <section id="a12" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">12. How to Contact Us</h3>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="bg-gray-50 p-4 rounded-lg inline-block">
                  <a href="mailto:contact@reeorg.com" className="text-indigo-600 hover:text-indigo-800">
                    contact@reeorg.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
