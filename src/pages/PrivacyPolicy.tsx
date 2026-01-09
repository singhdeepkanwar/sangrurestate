import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              <strong className="text-foreground">Last Updated:</strong> January 2025
            </p>

            <p>
              SangrurEstate, a project under <strong className="text-foreground">Shree Ananta Consultancy and Solutions LLP</strong> (MakeBetter Technologies), 
              is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information 
              when you use our website and services.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Personal Information:</strong> Name, phone number, email address, and physical address when you register or submit inquiries.</li>
              <li><strong className="text-foreground">Property Information:</strong> Details about properties you list or inquire about.</li>
              <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our website, including pages visited and features used.</li>
              <li><strong className="text-foreground">Device Information:</strong> Browser type, IP address, and device identifiers.</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Facilitate property listings and buyer-seller connections</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send property-related updates and notifications</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Property owners/buyers when you express interest in a listing</li>
              <li>Service providers who assist in operating our platform</li>
              <li>Legal authorities when required by law</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">6. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your browsing experience. 
              You can control cookie settings through your browser preferences.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy 
              practices of these external sites.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page 
              with an updated revision date.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="font-medium text-foreground">
              Email: info@sangrurestate.com<br />
              Phone: +91 98765 43210<br />
              Address: Main Market, Sangrur, Punjab, India - 148001
            </p>

            <div className="mt-12 p-6 bg-secondary rounded-xl">
              <p className="text-sm">
                <strong className="text-foreground">SangrurEstate</strong> is a project under 
                <strong className="text-foreground"> Shree Ananta Consultancy and Solutions LLP</strong> (MakeBetter Technologies). 
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;