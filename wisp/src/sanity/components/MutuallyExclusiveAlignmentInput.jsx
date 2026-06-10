import { useEffect, useRef } from "react";
import { PortableTextInput } from "sanity";
import { PortableTextEditor } from "@portabletext/editor";

// The three alignment decorator values we register on the textBlock body.
// Kept in sync with the decorators in textBlock.js.
const ALIGN_VALUES = ["align-left", "align-center", "align-right"];

// Wraps the default Portable Text input to enforce single-select behavior
// for the alignment decorators. When a span ends up with multiple alignment
// marks (because the user toggled a second alignment on top of an existing
// one), this finds the newly-added one and uses the editor's own toggleMark
// API to remove the others.
//
// Why toggleMark instead of patching the document directly: the editor keeps
// its own internal Slate state and uses that to render the toolbar's active-
// button highlights. Directly setting a new value patches the document but
// leaves Slate state out of sync — buttons keep showing as active for marks
// that are no longer on the document. toggleMark goes through the editor's
// own machinery and keeps everything in sync.
export function MutuallyExclusiveAlignmentInput(props) {
  const { value } = props;
  const editorRef = useRef(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !Array.isArray(value)) {
      prevValueRef.current = value;
      return;
    }

    // Find a span (anywhere in the body) that has multiple alignment marks.
    // We only handle one conflict per change cycle — the user toggles one
    // button at a time, so there should only ever be one offending span.
    const prevValue = Array.isArray(prevValueRef.current)
      ? prevValueRef.current
      : null;
    let marksToRemove = null;

    outer: for (const block of value) {
      if (block?._type !== "block" || !Array.isArray(block.children)) continue;
      const prevBlock = prevValue?.find((b) => b?._key === block._key);
      for (const span of block.children) {
        if (span?._type !== "span") continue;
        const marks = span.marks || [];
        const aligns = marks.filter((m) => ALIGN_VALUES.includes(m));
        if (aligns.length <= 1) continue;

        // Figure out which one was just added (compared to prev value) and
        // schedule the others for removal.
        const prevSpan = prevBlock?.children?.find(
          (s) => s?._key === span._key,
        );
        const prevAligns =
          prevSpan?._type === "span"
            ? (prevSpan.marks || []).filter((m) => ALIGN_VALUES.includes(m))
            : [];
        const newlyAdded =
          aligns.find((a) => !prevAligns.includes(a)) ??
          aligns[aligns.length - 1];
        marksToRemove = aligns.filter((a) => a !== newlyAdded);
        break outer;
      }
    }

    prevValueRef.current = value;

    if (marksToRemove && marksToRemove.length > 0) {
      // Editor selection at this moment is the selection the user just
      // applied the new mark to — exactly the range we want to toggle off
      // the old marks from.
      marksToRemove.forEach((mark) => {
        try {
          PortableTextEditor.toggleMark(editor, mark);
        } catch {
          // The editor may not be ready; swallow and let the next change
          // cycle try again.
        }
      });
    }
  }, [value]);

  return <PortableTextInput {...props} editorRef={editorRef} />;
}
