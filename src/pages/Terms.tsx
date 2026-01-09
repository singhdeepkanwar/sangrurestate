import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Terms & Conditions
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              <strong className="text-foreground">Last Updated:</strong> January 2025
            </p>

            <p>
              Welcome to SangrurEstate, a project under <strong className="text-foreground">Shree Ananta Consultancy and Solutions LLP</strong> (MakeBetter Technologies). 
              By accessing and using our website, you agree to be bound by these Terms and Conditions.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
            <p>
              By using SangrurEstate, you acknowledge that you have read, understood, and agree to be bound by these 
              Terms and Conditions. If you do not agree, please do not use our services.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">2. Services</h2>
            <p>SangrurEstate provides:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Property listing services for houses, plots, and commercial properties in Sangrur</li>
              <li>Platform for connecting property buyers and sellers</li>
              <li>Property inquiry and site visit scheduling services</li>
              <li>Verified property listings</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must be at least 18 years old to use our services</li>
              <li>One person may not maintain multiple accounts</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">4. Property Listings</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sellers must provide accurate property information</li>
              <li>SangrurEstate reserves the right to verify and approve listings</li>
              <li>We may remove listings that violate our policies or contain false information</li>
              <li>Listed prices are indicative and subject to negotiation between parties</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">5. User Conduct</h2>
            <p>Users agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post false, misleading, or fraudulent listings</li>
              <li>Use the platform for illegal activities</li>
              <li>Harass or abuse other users</li>
              <li>Attempt to access others' accounts or data</li>
              <li>Interfere with the proper functioning of the website</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">6. Intellectual Property</h2>
            <p>
              All content on SangrurEstate, including logos, text, images, and software, is owned by 
              Shree Ananta Consultancy and Solutions LLP and protected by intellectual property laws. 
              Unauthorized use is prohibited.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">7. Disclaimer</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>SangrurEstate is a platform connecting buyers and sellers. We do not guarantee any transaction outcomes.</li>
              <li>We are not responsible for the accuracy of user-submitted property information.</li>
              <li>Users should conduct their own due diligence before any property transaction.</li>
              <li>Property verification is based on available information and does not constitute legal verification.</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">8. Limitation of Liability</h2>
            <p>
              SangrurEstate and Shree Ananta Consultancy and Solutions LLP shall not be liable for any direct, 
              indirect, incidental, or consequential damages arising from the use of our services.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless SangrurEstate and its affiliates from any claims, 
              damages, or expenses arising from your use of the platform or violation of these terms.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">10. Modifications</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Continued use of the 
              platform after changes constitutes acceptance of the modified terms.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">11. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by the laws of India. Any disputes shall be subject 
              to the exclusive jurisdiction of courts in Sangrur, Punjab.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8">12. Contact</h2>
            <p>
              For questions about these Terms and Conditions, contact us at:
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

export default Terms;