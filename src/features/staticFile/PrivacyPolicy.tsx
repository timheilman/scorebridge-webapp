import React from "react";
import ReactMarkdown from "react-markdown";

const markdownContent = `# ScoreBridge Privacy Policy

Last Updated: September 11, 2023

Thank you for using ScoreBridge, a hobbyist software project developed with a strong commitment to user privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you use ScoreBridge. By using ScoreBridge, you consent to the practices described in this Privacy Policy.

## 1. Information We Collect
   Both duplicate bridge club admins and duplicate bridge players may interact with this software system as a whole (webapp and device app).  Some personally identifiable information (PII) may be collected in this software system, including but not limited to your name, email, and ACBL number (if available), to improve the usefulness of the software system.  ScoreBridge is designed to respect your privacy, and only stores your personal data for the purposes described below.

## 2. How We Use Your Information
  We only use your information for the purpose of facilitating duplicate bridge scoring and to communicate important updates to the software system.  It will not be used for any other purpose. Our primary goal is to provide you with a useful and enjoyable experience while using ScoreBridge.

## 3. Cookies and Tracking
   ScoreBridge does not use cookies or any tracking technologies to collect information about your online activities.

## 4. Data Security
   Your data security is essential to us. We take reasonable precautions to protect the information you provide to us. However, please understand that no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee the absolute security of your data, but we do our best to protect it, including from other club admins and their clubs' players.

## 5. Third-Party Services
   ScoreBridge may in the future contain links or integrations to third-party services, such as social media platforms or other websites. Please note that this Privacy Policy applies solely to ScoreBridge, and we have no control over the privacy practices or content of these third-party services. We recommend reviewing the privacy policies of any third-party services you may access through ScoreBridge.

## 6. Children's Privacy
   ScoreBridge is not intended for use by children under the age of 13. We do not knowingly collect any information from children under 13. If you believe that we have inadvertently collected personal information from a child under 13, please contact us, and we will promptly take appropriate action to delete the data.

## 7. Changes to this Privacy Policy
   We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any changes will be posted on this page, and the date of the last update will be revised accordingly. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.

## 8. Contact Us
   If you have any questions, concerns, or requests regarding this Privacy Policy or ScoreBridge's privacy practices, please contact us at scorebridge8@gmail.com.

Thank you for choosing ScoreBridge, and we appreciate your trust in our commitment to your privacy.`;

const PrivacyPolicy = () => {
  return (
    <div className="markdown-container">
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default PrivacyPolicy;
