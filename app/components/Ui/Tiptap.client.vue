<template>
  <div v-if="editor">
    <div
      v-if="!hideToolbar"
      class="mb-2 flex flex-wrap items-center gap-1 rounded-br-md rounded-bl-md bg-transparent"
    >
      <UiButton
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <Icon name="lucide:bold" class="h-4 w-4" />
      </UiButton>
      <UiButton
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <Icon name="lucide:italic" class="h-4 w-4" />
      </UiButton>

      <UiButton
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }"
      >
        <Icon name="lucide:pilcrow" class="h-4 w-4" />
      </UiButton>
      <UiButton
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        <Icon name="lucide:heading-1" class="h-4 w-4" />
      </UiButton>
      <UiButton
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        <Icon name="lucide:heading-2" class="h-4 w-4" />
      </UiButton>
      <UiButton
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      >
        <Icon name="lucide:heading-3" class="h-4 w-4" />
      </UiButton>
      <UiButton
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
      >
        <Icon name="lucide:heading-4" class="h-4 w-4" />
      </UiButton>
      <UiButton
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        <Icon name="lucide:list" class="h-4 w-4" />
      </UiButton>
      <UiButton
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
      >
        <Icon name="lucide:list-ordered" class="h-4 w-4" />
      </UiButton>
      <UiButton
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        <Icon name="lucide:message-square-quote" class="h-4 w-4" />
      </UiButton>
      <UiButton
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
      >
        <Icon name="lucide:undo-2" class="h-4 w-4" />
      </UiButton>
      <UiButton
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
      >
        <Icon name="lucide:redo-2" class="h-4 w-4" />
      </UiButton>
    </div>
    <EditorContent :editor="editor" class="tiptap" />
  </div>
</template>

<script lang="ts" setup>
  import Blockquote from "@tiptap/extension-blockquote";
  import Bold from "@tiptap/extension-bold";
  import BulletList from "@tiptap/extension-bullet-list";
  import Document from "@tiptap/extension-document";
  import FileHandler from "@tiptap/extension-file-handler";
  import Heading from "@tiptap/extension-heading";
  import Italic from "@tiptap/extension-italic";
  import Link from "@tiptap/extension-link";
  import ListItem from "@tiptap/extension-list-item";
  import OrderedList from "@tiptap/extension-ordered-list";
  import Paragraph from "@tiptap/extension-paragraph";
  import { TextStyle } from "@tiptap/extension-text-style";
  import Underline from "@tiptap/extension-underline";
  import StarterKit from "@tiptap/starter-kit";
  import { EditorContent, useEditor } from "@tiptap/vue-3";

  const model = defineModel<any>({ default: "" });

  const props = withDefaults(
    defineProps<{
      modelType?: "html" | "json";
      hideToolbar?: boolean;
      class?: any;
    }>(),
    {
      modelType: "html",
      hideToolbar: false,
    }
  );

  const editor = useEditor({
    content: model.value,

    editorProps: {
      attributes: {
        class:
          tw`max-h-[650px] min-h-[150px] w-full overflow-auto rounded-md  border  border-input bg-white px-3 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50` as any,
      },
    },
    onUpdate(val) {
      if (props.modelType === "html") {
        model.value = val.editor.getHTML();
      } else if (props.modelType === "json") {
        // emit a plain JSON object instead of a string
        model.value = val.editor.getJSON();
      }
    },
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      StarterKit,
      FileHandler.configure({
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif"],
        onPaste: (currentEditor, files) => {
          files.forEach((file) => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
      }),
    ],
  });
</script>

<style>
  @reference "tailwindcss";

  .tiptap p {
    @apply my-2 text-base leading-normal first:mt-0 last:mb-0;
  }
  .tiptap h1 {
    @apply mt-4 mb-2 text-2xl font-bold first:mt-0 last:mb-0;
  }
  .tiptap h2 {
    @apply mt-3 mb-2 text-xl font-semibold first:mt-0 last:mb-0;
  }
  .tiptap h3 {
    @apply mt-3 mb-2 text-lg font-semibold first:mt-0 last:mb-0;
  }
  .tiptap h4 {
    @apply mt-2.5 mb-1.5 text-base font-semibold first:mt-0 last:mb-0;
  }
  .tiptap h5 {
    @apply mt-2 mb-1 text-sm font-semibold first:mt-0 last:mb-0;
  }
  .tiptap h6 {
    @apply mt-2 mb-1 text-xs font-semibold first:mt-0 last:mb-0;
  }
  .tiptap a {
    @apply text-blue-600 underline;
  }
  .tiptap ul {
    @apply my-4 list-disc pl-6;
  }
  .tiptap ol {
    @apply my-4 list-decimal pl-6;
  }
</style>
