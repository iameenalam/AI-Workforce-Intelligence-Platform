import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Terms of Use
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Please read these terms carefully before using our website
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Legal Agreement Between You and ReeOrg
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="prose max-w-none">
              <p className="mb-4">
                This website (Site) is operated by ReeOrg (we, our or us). By accessing and/or using our Site, 
                you agree to these terms of use and our Privacy Policy (Terms). We may vary these terms from time 
                to time by publishing an updated version on our Site. We recommend that you check these Terms 
                regularly to ensure that you are aware of any changes as materials and information on this Site 
                are subject to change without notice.
              </p>

              <section id="general-restrictions" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">General Restrictions</h3>
                <p className="mb-4">
                  In using this Site, you must not:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>violate any applicable laws;</li>
                  <li>do anything that would constitute a breach of an individual's privacy or other legal rights;</li>
                  <li>distribute viruses, corrupted files or any other software or program that may damage, modify, tamper with, or interfere with our Site;</li>
                  <li>use our Site to send unsolicited email messages; or</li>
                  <li>facilitate or assist a third party to do any of the above acts.</li>
                </ul>
              </section>

              <section id="general-information" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">General Information</h3>
                <p className="mb-4">
                  The Content on this Site is not comprehensive and is for general information purposes only. It does not take into account your specific needs, objectives and circumstances, and it is not advice. While we use reasonable attempts to ensure the accuracy and completeness of the Content, we make no representation or warranty in relation to it, to the maximum extent permitted by law.
                </p>
              </section>

              <section id="license" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">License to use the Site</h3>
                <p className="mb-4">
                  We grant you a non-exclusive, royalty-free, revocable, worldwide, non-transferable license to use our Site in accordance with these Terms. All other uses are prohibited without our prior written consent.
                </p>
              </section>

              <section id="ip-rights" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h3>
                <p className="mb-4">
                  Unless otherwise stated, we own or license all rights, title and interest (including intellectual property rights) in our Site and all of the Content. Your use of our Site and any of the Content does not grant or transfer to you any rights, title or interest them. You must not:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>copy or use, in whole or in part, any Content;</li>
                  <li>reproduce, distribute, disseminate, sell, publish, broadcast or circulate any Content to any third party; or</li>
                  <li>breach any intellectual property rights connected with our Site or the Content, including (without limitation) altering or modifying any of the Content, causing any of the content to be framed or embedded in another website or platform, or create derivative works from the Content.</li>
                </ul>
              </section>

              <section id="third-party-links" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Links to Third Parties</h3>
                <p className="mb-4">
                  Our Site may contain links to websites operated by third parties. Unless expressly stated otherwise, we do not control, endorse or approve, and are not responsible for, the content on those websites. You should make your own investigations with respect to the suitability of those websites.
                </p>
              </section>

              <section id="indemnity" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Indemnity</h3>
                <p className="mb-4">
                  To the maximum extent permitted by law, you must indemnify us, and hold us harmless, against any Liability suffered or incurred by us arising from or in connection with your use of our Site or any breach of these Terms or any applicable laws by you. This indemnity is a continuing obligation, independent from the other obligations under these Terms, and continues after these Terms end. It is not necessary for us to suffer or incur any Liability before enforcing a right of indemnity under these Terms.
                </p>
              </section>

              <section id="liability" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h3>
                <p className="mb-4">
                  To the maximum extent permitted by law, we are not responsible for any loss, damage or expense, whether directly or indirectly suffered by you or any third party, arising from or in connection with your use of our Site and/or the Content, including if the Content is incorrect, incomplete or out-of-date.
                </p>
              </section>

              <section id="general" className="my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">General</h3>
                <p className="mb-4">
                  If a provision of these Terms is held to be unenforceable, that provision must be read down as narrowly as necessary to allow it to be valid or enforceable. If it is not possible to read down (in whole or in part) a provision, that provision (or that part of that provision) shall be severed without affecting the validity or enforceability of the remainder of that provision or the rest of these Terms. These Terms are effective until terminated by us, which we may do at any time and without notice to you. In the event of termination, all restrictions imposed on you by these Terms and limitations of liability set out in these Terms will survive. Your use of our Site and these Terms are governed by the laws of New South Wales, Australia, and you irrevocably submit to the exclusive jurisdiction of the courts of New South Wales, Australia.
                </p>
              </section>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  If you have any questions about these Terms, please contact us at{" "}
                  <a href="mailto:contact@reeorg.com" className="text-indigo-600 hover:text-indigo-800">
                    contact@reeorg.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
