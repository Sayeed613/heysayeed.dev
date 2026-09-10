"use client";

import "./footer-02.css";
import { Section21Footer } from "@/components/originkit/ui/footer-02/section-21-footer";
import type { LegalDoc } from "@/components/LegalModal";

interface Footer02Props {
  onOpenDoc?: (doc: LegalDoc) => void;
}

const Footer02 = ({ onOpenDoc }: Footer02Props) => (
  <Section21Footer onOpenDoc={onOpenDoc} />
);

export default Footer02;