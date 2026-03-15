import { Check, CheckCheck } from "lucide-react";

function MessageStatus({ status }) {

  if (status === "sent") {
    return <Check size={12} strokeWidth={2} absoluteStrokeWidth className="text-gray-400" />;
  }
  
  if (status === "delivered") {
    return <CheckCheck size={12} strokeWidth={2} absoluteStrokeWidth className="text-gray-400" />;
  }
  
  if (status === "read") {
    return <CheckCheck size={12} strokeWidth={2} absoluteStrokeWidth className="text-blue-500" />;
  }
  
  return null;
}

export default MessageStatus;