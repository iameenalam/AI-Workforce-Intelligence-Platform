import AuthHydrator from "./AuthHydrator";
import "./globals.css";
import ProviderRedux from "./providers/provider";
import GoogleProvider from "./providers/GoogleProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "ReeOrg – Business & Workforce Intelligence for the Post-AI Era",
  description:
    "ReeOrg empowers HR leaders with real-time org visualization, risk identification, and workforce design. Stay ahead of transformation and AI disruption with dynamic business and workforce intelligence.",
  keywords: [
    "ReeOrg",
    "Workforce Intelligence",
    "Org Design",
    "HR Analytics",
    "AI Disruption HR",
    "Talent Strategy",
    "CHRO Tools",
    "HRBP",
    "Future of Work",
    "Organizational Visualization",
    "Skills Mapping",
    "Attrition Risk",
    "Upskilling",
    "Business Transformation",
  ],
};

export default function RootLayout({ children }) {
  const googleClientId = process.env.GOOGLE_ID;

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
      </head>
      <body>
        <ProviderRedux>
          <GoogleProvider clientId={googleClientId}>
            <AuthHydrator />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#fff",
                  color: "#1f2937",
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                },
                duration: 4000,
              }}
            />
            {children}
          </GoogleProvider>
        </ProviderRedux>
      </body>
    </html>
  );
}
