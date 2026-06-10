import NewsletterForm from "@/components/NewsletterForm";
import SectionHeader from "@/components/SectionHeader";
import Buttons from "@/components/Buttons";

export default function NewsletterBlock({
  anchor,
  header,
  buttonLabel,
  placeholder,
  successMessage,
  ctaButtons,
  ctaButtonsAlign,
}) {
  return (
    <section
      id={anchor || undefined}
      className="px-6 py-12 sm:py-16 max-w-5xl mx-auto w-full scroll-mt-20"
    >
      {header && (
        <div className="mb-6">
          <SectionHeader value={header} />
        </div>
      )}

      <NewsletterForm
        buttonLabel={buttonLabel}
        placeholder={placeholder}
        successMessage={successMessage}
      />

      {ctaButtons?.length > 0 && (
        <Buttons
          items={ctaButtons}
          align={ctaButtonsAlign || "center"}
          className="mt-8"
        />
      )}
    </section>
  );
}
