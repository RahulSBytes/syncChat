import { useEffect } from "react";

function useMeta({ title="SynqChat", description="The seamless chat app" }) {
  useEffect(() => {
    if (title) {
      document.title = "SynqChat - "+ title;
    }

    if (description) {
      let meta = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);
}

export default useMeta;
