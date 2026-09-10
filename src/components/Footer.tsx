import { useState } from "react";
import Footer02 from "./originkit/footer-02";
import LegalModal, { type LegalDoc } from "./LegalModal";

/**
 * Footer — originkit footer-02 section, dark-themed to match the site.
 * The Legal column links open Privacy Notice / License / Terms & Conditions
 * as popups (see src/components/LegalModal.tsx).
 */
export default function Footer() {
  const [doc, setDoc] = useState<LegalDoc | null>(null);

  return (
    <>
      <Footer02 onOpenDoc={setDoc} />
      <LegalModal doc={doc} onClose={() => setDoc(null)} />
    </>
  );
}