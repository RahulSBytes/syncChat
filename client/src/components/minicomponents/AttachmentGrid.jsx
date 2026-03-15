import {
  X,
  Play,
  Pause,
  Download,
  FileText,
  File,
  Eye,
  Music,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { textFiles } from "../constants/constants";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

function AttachmentGrid({ attachments, handleContextMenu, _id, userId }) {
  const [viewAll, setViewAll] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [mediaPopup, setMediaPopup] = useState(null);
  const audioRefs = useRef({});
  const videoRef = useRef(null);

  if (!attachments || attachments.length === 0) return null;

  const attachmentsForUser = attachments.filter(
    (att) => !(att.deletedFor || []).includes(userId)
  );

  // ---- utility helpers ----
  const formatFileSize = (size) => {
    if (!size) return "";
    if (typeof size === "string") return size;
    const sizeInMB = (size / (1024 * 1024)).toFixed(2);
    return `${sizeInMB} MB`;
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "raw":
        return <FileText size={20} />;
      case "audio":
        return <Music size={20} />;
      default:
        return <File size={20} />;
    }
  };

  const handleAudioPlay = async (attachment, e) => {
    e?.stopPropagation();
    const audioId = attachment.public_id;
    const currentAudio = audioRefs.current[audioId];
    if (playingAudio === audioId && currentAudio) {
      currentAudio.pause();
      setPlayingAudio(null);
    } else {
      Object.values(audioRefs.current).forEach((a) => a && a.pause());
      const audio = currentAudio || new Audio(attachment.url);
      audioRefs.current[audioId] = audio;
      audio.onended = audio.onerror = () => setPlayingAudio(null);
      try {
        await audio.play();
        setPlayingAudio(audioId);
      } catch {
        setPlayingAudio(null);
      }
    }
  };

  const handleMediaClick = (attachment, e) => {
    e.stopPropagation();
    setMediaPopup(attachment);
  };

  const handleDownload = async (attachment, e) => {
    e.stopPropagation();
    const response = await fetch(attachment.url);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.filename || "download";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((a) => {
        if (a) {
          a.pause();
          a.src = "";
        }
      });
    };
  }, []);

  const getGridClasses = (c) => (c === 1 ? "grid-cols-1" : "grid-cols-2");
  const getImageClasses = (i, t) =>
    t === 3 && i === 0 ? "col-span-2 aspect-[2/1]" : "col-span-1 aspect-square";

  const maxVisible = 4;

  const mediaAttachments = attachmentsForUser.filter((att) =>
    ["image", "video"].includes(att.fileType) && !att.deletedForEveryone
  );

  const nonMediaAttachments = attachmentsForUser.filter(
    (att) =>
      att.fileType === "audio" ||
      att.fileType === "raw" ||
      (["image", "video"].includes(att.fileType) && att.deletedForEveryone)
  );

  const shouldShowViewAll = mediaAttachments.length > maxVisible;
  const displayedMedia = mediaAttachments.slice(0, maxVisible);
  const hiddenMediaCount = mediaAttachments.length - displayedMedia.length;

  // ---------------------- Document Viewer ----------------------
  const DocumentViewer = ({ attachment }) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
      const extension = attachment.filename
        ? attachment.filename.split(".").pop().toLowerCase()
        : "";
      const officeDocs = ["doc", "docx", "ppt", "pptx", "pdf"];
      const excelDocs = ["xls", "xlsx"];
      const getContent = async () => {
        try {
          if (textFiles.includes(extension)) {
            const resp = await fetch(attachment.url);
            const txt = await resp.text();
            setContent({
              type: "text",
              value: txt,
              extension,
            });
          } else if (officeDocs.includes(extension)) {
            setContent({
              type: "iframe",
              value: `https://docs.google.com/viewer?url=${encodeURIComponent(
                attachment.url
              )}&embedded=true`,
            });
          } else if (excelDocs.includes(extension)) {
            setContent({
              type: "iframe",
              value: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                attachment.url
              )}`,
            });
          } else {
            setContent({ type: "iframe", value: attachment.url });
          }
        } catch {
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      getContent();
    }, [attachment.url, attachment.filename]);

    if (loading)
      return (
        <div className="bg-zinc-900 p-8 text-white text-center rounded-lg">
          Loading document…
        </div>
      );
    if (error)
      return (
        <div className="bg-zinc-900 p-8 text-white text-center rounded-lg">
          <div className="mb-4">Unable to preview this document</div>
          <button
            onClick={() => window.open(attachment.url, "_blank")}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Open in new tab
          </button>
        </div>
      );

    if (content?.type === "text")
      return (
        <div className="bg-white rounded-lg max-h-[80vh] overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b">
            <div className="font-medium text-gray-900">
              {attachment.filename}
            </div>
          </div>
          <div className="p-4 overflow-auto max-h-[calc(80vh-60px)]">
            <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
              <SyntaxHighlighter
                language={content.extension}
                style={coy}
                wrapLines
                wrapLongLines
              >
                {content.value}
              </SyntaxHighlighter>
            </pre>
          </div>
        </div>
      );

    if (content?.type === "iframe")
      return (
        <iframe
          src={content.value}
          title={attachment.filename}
          className="w-full h-[80vh] bg-white rounded-lg"
        />
      );

    return null;
  };

  // ---------------------- Individual Media Popup ----------------------
  const MediaPopup = ({ attachment }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <button
          onClick={() => setMediaPopup(null)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl z-10 bg-black bg-opacity-50 rounded-full p-2"
        >
          <X size={24} />
        </button>

        {attachment.fileType === "image" ? (
          <img
            className="w-full h-full object-contain rounded-lg"
            src={attachment.url}
            alt={attachment.filename}
          />
        ) : attachment.fileType === "video" ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain rounded-lg"
            src={attachment.url}
            controls
            autoPlay
          />
        ) : attachment.fileType === "audio" ? (
          <div className="bg-zinc-900 rounded-lg p-8 text-center">
            <div className="text-white mb-4">
              <div className="text-xl font-medium mb-2">
                {attachment.filename}
              </div>
              <div className="text-gray-400">
                {formatFileSize(attachment.fileSize)}
              </div>
            </div>
            <audio
              className="w-full"
              src={attachment.url}
              controls
              autoPlay
            />
          </div>
        ) : attachment.fileType === "raw" ? (
          <DocumentViewer attachment={attachment} />
        ) : null}

        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
          {formatFileSize(attachment.fileSize)}
        </div>
      </div>
    </div>
  );

  // ---------------------- Main Render ----------------------
  return (
    <div className="w-full max-w-lg space-y-2 ">
      {/* Media grid */}
      {mediaAttachments.length > 0 && (
        <div className="w-full">
          <div
            className={`grid ${getGridClasses(
              Math.min(mediaAttachments.length, maxVisible)
            )} gap-1 rounded-lg overflow-hidden w-full`}
          >
            {displayedMedia.map((att, idx) => (
              <div
                key={att.public_id || idx}

                className={`relative ${getImageClasses(
                  idx,
                  Math.min(mediaAttachments.length, maxVisible)
                )} overflow-hidden cursor-pointer`}
                onClick={
                  !att.deletedForEveryone
                    ? (e) => handleMediaClick(att, e)
                    : undefined
                }
              >
                {att.deletedForEveryone ? (
                  <div onContextMenu={(e) => e.stopPropagation()} className="w-full h-full bg-[#2d2d2d] flex items-center justify-center text-gray-400 italic text-xs">
                  this message was deleted
                  </div>
                ) : att.fileType === "image" ? (
                  <img
                    onContextMenu={(e) =>
                      handleContextMenu(_id, { type: "attachment", attachment: att }, e)
                    }
                    className="w-full h-full object-cover"
                    src={att.url}
                    alt={att.filename}
                  />
                ) : (
                  <div onContextMenu={(e) =>
                    handleContextMenu(_id, { type: "attachment", attachment: att }, e)
                  }
                    className="relative w-full h-full">
                    <video
                      className="w-full h-full object-cover"
                      src={att.url}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="bg-white bg-opacity-80 rounded-full p-3">
                        <Play size={20} className="text-black ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {!att.deletedForEveryone && (
                  <div className="absolute bottom-1 left-1 bg-zinc-800 bg-opacity-60 text-white text-[10px] px-1 py-0.5 rounded">
                    {formatFileSize(att.fileSize)}
                  </div>
                )}

                {idx === maxVisible - 1 &&
                  shouldShowViewAll &&
                  hiddenMediaCount > 0 && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewAll(true);
                      }}
                      className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer"
                    >
                      <span className="text-white text-lg font-medium">
                        +{hiddenMediaCount}
                      </span>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Non‑media files (audio/docs) */}
      {nonMediaAttachments.length > 0 && (
        <div className="space-y-1 w-full">
          {nonMediaAttachments.map((att) => (
            <div
              key={att.public_id}
              onContextMenu={(e) =>
                handleContextMenu(_id, { type: "attachment", attachment: att }, e)
              }
              className="bg-zinc-100 rounded p-2 flex items-center gap-2 w-full"
            >
              <div className="text-gray-600 flex-shrink-0">
                {getFileIcon(att.fileType)}
              </div>

              {att.deletedForEveryone ? (
                <div onContextMenu={(e) => e.stopPropagation()} className="flex-1 min-w-0 text-xs italic text-gray-500">
                  this message was deleted
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate">
                      {att.filename}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(att.fileSize)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {att.fileType === "audio" && (
                      <button
                        onClick={(e) => handleAudioPlay(att, e)}
                        className="text-blue-500 hover:text-blue-600 p-1"
                        title={
                          playingAudio === att.public_id ? "Pause" : "Play"
                        }
                      >
                        {playingAudio === att.public_id ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                      </button>
                    )}
                    <button
                      onClick={(e) => handleMediaClick(att, e)}
                      className="text-green-500 hover:text-green-600 p-1"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDownload(att, e)}
                      className="text-gray-500 hover:text-gray-600 p-1"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* View‑all gallery popup */}
      {viewAll && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
          <button
            onClick={() => setViewAll(false)}
            className="self-end mb-2 text-white bg-zinc-800 rounded-full px-3 py-1"
          >
            Close
          </button>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full max-w-5xl">
            {mediaAttachments.map((att, i) => (
              <div
                key={att.public_id || i}
                className="relative cursor-pointer group"
                onClick={() => {
                  if (!att.deletedForEveryone) setMediaPopup(att);
                }}
              >
                {att.deletedForEveryone ? (
                  <div className="w-full h-full bg-[#2d2d2d] flex items-center justify-center text-gray-400 italic text-xs">
                  this message was deleted
                    
                  </div>
                ) : att.fileType === "image" ? (
                  <img
                    src={att.url}
                    alt={att.filename}
                    className="object-cover w-full h-full rounded group-hover:opacity-90 transition"
                  />
                ) : att.fileType === "video" ? (
                  <div className="relative w-full h-full overflow-hidden rounded">
                    <video
                      src={att.url}
                      className="object-cover w-full h-full group-hover:opacity-90 transition"
                      muted
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="bg-white bg-opacity-80 rounded-full p-2">
                        <Play size={20} className="text-black" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {mediaPopup && <MediaPopup attachment={mediaPopup} />}
    </div>
  );
}

export default AttachmentGrid;