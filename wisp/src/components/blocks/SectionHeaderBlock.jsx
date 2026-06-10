import SectionHeader from "@/components/SectionHeader";

export default function SectionHeaderBlock({ anchor, header }) {
  return (
    <section
      id={anchor || undefined}
      className="px-6 py-12 sm:py-16 max-w-5xl mx-auto w-full scroll-mt-20"
    >
      <SectionHeader value={header} />
    </section>
  );
}
