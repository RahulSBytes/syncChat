// ShowProfileAttachmentList.jsx
import { X, Play, Pause, Download, FileText, File, Eye, Music, Video, Image as ImageIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { textFiles } from '../constants/constants';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ShowProfileAttachmentList({ files, onClose }) {
    const [playingAudio, setPlayingAudio] = useState(null);
    const [mediaPopup, setMediaPopup] = useState(null);
    const audioRefs = useRef({});
    const videoRef = useRef(null);

    const formatFileSize = (size) => {
        if (!size) return '';
        if (typeof size === 'string') {
            return size;
        }
        // If size is a number, format it
        if (typeof size === 'number') {
            const sizeInMB = (size / (1024 * 1024)).toFixed(2);
            return `${sizeInMB} MB`;
        }
        return '';
    };

    const getFileIcon = (fileType, filename) => {
        switch (fileType) {
            case 'raw':
                const extension = filename?.split('.').pop()?.toLowerCase();
                if (['pdf'].includes(extension)) {
                    return <FileText size={20} className="text-red-500" />;
                } else if (['doc', 'docx'].includes(extension)) {
                    return <FileText size={20} className="text-blue-500" />;
                } else if (['xls', 'xlsx'].includes(extension)) {
                    return <FileText size={20} className="text-green-500" />;
                }
                return <FileText size={20} className="text-gray-500" />;
            case 'audio':
                return <Music size={20} className="text-purple-500" />;
            case 'video':
                return <Video size={20} className="text-blue-500" />;
            case 'image':
                return <ImageIcon size={20} className="text-green-500" />;
            default:
                return <File size={20} className="text-gray-500" />;
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
            // Pause all other audio
            Object.values(audioRefs.current).forEach(audio => {
                if (audio && !audio.paused) {
                    audio.pause();
                }
            });

            if (!currentAudio) {
                // Create new audio element
                const audio = new Audio(attachment.url);
                audioRefs.current[audioId] = audio;

                audio.onended = () => setPlayingAudio(null);
                audio.onerror = () => {
                    console.error('Error playing audio');
                    setPlayingAudio(null);
                };

                try {
                    await audio.play();
                    setPlayingAudio(audioId);
                } catch (error) {
                    console.error('Error playing audio:', error);
                }
            } else {
                try {
                    await currentAudio.play();
                    setPlayingAudio(audioId);
                } catch (error) {
                    console.error('Error playing audio:', error);
                }
            }
        }
    };

    const handleFileView = (attachment, e) => {
        e.stopPropagation();
        setMediaPopup(attachment);
    };

    const handleDownload = async (attachment, e) => {
        e.stopPropagation();
        try {
            const response = await fetch(attachment.url);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = attachment.filename || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
        }
    };

    const closeMediaPopup = () => {
        setMediaPopup(null);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    // Cleanup audio references
    useEffect(() => {
        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
            });
        };
    }, []);

    // Document viewer component
    const DocumentViewer = ({ attachment }) => {
        const [content, setContent] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);

        let extension;
        useEffect(() => {
            extension = attachment.filename
                ? attachment.filename.split('.').pop().toLowerCase()
                : '';

            // console.log("extensionnn :: ", extension)

            const textBasedFiles = textFiles;
            const officeDocs = ['doc', 'docx', 'ppt', 'pptx', 'pdf'];
            const excelDocs = ['xls', 'xlsx'];

            const fetchContent = async () => {
                try {
                    if (textBasedFiles.includes(extension)) {
                        const response = await fetch(attachment.url);
                        const textContent = await response.text();
                        setContent({
                            type: 'text',
                            value: textContent,
                            extension: extension
                        });
                    } else if (officeDocs.includes(extension)) {
                        setContent({
                            type: 'iframe',
                            value: `https://docs.google.com/viewer?url=${encodeURIComponent(
                                attachment.url
                            )}&embedded=true`,
                        });
                    } else if (excelDocs.includes(extension)) {
                        setContent({
                            type: 'iframe',
                            value: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                                attachment.url
                            )}`,
                        });
                    } else {
                        setContent({ type: 'iframe', value: attachment.url });
                    }
                } catch (err) {
                    console.error('Error fetching document:', err);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            };

            fetchContent();
        }, [attachment.url, attachment.filename]);

        if (loading) {
            return (
                <div className="bg-zinc-900 rounded-lg p-8 text-center text-white">
                    <div>Loading document...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-zinc-900 rounded-lg p-8 text-center text-white">
                    <div className="mb-4">Unable to preview this document</div>
                    <button
                        onClick={() => window.open(attachment.url, '_blank')}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                    >
                        Open in New Tab
                    </button>
                </div>
            );
        }

        if (content?.type === 'text') {
            return (
                <div className="bg-white rounded-lg max-h-[80vh] overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b">
                        <div className="font-medium text-gray-900">{attachment.filename}</div>
                    </div>
                    <div className="p-4 overflow-auto max-h-[calc(80vh-60px)]">
                        <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
                            <SyntaxHighlighter language={content.extension} style={coy}>
                                {content.value}
                            </SyntaxHighlighter>
                        </pre>
                    </div>
                </div>
            );
        }

        if (content?.type === 'iframe') {
            return (
                <iframe
                    src={content.value}
                    title={attachment.filename}
                    className="w-full h-[80vh] bg-white rounded-lg"
                />
            );
        }

        return null;
    };

    // Media popup component
    const MediaPopup = ({ attachment }) => (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-[90vh] w-full">
                <button
                    onClick={closeMediaPopup}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl z-10 bg-black bg-opacity-50 rounded-full p-2"
                >
                    <X size={24} />
                </button>

                {attachment.fileType === 'image' ? (
                    <img
                        className="w-full h-full object-contain rounded-lg"
                        src={attachment.url}
                        alt={attachment.filename}
                    />
                ) : attachment.fileType === 'video' ? (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain rounded-lg"
                        src={attachment.url}
                        controls
                        autoPlay
                    />
                ) : attachment.fileType === 'audio' ? (
                    <div className="bg-zinc-900 rounded-lg p-8 text-center">
                        <div className="text-white mb-4">
                            <div className="text-xl font-medium mb-2">{attachment.filename}</div>
                            <div className="text-gray-400">{formatFileSize(attachment.fileSize)}</div>
                        </div>
                        <audio
                            className="w-full"
                            src={attachment.url}
                            controls
                            autoPlay
                        />
                    </div>
                ) : attachment.fileType === 'raw' ? (
                    <DocumentViewer attachment={attachment} />
                ) : null}

                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                    {formatFileSize(attachment.fileSize)}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Main popup */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                <div className="bg-surface dark:bg-surface-dark rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
                    {/* Header with close button */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-600">
                        <h3 className="text-lg font-semibold text-muted dark:text-muted-dark">Attachments ({files.length})</h3>
                        <button
                            onClick={onClose}
                            className="text-secondary dark:text-secondary-dark transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Files list - scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {files.length === 0 ? (
                            <div className="text-center text-placeholder-txt py-8">
                                No files available
                            </div>
                        ) :
                            files.map((file, index) => (
                                <div
                                    key={file.public_id || index}
                                    className="flex items-center gap-3 p-3 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                                    onClick={(e) => handleFileView(file, e)}
                                >
                                    {/* Preview/Icon */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-gray-700 flex items-center justify-center">
                                        {file.fileType === 'image' ? (
                                            <img
                                                src={file.url}
                                                className="w-full h-full object-cover"
                                                alt="Preview"
                                            />
                                        ) : file.fileType === 'video' ? (
                                            <div className="relative w-full h-full">
                                                <video
                                                    src={file.url}
                                                    className="w-full h-full object-cover"
                                                    muted
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                                    <Play size={16} className="text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            getFileIcon(file.fileType, file.filename)
                                        )}
                                    </div>

                                    {/* File info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-secondary dark:text-secondary-dark text-sm truncate font-medium">{file.filename || 'Unnamed file'}</p>
                                        <p className="text-gray-500 text-xs">{formatFileSize(file.fileSize)}</p>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2">
                                        {file.fileType === 'audio' && (
                                            <button
                                                onClick={(e) => handleAudioPlay(file, e)}
                                                className="text-blue-400 hover:text-blue-300 p-1 transition-colors"
                                                title={playingAudio === file.public_id ? 'Pause' : 'Play'}
                                            >
                                                {playingAudio === file.public_id ?
                                                    <Pause size={18} /> : <Play size={18} />
                                                }
                                            </button>
                                        )}

                                        {(file.fileType === 'image' || file.fileType === 'video' || file.fileType === 'raw') && (
                                            <button
                                                onClick={(e) => handleFileView(file, e)}
                                                className="text-accent  p-1 transition-colors"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        )}

                                        <button
                                            onClick={(e) => handleDownload(file, e)}
                                            className="text-gray-500  p-1 transition-colors"
                                            title="Download"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {mediaPopup && <MediaPopup attachment={mediaPopup} />}
        </>
    );
}

export default ShowProfileAttachmentList;